"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const plans = [
  {
    name: "Free",
    price: "¥0",
    period: "",
    description: "まずは試してみたい方に",
    features: [
      "プロジェクト1つ",
      "口コミ収集 10件/月",
      "VoiceWallロゴ表示あり",
      "基本的な埋め込みウィジェット",
    ],
    cta: "現在のプラン",
    highlighted: false,
    planKey: "free",
  },
  {
    name: "Starter",
    price: "¥1,480",
    period: "/月",
    description: "小規模ビジネスの口コミ活用に",
    features: [
      "プロジェクト3つ",
      "口コミ収集 50件/月",
      "ロゴ非表示",
      "ウィジェットカスタマイズ",
      "メールサポート",
    ],
    cta: "Starterを始める",
    highlighted: false,
    planKey: "starter",
  },
  {
    name: "Pro",
    price: "¥2,980",
    period: "/月",
    description: "本格的に口コミを活用したい方に",
    features: [
      "プロジェクト無制限",
      "口コミ収集 無制限",
      "VoiceWallロゴ非表示",
      "ウィジェットカスタマイズ",
      "CSVエクスポート",
      "AI口コミ要約",
      "優先サポート",
    ],
    cta: "Proにアップグレード",
    highlighted: true,
    planKey: "pro",
  },
  {
    name: "Agency",
    price: "¥9,800",
    period: "/月",
    description: "複数クライアントを管理する方に",
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
    cta: "Agencyを始める",
    highlighted: false,
    planKey: "agency",
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        setEmail(session.user.email || null);

        // 現在のプランを取得
        const res = await fetch(`/api/stripe/subscription?userId=${session.user.id}`);
        const data = await res.json();
        setCurrentPlan(data.plan);
      }
    };
    checkAuth();
  }, []);

  const handleUpgrade = async (planKey: string) => {
    if (!userId || !email) {
      window.location.href = "/login";
      return;
    }

    setLoading(planKey);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userId, plan: planKey }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("エラーが発生しました。もう一度お試しください。");
      }
    } catch {
      alert("エラーが発生しました。");
    }
    setLoading(null);
  };

  const planOrder = ["free", "starter", "pro", "agency"];
  const isUpgrade = (planKey: string) => {
    return planOrder.indexOf(planKey) > planOrder.indexOf(currentPlan);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      {/* ヘッダー */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        background: "white",
        borderBottom: "1px solid #E5E7EB",
      }}>
        <a href="/" style={{ fontSize: "24px", fontWeight: 800, textDecoration: "none" }}>
          <span style={{ color: "#2563EB" }}>Voice</span>
          <span style={{ color: "#1e293b" }}>Wall</span>
        </a>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <a href="/dashboard" style={{ color: "#6B7280", textDecoration: "none", fontSize: "14px" }}>
            ダッシュボード
          </a>
          {!userId && (
            <a href="/login" style={{
              background: "#2563EB",
              color: "white",
              padding: "8px 20px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 600,
            }}>
              ログイン
            </a>
          )}
        </div>
      </nav>

      {/* メインコンテンツ */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#111827", margin: "0 0 12px" }}>
            料金プラン
          </h1>
          <p style={{ fontSize: "18px", color: "#6B7280", margin: 0 }}>
            あなたのビジネスに合ったプランをお選びください
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          maxWidth: "1060px",
          margin: "0 auto",
        }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: plan.highlighted ? "linear-gradient(135deg, #1e293b, #0f172a)" : "white",
                borderRadius: "16px",
                padding: "28px",
                border: plan.highlighted ? "2px solid #2563EB" : "1px solid #E5E7EB",
                position: "relative",
                boxShadow: plan.highlighted ? "0 8px 30px rgba(37, 99, 235, 0.15)" : "0 1px 3px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              {plan.highlighted && (
                <div style={{
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #2563EB, #7c3aed)",
                  color: "white",
                  padding: "4px 16px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}>
                  おすすめ
                </div>
              )}

              <h2 style={{ fontSize: "22px", fontWeight: 700, color: plan.highlighted ? "#e2e8f0" : "#111827", margin: "0 0 4px" }}>
                {plan.name}
              </h2>
              <p style={{ fontSize: "13px", color: plan.highlighted ? "#94a3b8" : "#6B7280", margin: "0 0 16px" }}>
                {plan.description}
              </p>

              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "36px", fontWeight: 800, color: plan.highlighted ? "#fff" : "#111827" }}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span style={{ fontSize: "15px", color: plan.highlighted ? "#94a3b8" : "#6B7280" }}>{plan.period}</span>
                )}
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
                {plan.features.map((feature) => (
                  <li key={feature} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "5px 0",
                    fontSize: "14px",
                    color: plan.highlighted ? "#cbd5e1" : "#374151",
                  }}>
                    <span style={{ color: plan.highlighted ? "#60a5fa" : "#10B981", fontSize: "16px", flexShrink: 0 }}>
                      &#10003;
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {currentPlan === plan.planKey ? (
                <button
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: plan.highlighted ? "rgba(255,255,255,0.1)" : "#E5E7EB",
                    color: plan.highlighted ? "#94a3b8" : "#6B7280",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: 600,
                  }}
                >
                  現在のプラン
                </button>
              ) : plan.planKey === "free" ? (
                <button
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "white",
                    color: "#6B7280",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: 600,
                  }}
                >
                  Freeプラン
                </button>
              ) : isUpgrade(plan.planKey) ? (
                <button
                  onClick={() => handleUpgrade(plan.planKey)}
                  disabled={loading === plan.planKey}
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: loading === plan.planKey ? "#93C5FD" : plan.highlighted ? "linear-gradient(135deg, #2563EB, #3b82f6)" : "linear-gradient(135deg, #2563EB, #1A3FB5)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: 600,
                    cursor: loading === plan.planKey ? "not-allowed" : "pointer",
                  }}
                >
                  {loading === plan.planKey ? "処理中..." : plan.cta}
                </button>
              ) : (
                <button
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "white",
                    color: "#9CA3AF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "15px",
                    fontWeight: 600,
                  }}
                >
                  現在のプランに含まれます
                </button>
              )}
            </div>
          ))}
        </div>

        {/* レスポンシブ用CSS */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 900px) {
            div[style*="gridTemplateColumns: repeat(4"] {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 560px) {
            div[style*="gridTemplateColumns: repeat(4"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}} />

        <p style={{ textAlign: "center", marginTop: "32px", color: "#9CA3AF", fontSize: "13px" }}>
          決済はStripeで安全に処理されます。いつでもキャンセル可能です。
        </p>
      </div>
    </div>
  );
}
