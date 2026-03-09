"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Testimonial {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_title: string | null;
  rating: number;
  content: string;
  is_published: boolean;
  consent: boolean;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("demo");
  const [slugInput, setSlugInput] = useState("demo");
  const [tab, setTab] = useState<"all" | "pending" | "published">("all");
  const [copied, setCopied] = useState("");

  // 認証チェック：ログインしていなければ /login にリダイレクト
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setAuthLoading(false);
      } else {
        window.location.href = "/login";
      }
    });
  }, []);

  // ログアウト処理
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/testimonials?slug=${slug}&all=true`);
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials || []);
        setProject(data.project || null);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await fetch("/api/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_published: !currentStatus }),
      });
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_published: !currentStatus } : t))
      );
    } catch { /* ignore */ }
  };

  const filteredTestimonials = testimonials.filter((t) => {
    if (tab === "pending") return !t.is_published;
    if (tab === "published") return t.is_published;
    return true;
  });

  const stats = {
    total: testimonials.length,
    published: testimonials.filter((t) => t.is_published).length,
    pending: testimonials.filter((t) => !t.is_published).length,
    avgRating: testimonials.length > 0
      ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
      : "0",
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://voicewall.vercel.app";
  const formUrl = `${baseUrl}/t/${slug}`;
  const embedUrl = `${baseUrl}/embed/${slug}`;
  const embedCode = `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" style="border:none;border-radius:12px;"></iframe>`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  // 認証チェック中はローディング表示
  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <p style={{ color: "#94a3b8", fontSize: 16 }}>読み込み中...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, Noto Sans JP, sans-serif" }}>
      {/* Header */}
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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ fontSize: 20, fontWeight: 800, textDecoration: "none" }}>
            <span style={{ color: "#2563eb" }}>Voice</span>
            <span style={{ color: "#1e293b" }}>Wall</span>
          </a>
          <span style={{ fontSize: 13, color: "#94a3b8", background: "#f1f5f9", padding: "3px 10px", borderRadius: 6 }}>
            Dashboard
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            placeholder="Project slug"
            style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, width: 140 }}
          />
          <button
            onClick={() => setSlug(slugInput)}
            style={{ padding: "6px 16px", borderRadius: 6, background: "#2563eb", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            読み込む
          </button>
          <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 8 }}>{user?.email}</span>
          <button
            onClick={handleLogout}
            style={{ padding: "6px 14px", borderRadius: 6, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", fontSize: 12, cursor: "pointer" }}
          >
            ログアウト
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
        {/* Project Info */}
        {project && (
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>{project.name}</h1>
            <p style={{ fontSize: 13, color: "#94a3b8" }}>Project ID: {project.id}</p>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "合計", value: stats.total, color: "#2563eb" },
            { label: "公開中", value: stats.published, color: "#16a34a" },
            { label: "承認待ち", value: stats.pending, color: "#f59e0b" },
            { label: "平均評価", value: `${stats.avgRating} ★`, color: "#8b5cf6" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>収集フォームURL</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                readOnly
                value={formUrl}
                style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, color: "#64748b", background: "#f8fafc" }}
              />
              <button
                onClick={() => copyToClipboard(formUrl, "form")}
                style={{ padding: "8px 16px", borderRadius: 6, background: copied === "form" ? "#16a34a" : "#2563eb", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                {copied === "form" ? "✓ コピー済み" : "コピー"}
              </button>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>埋め込みコード</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                readOnly
                value={embedCode}
                style={{ flex: 1, padding: "8px 12px", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 13, color: "#64748b", background: "#f8fafc" }}
              />
              <button
                onClick={() => copyToClipboard(embedCode, "embed")}
                style={{ padding: "8px 16px", borderRadius: 6, background: copied === "embed" ? "#16a34a" : "#2563eb", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                {copied === "embed" ? "✓ コピー済み" : "コピー"}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "#fff", borderRadius: 8, padding: 4, border: "1px solid #e2e8f0", width: "fit-content" }}>
          {(["all", "pending", "published"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 20px",
                borderRadius: 6,
                border: "none",
                background: tab === t ? "#2563eb" : "transparent",
                color: tab === t ? "#fff" : "#64748b",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t === "all" ? `すべて (${stats.total})` : t === "pending" ? `承認待ち (${stats.pending})` : `公開中 (${stats.published})`}
            </button>
          ))}
        </div>

        {/* Testimonials List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>読み込み中...</div>
        ) : filteredTestimonials.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
            <p style={{ color: "#94a3b8" }}>口コミはまだありません。</p>
            <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 8 }}>
              収集フォームURLを顧客に共有して、口コミを集めましょう。
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredTestimonials.map((t) => (
              <div
                key={t.id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 24,
                  border: `1px solid ${t.is_published ? "#bbf7d0" : "#e2e8f0"}`,
                  borderLeft: `4px solid ${t.is_published ? "#16a34a" : "#f59e0b"}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    {/* Stars */}
                    <div style={{ color: "#f59e0b", letterSpacing: 2, marginBottom: 8, fontSize: 14 }}>
                      {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                    </div>

                    {/* Content */}
                    <p style={{ fontSize: 15, color: "#1e293b", lineHeight: 1.7, marginBottom: 12 }}>
                      {t.content}
                    </p>

                    {/* Author */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{t.customer_name}</span>
                      {t.customer_title && (
                        <span style={{ fontSize: 13, color: "#94a3b8" }}>{t.customer_title}</span>
                      )}
                      {t.customer_email && (
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>{t.customer_email}</span>
                      )}
                      <span style={{ fontSize: 12, color: "#cbd5e1" }}>
                        {new Date(t.created_at).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
                    <button
                      onClick={() => togglePublish(t.id, t.is_published)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 6,
                        border: "1px solid #e2e8f0",
                        background: t.is_published ? "#fff" : "#16a34a",
                        color: t.is_published ? "#64748b" : "#fff",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.is_published ? "非公開にする" : "承認・公開"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
