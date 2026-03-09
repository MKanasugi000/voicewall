"use client";
import { useState } from "react";

const testimonials = [
  { name: "田中 美咲", nameEn: "Misaki Tanaka", company: "デザインスタジオ", companyEn: "Design Studio", stars: 5, text: "口コミの収集がこんなに簡単だとは思いませんでした。導入して2週間で20件以上集まりました！", textEn: "I never thought collecting testimonials could be this easy. Got 20+ in just 2 weeks!", avatar: "MT" },
  { name: "佐藤 健一", nameEn: "Kenichi Sato", company: "株式会社テックラボ", companyEn: "TechLab Inc.", stars: 5, text: "ウィジェットのデザインが美しく、サイトのコンバージョン率が15%向上しました。", textEn: "Beautiful widget design. Our site conversion rate improved by 15%.", avatar: "KS" },
  { name: "鈴木 遥", nameEn: "Haruka Suzuki", company: "フリーランス", companyEn: "Freelance", stars: 4, text: "シンプルで使いやすいUIが気に入っています。メール自動リクエスト機能が特に便利です。", textEn: "Love the simple UI. The automated email request feature is especially useful.", avatar: "HS" },
  { name: "Alex Johnson", nameEn: "Alex Johnson", company: "SaaS Startup", companyEn: "SaaS Startup", stars: 5, text: "海外のお客様からの声も一括管理できるのが素晴らしい。", textEn: "Being able to manage international testimonials in one place is amazing.", avatar: "AJ" },
];

const i18n: Record<string, Record<string, string>> = {
  ja: { heroTitle: "口コミを", a1: "集めて", mid: "、", a2: "見せる", end: "。", heroSub: "VoiceWallは、テスティモニアルの収集・管理・表示をひとつのツールで完結できるサービスです。", cta: "無料で始める", ctaSub: "クレジットカード不要", f1t: "簡単収集", f1d: "リンクを共有するだけ。顧客がブラウザから直接口コミを送信できます。", f2t: "一元管理", f2d: "集まった口コミをダッシュボードで確認・承認・管理。", f3t: "自由に表示", f3d: "グリッド、カルーセルなど複数レイアウトでサイトに埋め込み。", f4t: "多言語対応", f4d: "日本語・英語に対応。グローバルなビジネスでも利用可能。", howT: "3ステップで始められます", s1t: "フォームを作成", s1d: "アカウント登録後、収集フォームのリンクが自動生成。", s2t: "口コミを集める", s2d: "リンクを共有、またはメール自動リクエストで収集。", s3t: "サイトに表示", s3d: "ウィジェットコードを貼り付けるだけ。", socialT: "利用者の声", priceT: "料金プラン", priceS: "まずは無料で始めましょう。", fp: "\u00a50", pp: "\u00a52,980", bp: "\u00a57,980", per: "/ 月", pop: "人気", f1: "口コミ10件まで", f2: "基本ウィジェット1種類", f3: "VoiceWallブランド表示", p1: "口コミ100件まで", p2: "ウィジェット5種類", p3: "メール自動リクエスト", p4: "ブランド非表示", b1: "口コミ無制限", b2: "カスタムウィジェット", b3: "APIアクセス", b4: "優先サポート", fb: "無料で始める", pb: "Proを始める", bb: "お問い合わせ", wt: "事前登録", ws: "ローンチ時にお知らせします。", eph: "メールアドレス", wb: "登録する", wth: "登録ありがとうございます！ローンチ時にお知らせします。", ctaT: "今すぐ口コミを集めませんか？", ctaS: "無料プランで今日から始められます。", ctaB: "無料で始める →", foot: "テスティモニアルの収集・管理・表示をひとつのツールで。" },
  en: { heroTitle: "", a1: "Collect", mid: " & ", a2: "Showcase", end: " Testimonials.", heroSub: "VoiceWall is an all-in-one tool for collecting, managing, and displaying customer testimonials.", cta: "Start Free", ctaSub: "No credit card required", f1t: "Easy Collection", f1d: "Share a link and let customers submit testimonials from their browser.", f2t: "Centralized Management", f2d: "Review, approve, and manage from one dashboard.", f3t: "Flexible Display", f3d: "Grid, carousel, or wall layouts. Embed with one line of code.", f4t: "Multilingual", f4d: "Japanese and English support. Ready for global businesses.", howT: "Get started in 3 steps", s1t: "Create a Form", s1d: "Sign up and your collection form link is auto-generated.", s2t: "Collect Reviews", s2d: "Share the link or use automated email requests.", s3t: "Display on Site", s3d: "Paste the widget code. Customize to match your brand.", socialT: "What people say", priceT: "Pricing", priceS: "Start free. Upgrade when ready.", fp: "", pp: "", bp: "", per: "/ mo", pop: "Popular", f1: "Up to 10 testimonials", f2: "1 basic widget", f3: "VoiceWall branding", p1: "Up to 100 testimonials", p2: "5 widget styles", p3: "Automated email requests", p4: "Remove branding", b1: "Unlimited testimonials", b2: "Custom widgets", b3: "API access", b4: "Priority support", fb: "Start Free", pb: "Start Pro", bb: "Contact Us", wt: "Join the Waitlist", ws: "Be the first to know when we launch.", eph: "Your email", wb: "Join", wth: "Thanks! We will notify you when we launch.", ctaT: "Ready to collect testimonials?", ctaS: "Start free today. Setup takes 3 minutes.", ctaB: "Start Free →", foot: "Collect, manage, and display testimonials — all in one tool." },
};
export default function Home() {
  const [lang, setLang] = useState("ja");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const t = i18n[lang];
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
  const features = [{icon:"📝",t:t.f1t,d:t.f1d},{icon:"📊",t:t.f2t,d:t.f2d},{icon:"🎨",t:t.f3t,d:t.f3d},{icon:"🌐",t:t.f4t,d:t.f4d}];
  const steps = [{n:"1",t:t.s1t,d:t.s1d},{n:"2",t:t.s2t,d:t.s2d},{n:"3",t:t.s3t,d:t.s3d}];
  const plans = [
    {name:"Free",price:t.fp,per:t.per,items:[t.f1,t.f2,t.f3],btn:t.fb,featured:false},
    {name:"Pro",price:t.pp,per:t.per,items:[t.p1,t.p2,t.p3,t.p4],btn:t.pb,featured:true},
    {name:"Business",price:t.bp,per:t.per,items:[t.b1,t.b2,t.b3,t.b4],btn:t.bb,featured:false},
  ];
  return (
    <div style={{background:"#f8fafc",minHeight:"100vh"}}>
      <nav style={{background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60,position:"sticky",top:0,zIndex:100}}>
        <div style={{fontSize:22,fontWeight:800}}><span style={{color:"#2563eb"}}>Voice</span><span style={{color:"#1e293b"}}>Wall</span></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <a href="#features" style={{padding:"8px 16px",borderRadius:8,fontSize:14,textDecoration:"none",color:"#64748b",fontWeight:500}}>{lang==="ja"?"機能":"Features"}</a>
          <a href="#pricing" style={{padding:"8px 16px",borderRadius:8,fontSize:14,textDecoration:"none",color:"#64748b",fontWeight:500}}>{lang==="ja"?"料金":"Pricing"}</a>
          <a href="#waitlist" style={{padding:"8px 16px",borderRadius:8,fontSize:14,textDecoration:"none",color:"#64748b",fontWeight:500}}>{lang==="ja"?"事前登録":"Waitlist"}</a>
          <a href="/dashboard" style={{padding:"8px 16px",borderRadius:8,fontSize:14,textDecoration:"none",color:"#2563eb",fontWeight:600}}>{lang==="ja"?"管理画面":"Dashboard"}</a>
          <button onClick={()=>setLang(lang==="ja"?"en":"ja")} style={{padding:"6px 12px",borderRadius:6,border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,color:"#64748b"}}>{lang==="ja"?"EN":"JP"}</button>
        </div>
      </nav>
      <section style={{textAlign:"center",padding:"80px 20px 60px",maxWidth:800,margin:"0 auto"}}>
        <h1 style={{fontSize:"clamp(32px,5vw,52px)",fontWeight:800,lineHeight:1.2,marginBottom:16,color:"#1e293b"}}>{t.heroTitle}<span style={{color:"#2563eb"}}>{t.a1}</span>{t.mid}<span style={{color:"#2563eb"}}>{t.a2}</span>{t.end}</h1>
        <p style={{fontSize:18,color:"#64748b",maxWidth:600,margin:"0 auto 32px"}}>{t.heroSub}</p>
        <a href="#waitlist" style={{display:"inline-block",padding:"14px 32px",borderRadius:8,background:"#2563eb",color:"#fff",fontSize:16,fontWeight:600,textDecoration:"none"}}>{t.cta}</a>
        <p style={{fontSize:13,color:"#94a3b8",marginTop:8}}>{t.ctaSub}</p>
      </section>
      <section id="features" style={{maxWidth:1100,margin:"0 auto",padding:"40px 20px 80px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:24}}>
        {features.map((f,i)=><div key={i} style={{background:"#fff",borderRadius:12,padding:32,border:"1px solid #e2e8f0"}}><div style={{width:48,height:48,borderRadius:12,background:"#dbeafe",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:16}}>{f.icon}</div><h3 style={{fontSize:18,marginBottom:8,color:"#1e293b"}}>{f.t}</h3><p style={{color:"#64748b",fontSize:14,lineHeight:1.6}}>{f.d}</p></div>)}
      </section>
      <section style={{background:"#fff",padding:"60px 20px",borderTop:"1px solid #e2e8f0",borderBottom:"1px solid #e2e8f0"}}>
        <div style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}>
          <h2 style={{fontSize:32,fontWeight:800,marginBottom:48,color:"#1e293b"}}>{t.howT}</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:40}}>
            {steps.map((s,i)=><div key={i}><div style={{width:48,height:48,borderRadius:"50%",background:"#2563eb",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,margin:"0 auto 16px"}}>{s.n}</div><h3 style={{fontSize:18,marginBottom:8,color:"#1e293b"}}>{s.t}</h3><p style={{color:"#64748b",fontSize:14}}>{s.d}</p></div>)}
          </div>
        </div>
      </section>
      <section style={{maxWidth:1100,margin:"0 auto",padding:"60px 20px"}}>
        <h2 style={{fontSize:32,fontWeight:800,textAlign:"center",marginBottom:40,color:"#1e293b"}}>{t.socialT}</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20}}>
          {testimonials.map((r,i)=><div key={i} style={{background:"#fff",borderRadius:12,padding:24,border:"1px solid #e2e8f0"}}><div style={{color:"#f59e0b",letterSpacing:2,marginBottom:12,fontSize:16}}>{"\u2605".repeat(r.stars)}{"\u2606".repeat(5-r.stars)}</div><p style={{fontSize:14,color:"#1e293b",lineHeight:1.7,marginBottom:16,fontStyle:"italic"}}>&ldquo;{lang==="en"?r.textEn:r.text}&rdquo;</p><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:36,height:36,borderRadius:"50%",background:"#dbeafe",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#2563eb"}}>{r.avatar}</div><div><div style={{fontSize:14,fontWeight:600,color:"#1e293b"}}>{lang==="en"?r.nameEn:r.name}</div><div style={{fontSize:12,color:"#94a3b8"}}>{lang==="en"?r.companyEn:r.company}</div></div></div></div>)}
        </div>
      </section>
      <section id="pricing" style={{background:"#fff",padding:"60px 20px",borderTop:"1px solid #e2e8f0"}}>
        <div style={{maxWidth:960,margin:"0 auto",textAlign:"center"}}>
          <h2 style={{fontSize:32,fontWeight:800,marginBottom:8,color:"#1e293b"}}>{t.priceT}</h2>
          <p style={{color:"#64748b",marginBottom:40}}>{t.priceS}</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:24}}>
            {plans.map((p,i)=><div key={i} style={{background:"#fff",borderRadius:12,padding:32,border:p.featured?"2px solid #2563eb":"1px solid #e2e8f0",textAlign:"left"}}>{p.featured&&<span style={{display:"inline-block",background:"#2563eb",color:"#fff",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99,marginBottom:12}}>{t.pop}</span>}<h3 style={{fontSize:20,color:"#1e293b"}}>{p.name}</h3><div style={{fontSize:36,fontWeight:800,margin:"12px 0",color:"#1e293b"}}>{p.price}<span style={{fontSize:14,color:"#94a3b8",fontWeight:400}}> {p.per}</span></div><ul style={{listStyle:"none",padding:0,margin:"20px 0"}}>{p.items.map((item,j)=><li key={j} style={{padding:"6px 0",fontSize:14,color:"#64748b"}}>✓ {item}</li>)}</ul><a href="#waitlist" style={{display:"block",textAlign:"center",padding:"12px 24px",borderRadius:8,background:p.featured?"#2563eb":"#fff",color:p.featured?"#fff":"#1e293b",border:p.featured?"none":"1px solid #e2e8f0",fontWeight:600,fontSize:15,textDecoration:"none"}}>{p.btn}</a></div>)}
          </div>
        </div>
      </section>
      <section id="waitlist" style={{padding:"60px 20px",maxWidth:500,margin:"0 auto",textAlign:"center"}}>
        <h2 style={{fontSize:28,fontWeight:800,marginBottom:8,color:"#1e293b"}}>{t.wt}</h2>
        <p style={{color:"#64748b",marginBottom:24}}>{t.ws}</p>
        {!submitted?<form onSubmit={handleWaitlist} style={{display:"flex",gap:8}}><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={t.eph} required style={{flex:1,padding:"12px 16px",borderRadius:8,border:"1px solid #e2e8f0",fontSize:15,outline:"none"}}/><button type="submit" disabled={loading} style={{padding:"12px 24px",borderRadius:8,background:loading?"#93c5fd":"#2563eb",color:"#fff",border:"none",fontSize:15,fontWeight:600,cursor:loading?"not-allowed":"pointer"}}>{loading?"...":t.wb}</button></form>:<div style={{background:"#d1fae5",color:"#065f46",padding:"16px 24px",borderRadius:8,fontWeight:500}}>{t.wth}</div>}
      </section>
      <section style={{background:"#1e293b",padding:"60px 20px",textAlign:"center"}}>
        <h2 style={{fontSize:28,fontWeight:800,color:"#fff",marginBottom:12}}>{t.ctaT}</h2>
        <p style={{color:"#94a3b8",marginBottom:24}}>{t.ctaS}</p>
        <a href="#waitlist" style={{display:"inline-block",padding:"14px 32px",borderRadius:8,background:"#2563eb",color:"#fff",fontSize:16,fontWeight:600,textDecoration:"none"}}>{t.ctaB}</a>
      </section>
      <footer style={{background:"#0f172a",padding:"40px 20px",color:"#94a3b8",fontSize:14}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:24}}>
          <div><div style={{fontSize:20,fontWeight:800,marginBottom:8}}><span style={{color:"#60a5fa"}}>Voice</span><span style={{color:"#fff"}}>Wall</span></div><p style={{maxWidth:300}}>{t.foot}</p></div>
          <p>© 2026 VoiceWall. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}