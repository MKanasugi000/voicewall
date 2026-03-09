import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VoiceWall - 口コミを集めて、見せる。",
  description: "テスティモニアルの収集・管理・表示をひとつのツールで完結。無料で始められます。",
  metadataBase: new URL("https://voicewall.vercel.app"),
  openGraph: {
    title: "VoiceWall - 口コミを集めて、見せる。",
    description: "テスティモニアルの収集・管理・表示をひとつのツールで完結。リンクを共有するだけで口コミが集まります。",
    url: "https://voicewall.vercel.app",
    siteName: "VoiceWall",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VoiceWall - 口コミを集めて、見せる。",
    description: "テスティモニアルの収集・管理・表示をひとつのツールで完結。無料で始められます。",
  },
  keywords: ["口コミ", "テスティモニアル", "レビュー", "SaaS", "ウィジェット", "フィードバック", "VoiceWall"],
  robots: "index, follow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💬</text></svg>" />
      </head>
      <body style={{ margin: 0, fontFamily: "Inter, Noto Sans JP, sans-serif" }}>{children}</body>
    </html>
  );
}
