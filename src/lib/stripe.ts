import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// Proプランの価格ID（Stripeで作成後にここに設定）
export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || "";

// プラン定義
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    projects: 1,
    testimonials: 10, // 月10件まで
    features: ["プロジェクト1つ", "口コミ収集 10件/月", "VoiceWallロゴ表示あり"],
  },
  pro: {
    name: "Pro",
    price: 2980,
    projects: -1, // 無制限
    testimonials: -1, // 無制限
    features: [
      "プロジェクト無制限",
      "口コミ収集 無制限",
      "ロゴ非表示",
      "ウィジェットカスタマイズ",
      "CSVエクスポート",
    ],
  },
};
