// 業種別テンプレート定義
export interface IndustryTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  placeholderComment: string;
  placeholderTitle: string;
  questions: string[]; // 口コミフォームのガイド質問
  color: string;
}

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  {
    id: "general",
    name: "汎用",
    icon: "📝",
    description: "業種を問わず使える標準テンプレート",
    placeholderComment: "サービスを使った感想をお聞かせください...",
    placeholderTitle: "株式会社〇〇 代表",
    questions: [],
    color: "#2563eb",
  },
  {
    id: "restaurant",
    name: "飲食店",
    icon: "🍽️",
    description: "レストラン・カフェ・居酒屋向け",
    placeholderComment: "お料理の味やお店の雰囲気、スタッフの対応はいかがでしたか？",
    placeholderTitle: "30代 会社員",
    questions: [
      "料理の味はいかがでしたか？",
      "お店の雰囲気や清潔感はどうでしたか？",
      "スタッフの対応は満足でしたか？",
      "また来たいと思いますか？",
    ],
    color: "#ea580c",
  },
  {
    id: "beauty",
    name: "美容サロン",
    icon: "💇",
    description: "美容室・エステ・ネイルサロン向け",
    placeholderComment: "施術の仕上がりやサロンの雰囲気、スタッフの対応はいかがでしたか？",
    placeholderTitle: "20代 OL",
    questions: [
      "仕上がりには満足していますか？",
      "カウンセリングは丁寧でしたか？",
      "サロンの雰囲気やリラックス度は？",
      "友人にも勧めたいですか？",
    ],
    color: "#db2777",
  },
  {
    id: "medical",
    name: "医療・クリニック",
    icon: "🏥",
    description: "病院・歯科・クリニック向け",
    placeholderComment: "診察や治療の内容、先生やスタッフの対応はいかがでしたか？",
    placeholderTitle: "40代 主婦",
    questions: [
      "先生の説明はわかりやすかったですか？",
      "待ち時間はどうでしたか？",
      "スタッフの対応は親切でしたか？",
      "院内の清潔感はいかがでしたか？",
    ],
    color: "#0891b2",
  },
  {
    id: "education",
    name: "教育・スクール",
    icon: "📚",
    description: "塾・スクール・オンライン講座向け",
    placeholderComment: "授業の質やカリキュラム、講師の対応はいかがでしたか？",
    placeholderTitle: "高校生の保護者",
    questions: [
      "授業・講座の質は満足でしたか？",
      "講師の教え方はわかりやすかったですか？",
      "学習効果を実感できましたか？",
      "料金に見合った価値がありましたか？",
    ],
    color: "#7c3aed",
  },
  {
    id: "ec",
    name: "EC・通販",
    icon: "🛒",
    description: "ネットショップ・通販サイト向け",
    placeholderComment: "商品の品質や配送、カスタマーサポートの対応はいかがでしたか？",
    placeholderTitle: "30代 会社員",
    questions: [
      "商品は期待通りでしたか？",
      "注文から届くまでの速さは？",
      "梱包や商品の状態はどうでしたか？",
      "リピート購入したいと思いますか？",
    ],
    color: "#16a34a",
  },
];

export function getTemplateById(id: string): IndustryTemplate {
  return INDUSTRY_TEMPLATES.find((t) => t.id === id) || INDUSTRY_TEMPLATES[0];
}
