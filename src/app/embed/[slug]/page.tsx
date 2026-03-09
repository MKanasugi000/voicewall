"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

interface Testimonial {
  id: string;
  customer_name: string;
  customer_title: string | null;
  rating: number;
  content: string;
  created_at: string;
}

export default function EmbedWidget() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;

  // カスタマイズオプション（URLパラメータで制御）
  const theme = searchParams.get("theme") || "light";
  const cols = parseInt(searchParams.get("cols") || "0") || 0;
  const hideBranding = searchParams.get("brand") === "0";

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    fetch(`/api/testimonials?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data.testimonials || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Proプランかチェック
    fetch(`/api/embed-check?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => setIsPro(d.isPro || false))
      .catch(() => {});
  }, [slug]);

  const isDark = theme === "dark";
  const cardBg = isDark ? "#334155" : "#fff";
  const cardBorder = isDark ? "#475569" : "#e2e8f0";
  const textColor = isDark ? "#f1f5f9" : "#1e293b";
  const subColor = isDark ? "#94a3b8" : "#94a3b8";
  const gridCols = cols > 0 ? `repeat(${cols}, 1fr)` : "repeat(auto-fill, minmax(280px, 1fr))";

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center", fontFamily: "Inter, Noto Sans JP, sans-serif" }}>
        <div style={{ color: "#64748b", fontSize: 14 }}>読み込み中...</div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "Inter, Noto Sans JP, sans-serif" }}>
        <p style={{ color: "#94a3b8", fontSize: 14 }}>まだ口コミはありません。</p>
      </div>
    );
  }

  const showBranding = !(hideBranding && isPro);

  return (
    <div style={{ fontFamily: "Inter, Noto Sans JP, sans-serif", padding: 16, background: isDark ? "#1e293b" : "transparent" }}>
      <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 16 }}>
        {testimonials.map((t) => (
          <div
            key={t.id}
            style={{
              background: cardBg,
              borderRadius: 12,
              padding: 24,
              border: `1px solid ${cardBorder}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <div style={{ color: "#f59e0b", letterSpacing: 2, marginBottom: 12, fontSize: 16 }}>
              {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
            </div>
            <p style={{ fontSize: 14, color: textColor, lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>
              &ldquo;{t.content}&rdquo;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: isDark ? "#475569" : "#dbeafe",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: "#2563eb",
              }}>
                {t.customer_name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: textColor }}>{t.customer_name}</div>
                {t.customer_title && <div style={{ fontSize: 12, color: subColor }}>{t.customer_title}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showBranding && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <a href="https://voicewall.vercel.app" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 11, color: subColor, textDecoration: "none" }}>
            Powered by <span style={{ fontWeight: 600 }}>VoiceWall</span>
          </a>
        </div>
      )}
    </div>
  );
}
