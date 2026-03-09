import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// 一時的なPrice作成エンドポイント（本番デプロイ後に削除すること）
// 管理者メールのみ実行可能
export async function POST(request: Request) {
  try {
    const { adminKey } = await request.json();

    // 簡易認証
    if (adminKey !== "mildsolt-setup-2026") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 既存のProductを検索
    const products = await stripe.products.list({ limit: 10 });
    let productId = products.data.find(p => p.name.includes("VoiceWall"))?.id;

    // Productがなければ作成
    if (!productId) {
      const product = await stripe.products.create({
        name: "VoiceWall Subscription",
        description: "VoiceWall 口コミ収集・管理・表示ツール",
      });
      productId = product.id;
    }

    // Starter Price (¥1,480/月)
    const starterPrice = await stripe.prices.create({
      product: productId,
      unit_amount: 1480,
      currency: "jpy",
      recurring: { interval: "month" },
      nickname: "Starter Plan",
    });

    // Agency Price (¥9,800/月)
    const agencyPrice = await stripe.prices.create({
      product: productId,
      unit_amount: 9800,
      currency: "jpy",
      recurring: { interval: "month" },
      nickname: "Agency Plan",
    });

    return NextResponse.json({
      success: true,
      productId,
      starterPriceId: starterPrice.id,
      agencyPriceId: agencyPrice.id,
      message: "Price IDs created! Add these to .env.local and Vercel env vars.",
      envVars: {
        STRIPE_STARTER_PRICE_ID: starterPrice.id,
        STRIPE_AGENCY_PRICE_ID: agencyPrice.id,
      },
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
