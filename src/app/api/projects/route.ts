import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: ユーザーのプロジェクト一覧を取得
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 各プロジェクトの口コミ数を取得
  const projectsWithCounts = await Promise.all(
    (data || []).map(async (project) => {
      const { count } = await supabase
        .from("testimonials")
        .select("*", { count: "exact", head: true })
        .eq("project_id", project.id);

      const { count: publishedCount } = await supabase
        .from("testimonials")
        .select("*", { count: "exact", head: true })
        .eq("project_id", project.id)
        .eq("is_published", true);

      return {
        ...project,
        testimonial_count: count || 0,
        published_count: publishedCount || 0,
      };
    })
  );

  return NextResponse.json({ projects: projectsWithCounts });
}

// POST: 新しいプロジェクトを作成
export async function POST(request: NextRequest) {
  try {
    const { name, userId, plan, industry } = await request.json();

    if (!name || !userId) {
      return NextResponse.json({ error: "name and userId are required" }, { status: 400 });
    }

    // プランごとのプロジェクト数制限
    const planLimits: Record<string, number> = { free: 1, starter: 3, pro: -1, agency: -1 };
    const limit = planLimits[plan || "free"] ?? 1;
    if (limit > 0) {
      const { count } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if ((count || 0) >= limit) {
        return NextResponse.json(
          { error: `現在のプランではプロジェクトは${limit}つまでです。アップグレードしてください。` },
          { status: 403 }
        );
      }
    }

    // slugを生成（名前からローマ字変換 + ランダム文字列）
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 20) || "project";

    const uniqueSlug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;

    const { data, error } = await supabase
      .from("projects")
      .insert([{
        name: name.trim(),
        slug: uniqueSlug,
        user_id: userId,
      }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ project: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE: プロジェクトを削除
export async function DELETE(request: NextRequest) {
  try {
    const { id, userId } = await request.json();

    if (!id || !userId) {
      return NextResponse.json({ error: "id and userId are required" }, { status: 400 });
    }

    // 所有者確認
    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // プロジェクトに紐づく口コミも削除
    await supabase.from("testimonials").delete().eq("project_id", id);
    await supabase.from("projects").delete().eq("id", id);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
