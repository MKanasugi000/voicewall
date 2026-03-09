"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function TestimonialForm() {
  const params = useParams();
  const slug = params.slug as string;

  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [consent, setConsent] = useState(true);

  useEffect(() => {
    fetch(`/api/testimonials?slug=${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProjectName(data.project.name);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_slug: slug,
          customer_name: name,
          customer_email: email,
          customer_title: title,
          rating,
          content,
          consent,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || "送信に失敗しました");
      }
    } catch {
      setError("ネットワークエラーが発生しました");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "Inter, Noto Sans JP, sans-serif" }}>
        <div style={{ fontSize: 16, color: "#64748b" }}>読み込み中...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "Inter, Noto Sans JP, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 24, color: "#1e293b", marginBottom: 8 }}>プロジェクトが見つかりません</h1>
          <p style={{ color: "#64748b" }}>URLを確認してください。</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "Inter, Noto Sans JP, sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: 480, padding: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: 24, color: "#1e293b", marginBottom: 8 }}>ありがとうございます！</h1>
          <p style={{ color: "#64748b", lineHeight: 1.6 }}>
            お声を頂きありがとうございます。<br />
            承認後、サイトに掲載させていただきます。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, Noto Sans JP, sans-serif" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
            <span style={{ color: "#2563eb" }}>Voice</span>
            <span style={{ color: "#1e293b" }}>Wall</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
            {projectName} へのフィードバック
          </h1>
          <p style={{ color: "#64748b", fontSize: 14 }}>
            あなたの体験を教えてください。所要時間は約1分です。
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 16, padding: 32, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          {/* Star Rating */}
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
              評価
            </label>
            <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 32,
                    color: star <= rating ? "#f59e0b" : "#d1d5db",
                    transition: "transform 0.1s",
                    padding: 4,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 6 }}>
              コメント <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="サービスを使った感想をお聞かせください..."
              required
              rows={4}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 15,
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
                lineHeight: 1.6,
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Name */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 6 }}>
              お名前 <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Title / Company */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 6 }}>
              肩書き・会社名
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="株式会社〇〇 代表"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 6 }}>
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>非公開です。確認のためにのみ使用します。</p>
          </div>

          {/* Consent */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ marginTop: 3, accentColor: "#2563eb" }}
              />
              <span style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
                この口コミをウェブサイト上で公開することに同意します。
              </span>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: "#fef2f2", color: "#dc2626", padding: "12px 16px", borderRadius: 8, fontSize: 14, marginBottom: 16 }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !consent}
            style={{
              width: "100%",
              padding: "14px 24px",
              borderRadius: 8,
              background: submitting || !consent ? "#93c5fd" : "#2563eb",
              color: "#fff",
              border: "none",
              fontSize: 16,
              fontWeight: 600,
              cursor: submitting || !consent ? "not-allowed" : "pointer",
            }}
          >
            {submitting ? "送信中..." : "送信する"}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <a
            href="https://voicewall.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: "#94a3b8", textDecoration: "none" }}
          >
            Powered by <span style={{ fontWeight: 600 }}>VoiceWall</span>
          </a>
        </div>
      </div>
    </div>
  );
}
