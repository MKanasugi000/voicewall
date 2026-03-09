"use client";
import { useState } from "react";

const testimonials = [
  { name: "田中 美咲", company: "デザインスタジオ", stars: 5, text: "口コミの収集がこんなに簡単だとは思いませんでした。導入して2週間で20件以上集まりました！", avatar: "MT" },
  { name: "佐藤 健一", company: "株式会社テックラボ", stars: 5, text: "ウィジェットのデザインが美しく、サイトのコンバージョン率が15%向上しました。", avatar: "KS" },
  { name: "鈴木 遥", company: "フリーランス", stars: 4, text: "シンプルで使いやすいUIが気に入っています。メール自動リクエスト機能が特に便利です。", avatar: "HS" },
  { name: "Alex Johnson", company: "SaaS Startup", stars: 5, text: "海外のお客様からの声も一括管理できるのが素晴らしい。", avatar: "AJ" },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSubmitted(true);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const features = [
    { icon: "📝", t: "簡単収集", d: "リンクを共有するだけ。顧客がブラウザから直接口コミを送信できます。" },
    { icon: "📊", t: "一元管理", d: "集まった口コミをダッシュボードで確認・承認・管理。" },
    { icon: "🎨", t: "自由に表示", d: "美しいウィジェットをコード1行でサイトに埋め込み。" },
    { icon: "💳", t: "収益化対応", d: "Free/Proプランで段階的にスケール。Stripe決済に対応。" },
  ];

  const steps = [
    { n: "1", t: "フォームを作成", d: "アカウント登録後、収集フォームのリンクが自動生成。" },
    { n: "2", t: "口コミを集める", d: "リンクを共有するだけで、顧客が直接フィードバックを送信。" },
    { n: "3", t: "サイトに表示", d: "ウィジェットコードを貼り付けるだけ。承認制で安心。" },
  ];

  const plans = [
    {
      name: "Free",
      price: "¥0",
      per: "",
      items: ["プロジェクト1つ", "口コミ収集 5件/月", "基本ウィジェット", "VoiceWallロゴ表示"],
      btn: "無料で始める",
      href: "/login",
      featured: false,
    },
    {
      name: "Pro",
      price: "¥980",
      per: "/ 月",
      items: ["プロジェクト無制限", "口コミ収集 無制限", "ロゴ非表示", "ウィジェットカスタマイズ", "CSVエクスポート", "優先サポート"],
      btn: "Proを始める",
      href: "/pricing",
      featured: true,
    },
  ];

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      {/* Nav */}
      <nav style={{
        background: "#fff",
        borderBottom: "1px solid #e2e8f0",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 60,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>
          <span style={{ color: "#2563eb" }}>Voice</span>
          <span style={{ color: "#1e293b" }}>Wall</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <a href="#features" style={{ padding: "8px 16px", borderRadius: 8, fontSize: 14, textDecoration: "none", color: "#64748b", fontWeight: 500 }}>機能</a>
          <a href="#pricing" style={{ padding: "8px 16px", borderRadius: 8, fontSize: 14, textDecoration: "none", color: "#64748b", fontWeight: 500 }}>料金</a>
          <a href="/dashboard" style={{ padding: "8px 16px", borderRadius: 8, fontSize: 14, textDecoration: "none", color: "#64748b", fontWeight: 500 }}>管理画面</a>
          <a href="/login" style={{ padding: "8px 16px", borderRadius: 8, fontSize: 14, textDecoration: "none", color: "#fff", fontWeight: 600, background: "#2563eb" }}>無料で始める</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "80px 20px 60px", maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 800, lineHeight: 1.2, marginBottom: 16, color: "#1e293b" }}>
          口コミを<span style={{ color: "#2563eb" }}>集めて</span>、<span style={{ color: "#2563eb" }}>見せる</span>。
        </h1>
        <p style={{ fontSize: 18, color: "#64748b", maxWidth: 600, margin: "0 auto 32px" }}>
          VoiceWallは、テスティモニアルの収集・管理・表示をひとつのツールで完結できるサービスです。
        </p>
        <a href="/login" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 8, background: "#2563eb", color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none" }}>
          無料で始める
        </a>
        <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>クレジットカード不要</p>
      </section>

      {/* Features */}
      <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
        {features.map((f, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 32, border: "1px solid #e2e8f0" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 16 }}>{f.icon}</div>
            <h3 style={{ fontSize: 18, marginBottom: 8, color: "#1e293b" }}>{f.t}</h3>
            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>{f.d}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section style={{ background: "#fff", padding: "60px 20px", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 48, color: "#1e293b" }}>3ステップで始められます</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 40 }}>
            {steps.map((s, i) => (
              <div key={i}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, margin: "0 auto 16px" }}>{s.n}</div>
                <h3 style={{ fontSize: 18, marginBottom: 8, color: "#1e293b" }}>{s.t}</h3>
                <p style={{ color: "#64748b", fontSize: 14 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 20px" }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, textAlign: "center", marginBottom: 40, color: "#1e293b" }}>利用者の声</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
          {testimonials.map((r, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
              <div style={{ color: "#f59e0b", letterSpacing: 2, marginBottom: 12, fontSize: 16 }}>
                {"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}
              </div>
              <p style={{ fontSize: 14, color: "#1e293b", lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>
                &ldquo;{r.text}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#2563eb" }}>{r.avatar}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{r.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ background: "#fff", padding: "60px 20px", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: "#1e293b" }}>料金プラン</h2>
          <p style={{ color: "#64748b", marginBottom: 40 }}>まずは無料で始めましょう。</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 700, margin: "0 auto" }}>
            {plans.map((p, i) => (
              <div key={i} style={{
                background: "#fff",
                borderRadius: 16,
                padding: 32,
                border: p.featured ? "2px solid #2563eb" : "1px solid #e2e8f0",
                textAlign: "left",
                position: "relative",
                boxShadow: p.featured ? "0 8px 30px rgba(37,99,235,0.12)" : "none",
              }}>
                {p.featured && (
                  <span style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#2563eb", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 99 }}>
                    おすすめ
                  </span>
                )}
                <h3 style={{ fontSize: 20, color: "#1e293b", marginBottom: 4 }}>{p.name}</h3>
                <div style={{ fontSize: 36, fontWeight: 800, margin: "12px 0", color: "#1e293b" }}>
                  {p.price}
                  {p.per && <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 400 }}> {p.per}</span>}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "20px 0" }}>
                  {p.items.map((item, j) => (
                    <li key={j} style={{ padding: "6px 0", fontSize: 14, color: "#64748b" }}>✓ {item}</li>
                  ))}
                </ul>
                <a href={p.href} style={{
                  display: "block",
                  textAlign: "center",
                  padding: "12px 24px",
                  borderRadius: 8,
                  background: p.featured ? "#2563eb" : "#fff",
                  color: p.featured ? "#fff" : "#1e293b",
                  border: p.featured ? "none" : "1px solid #e2e8f0",
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: "none",
                }}>
                  {p.btn}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist / CTA */}
      <section id="waitlist" style={{ padding: "60px 20px", maxWidth: 500, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: "#1e293b" }}>最新情報を受け取る</h2>
        <p style={{ color: "#64748b", marginBottom: 24 }}>新機能やアップデート情報をお届けします。</p>
        {!submitted ? (
          <form onSubmit={handleWaitlist} style={{ display: "flex", gap: 8 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              required
              style={{ flex: 1, padding: "12px 16px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 15, outline: "none" }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{ padding: "12px 24px", borderRadius: 8, background: loading ? "#93c5fd" : "#2563eb", color: "#fff", border: "none", fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "..." : "登録する"}
            </button>
          </form>
        ) : (
          <div style={{ background: "#d1fae5", color: "#065f46", padding: "16px 24px", borderRadius: 8, fontWeight: 500 }}>
            登録ありがとうございます！
          </div>
        )}
      </section>

      {/* Final CTA */}
      <section style={{ background: "#1e293b", padding: "60px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 12 }}>今すぐ口コミを集めませんか？</h2>
        <p style={{ color: "#94a3b8", marginBottom: 24 }}>無料プランで今日から始められます。</p>
        <a href="/login" style={{ display: "inline-block", padding: "14px 32px", borderRadius: 8, background: "#2563eb", color: "#fff", fontSize: 16, fontWeight: 600, textDecoration: "none" }}>
          無料で始める →
        </a>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0f172a", padding: "40px 20px", color: "#94a3b8", fontSize: 14 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
              <span style={{ color: "#60a5fa" }}>Voice</span>
              <span style={{ color: "#fff" }}>Wall</span>
            </div>
            <p style={{ maxWidth: 300 }}>テスティモニアルの収集・管理・表示をひとつのツールで。</p>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <a href="/pricing" style={{ color: "#94a3b8", textDecoration: "none" }}>料金</a>
            <a href="/login" style={{ color: "#94a3b8", textDecoration: "none" }}>ログイン</a>
            <a href="/dashboard" style={{ color: "#94a3b8", textDecoration: "none" }}>管理画面</a>
            <a href="/terms" style={{ color: "#94a3b8", textDecoration: "none" }}>利用規約</a>
            <a href="/privacy" style={{ color: "#94a3b8", textDecoration: "none" }}>プライバシーポリシー</a>
          </div>
          <p>© 2026 VoiceWall. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
