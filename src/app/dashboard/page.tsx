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
  slug: string;
  testimonial_count: number;
  published_count: number;
  created_at: string;
}

type View = "projects" | "testimonials";

// チュートリアルステップ定義
const TUTORIAL_STEPS = [
  {
    icon: "📝",
    title: "Step 1: プロジェクトを作成",
    description: "まずはプロジェクトを作成しましょう。プロジェクト名を入力して「作成」を押すだけです。プロジェクトごとに口コミの収集・管理ができます。",
    tip: "例: 「My SaaS」「カフェレビュー」など、サービス名や用途に合わせた名前をつけましょう。",
  },
  {
    icon: "🔗",
    title: "Step 2: 収集フォームURLを共有",
    description: "プロジェクトを開くと「収集フォームURL」が表示されます。このURLを顧客やユーザーに共有するだけで、口コミを収集できます。",
    tip: "メール・SNS・Webサイトなど、どこからでもアクセスできるリンクです。",
  },
  {
    icon: "✅",
    title: "Step 3: 口コミを承認・公開",
    description: "集まった口コミはダッシュボードに表示されます。内容を確認して「承認・公開」ボタンを押すと、ウィジェットに反映されます。",
    tip: "不適切な口コミは非公開のままにできるので安心です。",
  },
  {
    icon: "🎨",
    title: "Step 4: ウィジェットをサイトに埋め込み",
    description: "「埋め込みコード」をコピーして、あなたのWebサイトに貼り付けるだけ。美しいウィジェットで口コミを表示できます。",
    tip: "Proプランならロゴ非表示・ダークモード・カラム数のカスタマイズも可能です。",
  },
];

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [plan, setPlan] = useState("free");
  const [view, setView] = useState<View>("projects");

  // Tutorial state
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState("");
  const [creating, setCreating] = useState(false);
  const [projectError, setProjectError] = useState("");

  // Testimonials state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [tab, setTab] = useState<"all" | "pending" | "published">("all");
  const [copied, setCopied] = useState("");

  // Auth check
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

  // Fetch plan
  useEffect(() => {
    if (!user) return;
    fetch(`/api/stripe/subscription?userId=${user.id}`)
      .then((r) => r.json())
      .then((d) => setPlan(d.plan || "free"))
      .catch(() => {});
  }, [user]);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    if (!user) return;
    setProjectsLoading(true);
    try {
      const res = await fetch(`/api/projects?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch { /* ignore */ }
    setProjectsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Check for upgrade success
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("upgraded") === "true") {
        setPlan("pro");
        window.history.replaceState({}, "", "/dashboard");
      }
    }
  }, []);

  // Tutorial: 初回アクセス時にチュートリアルを表示
  useEffect(() => {
    if (!user) return;
    const key = `voicewall_tutorial_done_${user.id}`;
    if (typeof window !== "undefined" && !localStorage.getItem(key)) {
      setShowTutorial(true);
    }
  }, [user]);

  const closeTutorial = () => {
    setShowTutorial(false);
    setTutorialStep(0);
    if (user) {
      localStorage.setItem(`voicewall_tutorial_done_${user.id}`, "true");
    }
  };

  const nextTutorialStep = () => {
    if (tutorialStep < TUTORIAL_STEPS.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      closeTutorial();
    }
  };

  const prevTutorialStep = () => {
    if (tutorialStep > 0) {
      setTutorialStep(tutorialStep - 1);
    }
  };

  const reopenTutorial = () => {
    setTutorialStep(0);
    setShowTutorial(true);
  };

  // Create project
  const createProject = async () => {
    if (!newProjectName.trim() || !user) return;
    setCreating(true);
    setProjectError("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newProjectName.trim(), userId: user.id, plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProjectError(data.error);
      } else {
        setNewProjectName("");
        fetchProjects();
      }
    } catch {
      setProjectError("エラーが発生しました");
    }
    setCreating(false);
  };

  // Delete project
  const deleteProject = async (id: string) => {
    if (!user || !confirm("このプロジェクトと全ての口コミを削除しますか？")) return;
    await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId: user.id }),
    });
    fetchProjects();
    if (selectedProject?.id === id) {
      setSelectedProject(null);
      setView("projects");
    }
  };

  // Fetch testimonials for selected project
  const fetchTestimonials = useCallback(async () => {
    if (!selectedProject) return;
    setTestimonialsLoading(true);
    try {
      const res = await fetch(`/api/testimonials?slug=${selectedProject.slug}&all=true`);
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      }
    } catch { /* ignore */ }
    setTestimonialsLoading(false);
  }, [selectedProject]);

  useEffect(() => {
    if (view === "testimonials" && selectedProject) {
      fetchTestimonials();
    }
  }, [view, selectedProject, fetchTestimonials]);

  // Toggle publish
  const togglePublish = async (id: string, currentStatus: boolean) => {
    await fetch("/api/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_published: !currentStatus }),
    });
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, is_published: !currentStatus } : t))
    );
  };

  // Delete testimonial
  const deleteTestimonial = async (id: string) => {
    if (!user || !confirm("この口コミを削除しますか？この操作は取り消せません。")) return;
    try {
      const res = await fetch("/api/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId: user.id }),
      });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "削除に失敗しました");
      }
    } catch {
      alert("削除に失敗しました");
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // Copy
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  };

  // Open project
  const openProject = (project: Project) => {
    setSelectedProject(project);
    setView("testimonials");
    setTab("all");
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
  const formUrl = selectedProject ? `${baseUrl}/t/${selectedProject.slug}` : "";

  // ウィジェットカスタマイズ用パラメータ
  const embedParams = plan === "pro" ? "?brand=0" : "";
  const embedCode = selectedProject
    ? `<iframe src="${baseUrl}/embed/${selectedProject.slug}${embedParams}" width="100%" height="600" frameborder="0" style="border:none;border-radius:12px;"></iframe>`
    : "";

  const FREE_LIMIT = { projects: 1, testimonials: 5 };

  // Stripeカスタマーポータル
  const handleManageSubscription = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        alert(data.error || "エラーが発生しました");
      }
    } catch {
      alert("エラーが発生しました");
    }
  };

  // CSVエクスポート
  const handleExportCSV = async () => {
    if (!selectedProject || !user) return;
    if (plan !== "pro") {
      alert("CSVエクスポートはProプラン限定の機能です。");
      return;
    }
    const url = `/api/testimonials/export?slug=${selectedProject.slug}&userId=${user.id}`;
    window.open(url, "_blank");
  };

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
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: plan === "pro" ? "#2563eb" : "#64748b",
            background: plan === "pro" ? "#dbeafe" : "#f1f5f9",
            padding: "3px 10px",
            borderRadius: 6,
          }}>
            {plan === "pro" ? "Pro" : "Free"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {plan === "free" ? (
            <a
              href="/pricing"
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                background: "#2563eb",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Proにアップグレード
            </a>
          ) : (
            <button
              onClick={handleManageSubscription}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                background: "#f1f5f9",
                color: "#64748b",
                border: "1px solid #e2e8f0",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              プラン管理
            </button>
          )}
          <button
            onClick={reopenTutorial}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              background: "#f0fdf4",
              color: "#16a34a",
              border: "1px solid #bbf7d0",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            使い方
          </button>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>{user?.email}</span>
          <button
            onClick={handleLogout}
            style={{ padding: "6px 14px", borderRadius: 6, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", fontSize: 12, cursor: "pointer" }}
          >
            ログアウト
          </button>
        </div>
      </nav>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeTutorial(); }}
        >
          <div style={{
            background: "#fff",
            borderRadius: 20,
            maxWidth: 520,
            width: "100%",
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
          }}>
            {/* Progress bar */}
            <div style={{ height: 4, background: "#e2e8f0" }}>
              <div style={{
                height: 4,
                background: "#2563eb",
                width: `${((tutorialStep + 1) / TUTORIAL_STEPS.length) * 100}%`,
                transition: "width 0.3s ease",
                borderRadius: 2,
              }} />
            </div>

            {/* Content */}
            <div style={{ padding: "40px 36px 32px" }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "#dbeafe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                marginBottom: 20,
              }}>
                {TUTORIAL_STEPS[tutorialStep].icon}
              </div>

              <div style={{ fontSize: 12, color: "#2563eb", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>
                {tutorialStep + 1} / {TUTORIAL_STEPS.length}
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", marginBottom: 12, lineHeight: 1.3 }}>
                {TUTORIAL_STEPS[tutorialStep].title}
              </h2>

              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>
                {TUTORIAL_STEPS[tutorialStep].description}
              </p>

              <div style={{
                background: "#f0f9ff",
                border: "1px solid #bae6fd",
                borderRadius: 10,
                padding: "12px 16px",
                fontSize: 13,
                color: "#0369a1",
                lineHeight: 1.6,
              }}>
                💡 {TUTORIAL_STEPS[tutorialStep].tip}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: "16px 36px 28px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <button
                onClick={closeTutorial}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: 13,
                  cursor: "pointer",
                  padding: "8px 0",
                }}
              >
                スキップ
              </button>
              <div style={{ display: "flex", gap: 8 }}>
                {tutorialStep > 0 && (
                  <button
                    onClick={prevTutorialStep}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 8,
                      background: "#f1f5f9",
                      color: "#64748b",
                      border: "none",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    戻る
                  </button>
                )}
                <button
                  onClick={nextTutorialStep}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 8,
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {tutorialStep === TUTORIAL_STEPS.length - 1 ? "始める" : "次へ"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
        {/* Breadcrumb */}
        {view === "testimonials" && selectedProject && (
          <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => { setView("projects"); setSelectedProject(null); }}
              style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: 14, fontWeight: 600, padding: 0 }}
            >
              プロジェクト一覧
            </button>
            <span style={{ color: "#94a3b8" }}>/</span>
            <span style={{ color: "#1e293b", fontSize: 14, fontWeight: 600 }}>{selectedProject.name}</span>
          </div>
        )}

        {/* ========= PROJECTS VIEW ========= */}
        {view === "projects" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1e293b" }}>プロジェクト</h1>
              {plan === "free" && (
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  {projects.length} / {FREE_LIMIT.projects} プロジェクト（Free）
                </span>
              )}
            </div>

            {/* Create Project */}
            <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0", marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>
                新しいプロジェクトを作成
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="プロジェクト名（例：My SaaS）"
                  onKeyDown={(e) => e.key === "Enter" && createProject()}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
                <button
                  onClick={createProject}
                  disabled={creating || !newProjectName.trim()}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 8,
                    background: creating || !newProjectName.trim() ? "#93c5fd" : "#2563eb",
                    color: "#fff",
                    border: "none",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: creating || !newProjectName.trim() ? "not-allowed" : "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {creating ? "作成中..." : "作成"}
                </button>
              </div>
              {projectError && (
                <div style={{ marginTop: 8, color: "#dc2626", fontSize: 13, background: "#fef2f2", padding: "8px 12px", borderRadius: 6 }}>
                  {projectError}
                </div>
              )}
            </div>

            {/* Project List */}
            {projectsLoading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>読み込み中...</div>
            ) : projects.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                <h2 style={{ fontSize: 20, color: "#1e293b", marginBottom: 8 }}>プロジェクトがまだありません</h2>
                <p style={{ color: "#94a3b8", fontSize: 14 }}>
                  上のフォームからプロジェクトを作成して、口コミの収集を始めましょう。
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                {projects.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      padding: 24,
                      border: "1px solid #e2e8f0",
                      cursor: "pointer",
                      transition: "box-shadow 0.2s",
                    }}
                    onClick={() => openProject(p)}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", margin: 0 }}>{p.name}</h3>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                        style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 16, padding: 4 }}
                        title="削除"
                      >
                        ×
                      </button>
                    </div>
                    <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: "#2563eb" }}>{p.testimonial_count}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>口コミ</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: "#16a34a" }}>{p.published_count}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>公開中</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8" }}>
                      slug: {p.slug}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ========= TESTIMONIALS VIEW ========= */}
        {view === "testimonials" && selectedProject && (
          <>
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

            {/* Plan limit warning */}
            {plan === "free" && stats.total >= FREE_LIMIT.testimonials && (
              <div style={{
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: 12,
                padding: "16px 24px",
                marginBottom: 24,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: "#92400e", fontSize: 14 }}>
                    Freeプランの上限（{FREE_LIMIT.testimonials}件）に達しました
                  </div>
                  <div style={{ color: "#a16207", fontSize: 13, marginTop: 4 }}>
                    Proプランにアップグレードすると無制限に口コミを収集できます。
                  </div>
                </div>
                <a
                  href="/pricing"
                  style={{
                    padding: "8px 20px",
                    borderRadius: 8,
                    background: "#2563eb",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  アップグレード
                </a>
              </div>
            )}

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
                <a href={formUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: "inline-block", marginTop: 8, fontSize: 12, color: "#2563eb", textDecoration: "none" }}>
                  プレビュー →
                </a>
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
                {plan === "pro" && (
                  <p style={{ fontSize: 11, color: "#16a34a", marginTop: 6 }}>
                    Pro: VoiceWallロゴ非表示 / ?theme=dark でダークモード / ?cols=2 でカラム数指定
                  </p>
                )}
              </div>
            </div>

            {/* Actions bar */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button
                onClick={handleExportCSV}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  background: plan === "pro" ? "#fff" : "#f1f5f9",
                  color: plan === "pro" ? "#1e293b" : "#94a3b8",
                  border: "1px solid #e2e8f0",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: plan === "pro" ? "pointer" : "not-allowed",
                }}
              >
                CSVエクスポート {plan !== "pro" && "(Pro)"}
              </button>
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
            {testimonialsLoading ? (
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
                        <div style={{ color: "#f59e0b", letterSpacing: 2, marginBottom: 8, fontSize: 14 }}>
                          {"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}
                        </div>
                        <p style={{ fontSize: 15, color: "#1e293b", lineHeight: 1.7, marginBottom: 12 }}>
                          {t.content}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>{t.customer_name}</span>
                          {t.customer_title && <span style={{ fontSize: 13, color: "#94a3b8" }}>{t.customer_title}</span>}
                          {t.customer_email && <span style={{ fontSize: 12, color: "#94a3b8" }}>{t.customer_email}</span>}
                          <span style={{ fontSize: 12, color: "#cbd5e1" }}>
                            {new Date(t.created_at).toLocaleDateString("ja-JP")}
                          </span>
                        </div>
                      </div>
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
                        <button
                          onClick={() => deleteTestimonial(t.id)}
                          style={{
                            padding: "8px 12px",
                            borderRadius: 6,
                            border: "1px solid #fecaca",
                            background: "#fff",
                            color: "#dc2626",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                          title="削除"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
