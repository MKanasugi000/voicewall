import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// 管理者メールアドレス（ここを自分のメールに設定）
const ADMIN_EMAIL = "m.kanasugi0000ffxiv@gmail.com";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 管理者チェック（Supabaseからユーザーのメールを確認）
  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (!userData?.user || userData.user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Supabaseから全ユーザーを取得
    const { data: users } = await supabaseAdmin.auth.admin.listUsers({ perPage: 100 });

    // subscriptionsテーブルから全サブスクリプションを取得
    const { data: subscriptions } = await supabaseAdmin
      .from("subscriptions")
      .select("*");

    // projectsテーブルからプロジェクト数を集計
    const { data: projects } = await supabaseAdmin
      .from("projects")
      .select("id, user_id");

    // testimonialsテーブルから口コミ数を集計
    const { data: testimonials } = await supabaseAdmin
      .from("testimonials")
      .select("id, project_id");

    // プロジェクトIDとuser_idのマッピング
    const projectsByUser: Record<string, number> = {};
    const projectIds: Record<string, string> = {};
    (projects || []).forEach((p) => {
      if (p.user_id) {
        projectsByUser[p.user_id] = (projectsByUser[p.user_id] || 0) + 1;
      }
      projectIds[p.id] = p.user_id;
    });

    // 口コミ数をuser_idごとに集計
    const testimonialsByUser: Record<string, number> = {};
    (testimonials || []).forEach((t) => {
      const uid = projectIds[t.project_id];
      if (uid) {
        testimonialsByUser[uid] = (testimonialsByUser[uid] || 0) + 1;
      }
    });

    // サブスクリプション情報をuser_idでマッピング
    const subByUser: Record<string, { plan: string; status: string; stripe_customer_id: string; stripe_subscription_id: string }> = {};
    (subscriptions || []).forEach((s) => {
      subByUser[s.user_id] = {
        plan: s.plan,
        status: s.status,
        stripe_customer_id: s.stripe_customer_id,
        stripe_subscription_id: s.stripe_subscription_id,
      };
    });

    // ユーザーリスト構築
    const customers = (users?.users || []).map((u) => {
      const sub = subByUser[u.id];
      return {
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in: u.last_sign_in_at,
        plan: sub?.plan || "free",
        subscription_status: sub?.status || "none",
        stripe_customer_id: sub?.stripe_customer_id || null,
        project_count: projectsByUser[u.id] || 0,
        testimonial_count: testimonialsByUser[u.id] || 0,
      };
    });

    // Stripe売上情報（MRR）
    let mrr = 0;
    let totalRevenue = 0;
    try {
      // アクティブなサブスクリプション数からMRR計算
      const proUsers = customers.filter((c) => c.plan === "pro" && c.subscription_status === "active").length;
      mrr = proUsers * 980;

      // Stripe残高から総売上を取得
      const balance = await stripe.balance.retrieve();
      totalRevenue = (balance.available?.[0]?.amount || 0) + (balance.pending?.[0]?.amount || 0);
    } catch {
      // Stripe APIエラーは無視
    }

    // 統計情報
    const stats = {
      total_users: customers.length,
      pro_users: customers.filter((c) => c.plan === "pro" && c.subscription_status === "active").length,
      free_users: customers.filter((c) => c.plan !== "pro" || c.subscription_status !== "active").length,
      total_projects: Object.values(projectsByUser).reduce((sum, n) => sum + n, 0),
      total_testimonials: Object.values(testimonialsByUser).reduce((sum, n) => sum + n, 0),
      mrr,
      total_revenue: totalRevenue,
    };

    return NextResponse.json({ customers, stats });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
