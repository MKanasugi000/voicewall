"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface Customer {
  id: string;
  email: string;
  created_at: string;
  last_sign_in: string | null;
  plan: string;
  subscription_status: string;
  stripe_customer_id: string | null;
  project_count: number;
  testimonial_count: number;
}

interface Stats {
  total_users: number;
  pro_users: number;
  free_users: number;
  total_projects: number;
  total_testimonials: number;
  mrr: number;
  total_revenue: number;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [sortBy, setSortBy] = useState<"created_at" | "plan" | "testimonial_count">("created_at");
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        window.location.href = "/login";
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchCustomers();
  }, [user]);

  const fetchCustomers = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/customers?userId=${user.id}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "アクセスが拒否されました");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setCustomers(data.customers || []);
      setStats(data.stats || null);
    } catch {
      setError("データの取得に失敗しました");
    }
    setLoading(false);
  };

  const filteredCustomers = customers
    .filter((c) => !search || c.email?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "plan") {
        const planOrder = { pro: 0, free: 1 };
        return (planOrder[a.plan as keyof typeof planOrder] ?? 1) - (planOrder[b.plan as keyof typeof planOrder] ?? 1);
      }
      if (sortBy === "testimonial_count") return b.testimonial_count - a.testimonial_count;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <p style={{ color: "#94a3b8", fontSize: 16 }}>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h1 style={{ fontSize: 24, color: "#1e293b", marginBottom: 8 }}>アクセス権限がありません</h1>
          <p style={{ color: "#94a3b8" }}>{error}</p>
          <a href="/dashboard" style={{ display: "inline-block", marginTop: 24, padding: "10px 24px", borderRadius: 8, background: "#2563eb", color: "#fff", textDecoration: "none", fontWeight: 600 }}>
            ダッシュボードに戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, Noto Sans JP, sans-serif" }}>
      {/* Header */}
      <nav style={{
        background: "#1e293b",
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
            <span style={{ color: "#60a5fa" }}>Voice</span>
            <span style={{ color: "#fff" }}>Wall</span>
          </a>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#f59e0b",
            background: "rgba(245,158,11,0.15)",
            padding: "3px 10px",
            borderRadius: 6,
          }}>
            Admin
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/dashboard" style={{ color: "#94a3b8", fontSize: 13, textDecoration: "none" }}>ダッシュボード</a>
          <span style={{ fontSize: 12, color: "#64748b" }}>{user?.email}</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 20px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b", marginBottom: 24 }}>顧客管理</h1>

        {/* Revenue Stats */}
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { label: "MRR", value: `¥${stats.mrr.toLocaleString()}`, color: "#2563eb", sub: "月額経常収益" },
              { label: "Proユーザー", value: stats.pro_users, color: "#8b5cf6", sub: `/ ${stats.total_users}人中` },
              { label: "総ユーザー", value: stats.total_users, color: "#1e293b", sub: "登録者数" },
              { label: "総プロジェクト", value: stats.total_projects, color: "#16a34a", sub: "作成済み" },
              { label: "総口コミ", value: stats.total_testimonials, color: "#f59e0b", sub: "収集済み" },
              { label: "Stripe残高", value: `¥${Math.floor(stats.total_revenue / 100).toLocaleString()}`, color: "#0891b2", sub: "Available + Pending" },
            ].map((s, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 2 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        )}

        {/* Search & Sort */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="メールアドレスで検索..."
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              fontSize: 14,
              outline: "none",
              width: 300,
            }}
          />
          <div style={{ display: "flex", gap: 4, background: "#fff", borderRadius: 8, padding: 4, border: "1px solid #e2e8f0" }}>
            {([
              { key: "created_at", label: "登録日順" },
              { key: "plan", label: "プラン順" },
              { key: "testimonial_count", label: "口コミ数順" },
            ] as const).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "none",
                  background: sortBy === opt.key ? "#2563eb" : "transparent",
                  color: sortBy === opt.key ? "#fff" : "#64748b",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <span style={{ fontSize: 13, color: "#94a3b8", marginLeft: "auto" }}>
            {filteredCustomers.length}件表示
          </span>
        </div>

        {/* Customer Table */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 12 }}>メール</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#64748b", fontSize: 12 }}>プラン</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#64748b", fontSize: 12 }}>ステータス</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#64748b", fontSize: 12 }}>PJ数</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#64748b", fontSize: 12 }}>口コミ数</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 12 }}>登録日</th>
                <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 12 }}>最終ログイン</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontWeight: 600, color: "#64748b", fontSize: 12 }}>Stripe</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px", color: "#1e293b", fontWeight: 500 }}>{c.email || "—"}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: c.plan === "pro" ? "#2563eb" : "#64748b",
                      background: c.plan === "pro" ? "#dbeafe" : "#f1f5f9",
                      padding: "3px 10px",
                      borderRadius: 6,
                    }}>
                      {c.plan === "pro" ? "Pro" : "Free"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: c.subscription_status === "active" ? "#16a34a" : c.subscription_status === "canceled" ? "#dc2626" : "#94a3b8",
                    }}>
                      {c.subscription_status === "active" ? "有効" : c.subscription_status === "canceled" ? "解約" : "—"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center", color: "#1e293b" }}>{c.project_count}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center", color: "#1e293b", fontWeight: 600 }}>{c.testimonial_count}</td>
                  <td style={{ padding: "12px 16px", color: "#64748b", fontSize: 13 }}>
                    {new Date(c.created_at).toLocaleDateString("ja-JP")}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#64748b", fontSize: 13 }}>
                    {c.last_sign_in ? new Date(c.last_sign_in).toLocaleDateString("ja-JP") : "—"}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                    {c.stripe_customer_id ? (
                      <a
                        href={`https://dashboard.stripe.com/customers/${c.stripe_customer_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 12, color: "#2563eb", textDecoration: "none" }}
                      >
                        詳細 →
                      </a>
                    ) : (
                      <span style={{ color: "#cbd5e1", fontSize: 12 }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>
              該当する顧客がいません
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
