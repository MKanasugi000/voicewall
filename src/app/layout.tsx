import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VoiceWall - Collect & Showcase Testimonials",
  description: "The easiest way to collect, manage, and display customer testimonials.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: "Inter, Noto Sans JP, sans-serif" }}>{children}</body>
    </html>
  );
}