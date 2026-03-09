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
      "口コミ収集 5件/月",
      "VoiceWallロゴ表示あり",
      "基本的な埋め込みウィジェット",
    ],
    cta: "現在のプラン",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "¥980",
    period: "/月",
    description: "本格的に口コミを活用したい方に",
    features: [
      "プロジェクト無制限",
      "口コミ収集 無制限",
      "VoiceWallロゴ非表示",
      "ウィジェットカスタマイズ",
      "CSVエクスポート",
      "優先サポート",
    ],
    cta: "Proにアップグレード",
    highlighted: true,
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
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

  const handleUpgrade = async () => {
    if (!userId || !email) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userId }),
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
    setLoading(false);
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
        <a href="/" style={{ fontSize: "24px", fontWeight: 800, color: "#2563EB", textDecoration: "none" }}>
          VoiceWall
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
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 20px" }}>
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
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          maxWidth: "800px",
          margin: "0 auto",
        }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "32px",
                border: plan.highlighted ? "2px solid #2563EB" : "1px solid #E5E7EB",
                position: "relative",
                boxShadow: plan.highlighted ? "0 8px 30px rgba(37, 99, 235, 0.15)" : "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              {plan.highlighted && (
                <div style={{
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #2563EB, #1A3FB5)",
                  color: "white",
                  padding: "4px 16px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: 600,
                }}>
                  おすすめ
                </div>
              )}

              <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
                {plan.name}
              </h2>
              <p style={{ fontSize: "14px", color: "#6B7280", margin: "0 0 16px" }}>
                {plan.description}
              </p>

              <div style={{ marginBottom: "24px" }}>
                <span style={{ fontSize: "40px", fontWeight: 800, color: "#111827" }}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span style={{ fontSize: "16px", color: "#6B7280" }}>{plan.period}</span>
                )}
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
                {plan.features.map((feature) => (
                  <li key={feature} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "6px 0",
                    fontSize: "15px",
                    color: "#374151",
                  }}>
                    <span style={{ color: plan.highlighted ? "#2563EB" : "#10B981", fontSize: "18px" }}>
                      &#10003;
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.name === "Pro" ? (
                currentPlan === "pro" ? (
                  <button
                    disabled
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#E5E7EB",
                      color: "#6B7280",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  >
                    現在のプラン
                  </button>
                ) : (
                  <button
                    onClick={handleUpgrade}
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: loading ? "#93C5FD" : "linear-gradient(135deg, #2563EB, #1A3FB5)",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: 600,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "処理中..." : plan.cta}
                  </button>
                )
              ) : (
                <button
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: currentPlan === "free" ? "#F3F4F6" : "white",
                    color: "#6B7280",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 600,
                  }}
                >
                  {currentPlan === "free" ? "現在のプラン" : "Freeプラン"}
                </button>
              )}
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: "32px", color: "#9CA3AF", fontSize: "13px" }}>
          決済はStripeで安全に処理されます。いつでもキャンセル可能です。
        </p>
      </div>
    </div>
  );
}
