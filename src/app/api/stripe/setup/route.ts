import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// Stripeに商品と価格を作成するワンタイムAPIyarn
// ブラウザで /api/stripe/setup にアクセスすると実行される
export async function GET() {
  try {
    // 既存の商品を確認
    const existingProducts = await stripe.products.list({ limit: 10 });
    const voicewallPro = existingProducts.data.find(
      (p) => p.name === "VoiceWall Pro" && p.active
    );

    if (voicewallPro) {
      // 既存の価格を取得
      const prices = await stripe.prices.list({
        product: voicewallPro.id,
        active: true,
      });

      return NextResponse.json({
        message: "商品は既に存在します",
        productId: voicewallPro.id,
        priceId: prices.data[0]?.id,
        instruction: "この priceId を .env.local の STRIPE_PRO_PRICE_ID に設定してください",
      });
    }

    // 新しい商品を作成
    const product = await stripe.products.create({
      name: "VoiceWall Pro",
      description:
        "プロジェクト無制限・口コミ収集無制限・ロゴ非表示・ウィジェットカスタマイズ・CSVエクスポート",
    });

    // 価格を作成（月額980円）
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 980,
      currency: "jpy",
      recurring: {
        interval: "month",
      },
    });

    return NextResponse.json({
      message: "商品と価格を作成しました",
      productId: product.id,
      priceId: price.id,
      instruction: "この priceId を .env.local の STRIPE_PRO_PRICE_ID に設定してください",
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: "セットアップに失敗しました" }, { status: 500 });
  }
}
