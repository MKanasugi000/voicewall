import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET: プロジェクトオーナーがProプランか確認（埋め込みウィジェット用）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ isPro: false });
  }

  // プロジェクトからuser_idを取得
  const { data: project } = await supabase
    .from("projects")
    .select("user_id")
    .eq("slug", slug)
    .single();

  if (!project?.user_id) {
    return NextResponse.json({ isPro: false });
  }

  // サブスクリプション確認
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", project.user_id)
    .eq("status", "active")
    .single();

  return NextResponse.json({ isPro: sub?.plan === "pro" });
}
