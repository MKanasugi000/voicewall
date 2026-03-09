import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST: Submit a new testimonial
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { project_slug, customer_name, customer_email, customer_title, rating, content, consent } = body;

    if (!project_slug || !customer_name || !content) {
      return NextResponse.json(
        { error: "project_slug, customer_name, and content are required" },
        { status: 400 }
      );
    }

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Look up project by slug
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", project_slug)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Freeプランの口コミ数制限チェック（5件/月）
    const { data: projectFull } = await supabase
      .from("projects")
      .select("user_id")
      .eq("id", project.id)
      .single();

    if (projectFull?.user_id) {
      // ユーザーのプランを確認
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", projectFull.user_id)
        .eq("status", "active")
        .single();

      const userPlan = sub?.plan || "free";

      if (userPlan === "free") {
        // 今月の口コミ数をカウント
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        const { count: monthlyCount } = await supabase
          .from("testimonials")
          .select("*", { count: "exact", head: true })
          .eq("project_id", project.id)
          .gte("created_at", firstOfMonth);

        if ((monthlyCount || 0) >= 5) {
          return NextResponse.json(
            { error: "このプロジェクトの今月の口コミ上限（5件）に達しました。" },
            { status: 403 }
          );
        }
      }
    }

    // Insert testimonial
    const { error } = await supabase
      .from("testimonials")
      .insert([{
        project_id: project.id,
        customer_name: customer_name.trim(),
        customer_email: customer_email?.trim() || null,
        customer_title: customer_title?.trim() || null,
        rating: rating || 5,
        content: content.trim(),
        consent: consent !== false,
        is_published: false, // Requires approval
      }]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Testimonial submitted successfully" },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET: Fetch testimonials for a project (published only, or all for dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const all = searchParams.get("all"); // If "true", return all (for dashboard)

    if (!slug) {
      return NextResponse.json(
        { error: "slug parameter is required" },
        { status: 400 }
      );
    }

    // Look up project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, name")
      .eq("slug", slug)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Fetch testimonials
    let query = supabase
      .from("testimonials")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false });

    if (all !== "true") {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      project: { id: project.id, name: project.name },
      testimonials: data || [],
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH: Update testimonial (approve/reject)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, is_published } = body;

    if (!id || typeof is_published !== "boolean") {
      return NextResponse.json(
        { error: "id and is_published are required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("testimonials")
      .update({ is_published })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Updated successfully" });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
