const fs = require('fs');
const path = require('path');
const dir = path.join('src', 'app');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, {recursive: true});
fs.writeFileSync(path.join(dir, 'layout.tsx'), import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VoiceWall - Collect & Showcase Testimonials",
  description: "The easiest way to collect, manage, and display customer testimonials. Boost conversions with social proof.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, fontFamily: "'Inter', 'Noto Sans JP', sans-serif" }}>{children}</body>
    </html>
  );
}
);
console.log('Created: src/app/layout.tsx');
