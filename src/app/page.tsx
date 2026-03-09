"use client";
import { useState, useEffect } from "react";

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
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { icon: "📝", t: "簡単収集", d: "リンクを共有するだけ。顧客がブラウザから直接口コミを送信できます。", color: "#3b82f6" },
    { icon: "📊", t: "一元管理", d: "集まった口コミをダッシュボードで確認・承認・管理。", color: "#8b5cf6" },
    { icon: "🎨", t: "自由に表示", d: "美しいウィジェットをコード1行でサイトに埋め込み。", color: "#ec4899" },
    { icon: "💳", t: "収益化対応", d: "Free/Proプランで段階的にスケール。Stripe決済に対応。", color: "#10b981" },
  ];

  const steps = [
    { n: "1", t: "フォームを作成", d: "アカウント登録後、収集フォームのリンクが自動生成されます。", color: "#3b82f6" },
    { n: "2", t: "口コミを集める", d: "リンクを共有するだけ。顧客が直接フィードバックを送信。", color: "#8b5cf6" },
    { n: "3", t: "サイトに表示", d: "ウィジェットコードを貼り付けるだけ。承認制で安心。", color: "#ec4899" },
  ];

  const aboutCards = [
    { icon: "📨", t: "集める", sub: "フォームでかんたん収集", d: "お客様の感想や評価を、専用フォームでスムーズに集められます。リンクを送るだけで完了。", gradient: "linear-gradient(135deg, #dbeafe, #ede9fe)" },
    { icon: "📋", t: "管理する", sub: "口コミを見やすく整理", d: "集まった声を一覧で管理。掲載したい口コミだけを選んで承認できます。", gradient: "linear-gradient(135deg, #ede9fe, #fce7f3)" },
    { icon: "🌐", t: "見せる", sub: "サイトやLPに掲載", d: "信頼感を高めるお客様の声を、コード1行でサービスページに表示できます。", gradient: "linear-gradient(135deg, #fce7f3, #dbeafe)" },
  ];

  const personas = [
    { icon: "🎯", t: "サイトの成約率を上げたい方", d: "商品やサービスの魅力はあるのに、第三者の声が少なく、信頼感を十分に伝えられていない方に。" },
    { icon: "⏱️", t: "口コミ収集に手間をかけたくない方", d: "紹介や感謝の言葉はもらえるのに、口コミとして整理・保存できず活用につながっていない方に。" },
    { icon: "📂", t: "口コミの管理がバラバラな方", d: "DM、メール、スプレッドシートなどに声が散らばり、必要なときにすぐ取り出せない方に。" },
    { icon: "💻", t: "小規模チーム・個人で運営している方", d: "大きなシステムは不要だけれど、最低限の口コミ運用をシンプルに整えたい方に。" },
  ];

  const painPoints = [
    { icon: "🔒", t: "信頼されにくい", d: "初めて訪れたユーザーは、運営者の説明だけでは安心して申し込めません。" },
    { icon: "⚖️", t: "比較で負けやすい", d: "競合に実績や口コミが並んでいると、サービス内容が近くても選ばれにくくなります。" },
    { icon: "💨", t: "良い評価が資産にならない", d: "満足してくれたお客様の声があっても、集めて残さなければ価値は流れてしまいます。" },
    { icon: "📉", t: "LPの説得力が弱くなる", d: "機能や特徴を丁寧に説明しても、利用者の声がないと最後のひと押しが足りません。" },
  ];

  const plans = [
    {
      name: "Free",
      price: "¥0",
      per: "",
      items: ["プロジェクト1つ", "口コミ収集 10件/月", "基本ウィジェット", "VoiceWallロゴ表示"],
      btn: "無料で始める",
      href: "/login",
      featured: false,
    },
    {
      name: "Pro",
      price: "¥2,980",
      per: "/ 月",
      items: ["プロジェクト無制限", "口コミ収集 無制限", "ロゴ非表示", "ウィジェットカスタマイズ", "CSVエクスポート", "優先サポート"],
      btn: "Proを始める",
      href: "/pricing",
      featured: true,
    },
  ];

  const css = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes pulse-soft {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }
    .fade-in { animation: fadeInUp 0.6s ease-out both; }
    .fade-in-1 { animation-delay: 0.1s; }
    .fade-in-2 { animation-delay: 0.2s; }
    .fade-in-3 { animation-delay: 0.3s; }
    .fade-in-4 { animation-delay: 0.4s; }
    .float-anim { animation: float 3s ease-in-out infinite; }
    .card-hover { transition: all 0.3s ease; }
    .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
    .shimmer-text {
      background: linear-gradient(90deg, #2563eb, #7c3aed, #ec4899, #2563eb);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 4s linear infinite;
    }
    .btn-primary {
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(37,99,235,0.35);
    }
    .bg-blob {
      animation: pulse-soft 4s ease-in-out infinite;
    }
  `;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", overflowX: "hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Nav */}
      <nav style={{
        background: scrollY > 10 ? "rgba(255,255,255,0.92)" : "#fff",
        backdropFilter: scrollY > 10 ? "blur(12px)" : "none",
        borderBottom: "1px solid #e2e8f0",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 60,
        position: "sticky",
        top: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
      }}>
        <a href="/" style={{ fontSize: 22, fontWeight: 800, textDecoration: "none" }}>
          <span style={{ color: "#2563eb" }}>Voice</span>
          <span style={{ color: "#1e293b" }}>Wall</span>
        </a>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {[
            { label: "機能", href: "#features" },
            { label: "料金", href: "#pricing" },
            { label: "管理画面", href: "/dashboard" },
          ].map((l) => (
            <a key={l.label} href={l.href} style={{ padding: "8px 16px", borderRadius: 8, fontSize: 14, textDecoration: "none", color: "#64748b", fontWeight: 500, transition: "color 0.2s" }}>
              {l.label}
            </a>
          ))}
          <a href="/login" className="btn-primary" style={{ padding: "8px 20px", borderRadius: 8, fontSize: 14, textDecoration: "none", color: "#fff", fontWeight: 600, background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}>
            無料で始める
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "100px 20px 80px", maxWidth: 800, margin: "0 auto", position: "relative" }}>
        {/* Decorative blobs */}
        <div className="bg-blob" style={{ position: "absolute", top: -40, left: -100, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.08), transparent 70%)", pointerEvents: "none" }} />
        <div className="bg-blob" style={{ position: "absolute", bottom: -60, right: -80, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)", pointerEvents: "none", animationDelay: "2s" }} />

        <div className="fade-in" style={{ display: "inline-block", background: "linear-gradient(135deg, #dbeafe, #ede9fe)", padding: "6px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, color: "#4338ca", marginBottom: 20 }}>
          口コミ活用ツール VoiceWall
        </div>
        <h1 className="fade-in fade-in-1" style={{ fontSize: "clamp(36px,5.5vw,56px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20, color: "#1e293b" }}>
          口コミを<span className="shimmer-text">集めて</span>、<br /><span className="shimmer-text">見せる</span>。
        </h1>
        <p className="fade-in fade-in-2" style={{ fontSize: 18, color: "#64748b", maxWidth: 560, margin: "0 auto 12px", lineHeight: 1.7 }}>
          VoiceWallは、お客様の声を収集・管理・表示できる<br />オールインワンツールです。
        </p>
        <p className="fade-in fade-in-3" style={{ fontSize: 15, color: "#94a3b8", maxWidth: 460, margin: "0 auto 36px" }}>
          コード1行でサイトに埋め込み。信頼を可視化して、成約率を高めましょう。
        </p>
        <div className="fade-in fade-in-4">
          <a href="/login" className="btn-primary" style={{ display: "inline-block", padding: "16px 40px", borderRadius: 12, background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", fontSize: 17, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 15px rgba(37,99,235,0.3)" }}>
            無料で始める →
          </a>
        </div>
        <p className="fade-in fade-in-4" style={{ fontSize: 13, color: "#94a3b8", marginTop: 12 }}>クレジットカード不要 · 30秒で設置完了</p>

        {/* Numbers bar */}
        <div className="fade-in fade-in-4" style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 48, padding: "24px 0", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
          {[
            { n: "30秒", l: "で設置完了" },
            { n: "コード1行", l: "でサイトに埋め込み" },
            { n: "¥0", l: "から始められる" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#2563eb" }}>{s.n}</div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VoiceWallとは？ */}
      <section style={{ background: "linear-gradient(180deg, #fff 0%, #f1f5f9 100%)", padding: "80px 20px", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "#dbeafe", padding: "4px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, color: "#2563eb", marginBottom: 16, letterSpacing: 1 }}>ABOUT</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, color: "#1e293b" }}>VoiceWallとは？</h2>
          <p style={{ fontSize: 17, color: "#64748b", maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.7 }}>
            お客様の声を、集めて、整えて、伝わる形で届けるサービスです。<br />
            埋もれていた「良い声」を、信頼につながる資産に変えます。
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 24 }}>
            {aboutCards.map((c, i) => (
              <div key={i} className="card-hover" style={{ background: c.gradient, borderRadius: 16, padding: 32, border: "1px solid rgba(255,255,255,0.6)", textAlign: "center", backdropFilter: "blur(10px)" }}>
                <div className="float-anim" style={{ fontSize: 40, marginBottom: 16, animationDelay: `${i * 0.5}s` }}>{c.icon}</div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#2563eb", marginBottom: 4 }}>{c.t}</h3>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 10 }}>{c.sub}</p>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7 }}>{c.d}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 16, color: "#475569", marginTop: 36, fontWeight: 600 }}>
            「良いサービスなのに、伝わらない」を防ぐための口コミ活用ツールです。
          </p>
        </div>
      </section>

      {/* こんな方におすすめ */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "80px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", background: "#ede9fe", padding: "4px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, color: "#7c3aed", marginBottom: 16, letterSpacing: 1 }}>TARGET</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, color: "#1e293b" }}>こんな方におすすめ</h2>
          <p style={{ fontSize: 17, color: "#64748b", lineHeight: 1.7 }}>
            口コミを活かしたいけれど、うまく仕組み化できていない方へ。
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
          {personas.map((p, i) => (
            <div key={i} className="card-hover" style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #e2e8f0", display: "flex", gap: 16, alignItems: "flex-start", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 24, flexShrink: 0, width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${["#dbeafe","#ede9fe","#fce7f3","#d1fae5"][i]}, ${["#ede9fe","#fce7f3","#d1fae5","#dbeafe"][i]})`, display: "flex", alignItems: "center", justifyContent: "center" }}>{p.icon}</div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>{p.t}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{p.d}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: 16, color: "#475569", marginTop: 36, fontWeight: 600, lineHeight: 1.8 }}>
          VoiceWallは、口コミの重要性はわかっているのに<br />
          収集・管理・掲載が仕組み化できていない方に最適です。
        </p>
      </section>

      {/* 口コミがないとこんな問題が… */}
      <section style={{ background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fff7ed 100%)", padding: "80px 20px", borderTop: "1px solid #fde68a", borderBottom: "1px solid #fde68a" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-block", background: "#fef3c7", padding: "4px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, color: "#b45309", marginBottom: 16, letterSpacing: 1, border: "1px solid #fde68a" }}>PAIN POINTS</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, color: "#1e293b" }}>口コミがないと、<br />こんな問題が起こります</h2>
            <p style={{ fontSize: 17, color: "#64748b" }}>
              良いサービスでも、信頼の材料がなければ選ばれにくくなります。
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {painPoints.map((p, i) => (
              <div key={i} className="card-hover" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)", borderRadius: 16, padding: 28, border: "1px solid rgba(253,230,138,0.6)", boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{p.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>{p.t}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{p.d}</p>
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 16, color: "#92400e", marginTop: 36, fontWeight: 600, lineHeight: 1.8 }}>
            口コミは、ただの感想ではありません。<br />
            見込み顧客の不安を減らし、行動を後押しする「信頼の証拠」です。
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", background: "#dbeafe", padding: "4px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, color: "#2563eb", marginBottom: 16, letterSpacing: 1 }}>FEATURES</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: "#1e293b" }}>主な機能</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} className="card-hover" style={{ background: "#fff", borderRadius: 16, padding: 32, border: "1px solid #e2e8f0", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: `linear-gradient(90deg, ${f.color}, transparent)` }} />
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${f.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 18 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "#1e293b" }}>{f.t}</h3>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)", padding: "80px 20px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(59,130,246,0.2)", padding: "4px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, color: "#60a5fa", marginBottom: 16, letterSpacing: 1 }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 56, color: "#fff" }}>3ステップで始められます</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 40, position: "relative" }}>
            {steps.map((s, i) => (
              <div key={i} style={{ position: "relative" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, margin: "0 auto 20px", boxShadow: `0 0 30px ${s.color}40` }}>{s.n}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: "#fff" }}>{s.t}</h3>
                <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.7 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", background: "#fce7f3", padding: "4px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, color: "#db2777", marginBottom: 16, letterSpacing: 1 }}>TESTIMONIALS</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: "#1e293b" }}>利用者の声</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
          {testimonials.map((r, i) => (
            <div key={i} className="card-hover" style={{ background: "#fff", borderRadius: 16, padding: 28, border: "1px solid #e2e8f0", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${["#3b82f6","#8b5cf6","#ec4899","#10b981"][i]}, transparent)` }} />
              <div style={{ color: "#f59e0b", letterSpacing: 2, marginBottom: 14, fontSize: 18 }}>
                {"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}
              </div>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, marginBottom: 18, fontStyle: "italic" }}>
                &ldquo;{r.text}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${["#dbeafe","#ede9fe","#fce7f3","#d1fae5"][i]}, ${["#ede9fe","#fce7f3","#d1fae5","#dbeafe"][i]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#2563eb" }}>{r.avatar}</div>
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
      <section id="pricing" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #fff 100%)", padding: "80px 20px", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "#d1fae5", padding: "4px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 16, letterSpacing: 1 }}>PRICING</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 8, color: "#1e293b" }}>料金プラン</h2>
          <p style={{ color: "#64748b", marginBottom: 48, fontSize: 17 }}>まずは無料で始めましょう。</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 700, margin: "0 auto" }}>
            {plans.map((p, i) => (
              <div key={i} className="card-hover" style={{
                background: p.featured ? "linear-gradient(135deg, #1e293b, #0f172a)" : "#fff",
                borderRadius: 20,
                padding: 36,
                border: p.featured ? "2px solid #2563eb" : "1px solid #e2e8f0",
                textAlign: "left",
                position: "relative",
                boxShadow: p.featured ? "0 12px 40px rgba(37,99,235,0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
              }}>
                {p.featured && (
                  <span style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "5px 18px", borderRadius: 99 }}>
                    おすすめ
                  </span>
                )}
                <h3 style={{ fontSize: 20, color: p.featured ? "#e2e8f0" : "#1e293b", marginBottom: 4, fontWeight: 700 }}>{p.name}</h3>
                <div style={{ fontSize: 40, fontWeight: 800, margin: "16px 0", color: p.featured ? "#fff" : "#1e293b" }}>
                  {p.price}
                  {p.per && <span style={{ fontSize: 15, color: p.featured ? "#94a3b8" : "#94a3b8", fontWeight: 400 }}> {p.per}</span>}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "24px 0" }}>
                  {p.items.map((item, j) => (
                    <li key={j} style={{ padding: "7px 0", fontSize: 14, color: p.featured ? "#cbd5e1" : "#64748b", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: p.featured ? "#60a5fa" : "#10b981" }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <a href={p.href} className="btn-primary" style={{
                  display: "block",
                  textAlign: "center",
                  padding: "14px 24px",
                  borderRadius: 10,
                  background: p.featured ? "linear-gradient(135deg, #2563eb, #3b82f6)" : "#fff",
                  color: p.featured ? "#fff" : "#1e293b",
                  border: p.featured ? "none" : "1px solid #e2e8f0",
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                }}>
                  {p.btn}
                </a>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 24, fontSize: 13, color: "#94a3b8" }}>
            決済はStripeで安全に処理されます。いつでもキャンセル可能です。
          </p>
        </div>
      </section>

      {/* Waitlist / CTA */}
      <section id="waitlist" style={{ padding: "80px 20px", maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: "#1e293b" }}>最新情報を受け取る</h2>
        <p style={{ color: "#64748b", marginBottom: 28 }}>新機能やアップデート情報をお届けします。</p>
        {!submitted ? (
          <form onSubmit={handleWaitlist} style={{ display: "flex", gap: 8 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              required
              style={{ flex: 1, padding: "14px 18px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 15, outline: "none", transition: "border 0.2s" }}
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: "14px 28px", borderRadius: 10, background: loading ? "#93c5fd" : "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", border: "none", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "..." : "登録する"}
            </button>
          </form>
        ) : (
          <div style={{ background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", color: "#065f46", padding: "18px 28px", borderRadius: 12, fontWeight: 600, fontSize: 16 }}>
            登録ありがとうございます！
          </div>
        )}
      </section>

      {/* Final CTA */}
      <section style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", padding: "80px 20px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div className="bg-blob" style={{ position: "absolute", top: -50, right: -50, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.15), transparent 70%)", pointerEvents: "none" }} />
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 14, position: "relative" }}>今すぐ口コミを集めませんか？</h2>
        <p style={{ color: "#94a3b8", marginBottom: 32, fontSize: 17, position: "relative" }}>無料プランで今日から始められます。</p>
        <a href="/login" className="btn-primary" style={{ display: "inline-block", padding: "16px 40px", borderRadius: 12, background: "linear-gradient(135deg, #2563eb, #3b82f6)", color: "#fff", fontSize: 17, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(37,99,235,0.4)", position: "relative" }}>
          無料で始める →
        </a>
      </section>

      {/* Footer */}
      <footer style={{ background: "#0f172a", padding: "48px 20px", color: "#94a3b8", fontSize: 14 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>
              <span style={{ color: "#60a5fa" }}>Voice</span>
              <span style={{ color: "#fff" }}>Wall</span>
            </div>
            <p style={{ maxWidth: 280, lineHeight: 1.6 }}>お客様の声を収集・管理・表示できるオールインワンツール。</p>
          </div>
          <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
            {[
              { label: "料金", href: "/pricing" },
              { label: "ログイン", href: "/login" },
              { label: "管理画面", href: "/dashboard" },
              { label: "利用規約", href: "/terms" },
              { label: "プライバシー", href: "/privacy" },
              { label: "お問い合わせ", href: "mailto:mildsolt.official@gmail.com" },
            ].map((l) => (
              <a key={l.label} href={l.href} style={{ color: "#94a3b8", textDecoration: "none", transition: "color 0.2s" }}>{l.label}</a>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: "24px auto 0", paddingTop: 24, borderTop: "1px solid #1e293b", textAlign: "center", color: "#64748b", fontSize: 13 }}>
          © 2026 VoiceWall by Mild Solt. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
