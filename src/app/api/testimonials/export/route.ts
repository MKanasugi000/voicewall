import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: CSVエクスポート（Proプランのみ）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const userId = searchParams.get("userId");

  if (!slug || !userId) {
    return NextResponse.json({ error: "slug and userId are required" }, { status: 400 });
  }

  // プランチェック
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (!sub || sub.plan !== "pro") {
    return NextResponse.json(
      { error: "CSVエクスポートはProプラン限定の機能です。" },
      { status: 403 }
    );
  }

  // プロジェクト取得
  const { data: project } = await supabase
    .from("projects")
    .select("id, name")
    .eq("slug", slug)
    .eq("user_id", userId)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // 口コミ取得
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("project_id", project.id)
    .order("created_at", { ascending: false });

  if (!testimonials || testimonials.length === 0) {
    return NextResponse.json({ error: "エクスポートする口コミがありません" }, { status: 404 });
  }

  // CSV生成
  const BOM = "\uFEFF"; // Excel用BOM
  const headers = ["名前", "メール", "肩書き", "評価", "コメント", "公開状態", "投稿日"];
  const rows = testimonials.map((t) => [
    `"${(t.customer_name || "").replace(/"/g, '""')}"`,
    `"${(t.customer_email || "").replace(/"/g, '""')}"`,
    `"${(t.customer_title || "").replace(/"/g, '""')}"`,
    t.rating,
    `"${(t.content || "").replace(/"/g, '""')}"`,
    t.is_published ? "公開" : "非公開",
    new Date(t.created_at).toLocaleDateString("ja-JP"),
  ]);

  const csv = BOM + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${project.name}_testimonials.csv"`,
    },
  });
}
