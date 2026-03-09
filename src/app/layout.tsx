import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VoiceWall - 口コミを集めて、見せる。",
  description: "お客様の声を収集・管理・表示できるオールインワンツール。コード1行でサイトに埋め込み。無料で始められます。",
  metadataBase: new URL("https://voicewall.vercel.app"),
  openGraph: {
    title: "VoiceWall - 口コミを集めて、見せる。",
    description: "お客様の声を収集・管理・表示できるオールインワンツール。コード1行でサイトに埋め込み、信頼を可視化。",
    url: "https://voicewall.vercel.app",
    siteName: "VoiceWall",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://voicewall.vercel.app/api/og",
        width: 1200,
        height: 630,
        alt: "VoiceWall - 口コミを集めて、見せる。",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceWall - 口コミを集めて、見せる。",
    description: "お客様の声を収集・管理・表示できるオールインワンツール。無料で始められます。",
    images: ["https://voicewall.vercel.app/api/og"],
  },
  keywords: ["口コミ", "テスティモニアル", "レビュー", "口コミ管理", "口コミ収集", "ウィジェット", "フィードバック", "VoiceWall", "SaaS", "口コミ表示", "お客様の声"],
  robots: "index, follow",
  alternates: {
    canonical: "https://voicewall.vercel.app",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "VoiceWall",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://voicewall.vercel.app",
  description: "お客様の声を収集・管理・表示できるオールインワンツール",
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "JPY",
      description: "プロジェクト1つ、口コミ収集10件/月",
    },
    {
      "@type": "Offer",
      name: "Starter",
      price: "1480",
      priceCurrency: "JPY",
      billingIncrement: "P1M",
      description: "プロジェクト3つ、口コミ収集50件/月",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "2980",
      priceCurrency: "JPY",
      billingIncrement: "P1M",
      description: "プロジェクト無制限、口コミ収集無制限、AI口コミ要約",
    },
    {
      "@type": "Offer",
      name: "Agency",
      price: "9800",
      priceCurrency: "JPY",
      billingIncrement: "P1M",
      description: "全機能無制限、ホワイトラベル対応、専任サポート",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "4",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💬</text></svg>" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ margin: 0, fontFamily: "Inter, Noto Sans JP, sans-serif" }}>{children}</body>
    </html>
  );
}
