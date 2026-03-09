"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

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
  const slug = params.slug as string;

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    fetch(`/api/testimonials?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data.testimonials || []);
        setProjectName(data.project?.name || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

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

  return (
    <div style={{ fontFamily: "Inter, Noto Sans JP, sans-serif", padding: 16, background: "transparent" }}>
      {/* Wall of Love grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
      }}>
        {testimonials.map((t) => (
          <div
            key={t.id}
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            {/* Stars */}
            <div style={{ color: "#f59e0b", letterSpacing: 2, marginBottom: 12, fontSize: 16 }}>
              {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
            </div>

            {/* Content */}
            <p style={{
              fontSize: 14,
              color: "#1e293b",
              lineHeight: 1.7,
              marginBottom: 16,
              fontStyle: "italic",
            }}>
              &ldquo;{t.content}&rdquo;
            </p>

            {/* Author */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#dbeafe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#2563eb",
              }}>
                {t.customer_name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
                  {t.customer_name}
                </div>
                {t.customer_title && (
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>
                    {t.customer_title}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Powered by */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <a
          href="https://voicewall.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 11, color: "#94a3b8", textDecoration: "none" }}
        >
          Powered by <span style={{ fontWeight: 600 }}>VoiceWall</span>
        </a>
      </div>
    </div>
  );
}
