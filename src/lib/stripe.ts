import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// 価格ID（Stripeで作成後に環境変数に設定）
export const STARTER_PRICE_ID = process.env.STRIPE_STARTER_PRICE_ID || "";
export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID || "";
export const AGENCY_PRICE_ID = process.env.STRIPE_AGENCY_PRICE_ID || "";

// プラン定義
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    projects: 1,
    testimonials: 10, // 月10件まで
    features: ["プロジェクト1つ", "口コミ収集 10件/月", "基本ウィジェット", "VoiceWallロゴ表示あり"],
  },
  starter: {
    name: "Starter",
    price: 1480,
    projects: 3,
    testimonials: 50, // 月50件まで
    features: [
      "プロジェクト3つ",
      "口コミ収集 50件/月",
      "ロゴ非表示",
      "ウィジェットカスタマイズ",
      "メールサポート",
    ],
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
      "AI口コミ要約",
      "優先サポート",
    ],
  },
  agency: {
    name: "Agency",
    price: 9800,
    projects: -1, // 無制限
    testimonials: -1, // 無制限
    features: [
      "プロジェクト無制限",
      "口コミ収集 無制限",
      "全カスタマイズ機能",
      "AI口コミ要約・事例自動生成",
      "業種別テンプレート",
      "クライアント管理ダッシュボード",
      "CSVエクスポート",
      "ホワイトラベル対応",
      "専任サポート",
    ],
  },
};
