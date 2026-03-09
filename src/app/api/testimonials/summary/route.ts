import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// AI口コミ要約API（Pro/Agency向け）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const userId = searchParams.get("userId");

    if (!slug || !userId) {
      return NextResponse.json({ error: "slug and userId are required" }, { status: 400 });
    }

    // プラン確認（Pro/Agency限定）
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    const userPlan = sub?.plan || "free";
    if (userPlan !== "pro" && userPlan !== "agency") {
      return NextResponse.json(
        { error: "AI口コミ要約はPro/Agencyプラン限定の機能です。" },
        { status: 403 }
      );
    }

    // プロジェクト取得
    const { data: project } = await supabase
      .from("projects")
      .select("id, name, user_id")
      .eq("slug", slug)
      .single();

    if (!project || project.user_id !== userId) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // 公開済み口コミを取得
    const { data: testimonials } = await supabase
      .from("testimonials")
      .select("*")
      .eq("project_id", project.id)
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (!testimonials || testimonials.length === 0) {
      return NextResponse.json({
        summary: {
          totalCount: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          highlights: [],
          improvements: [],
          keywords: [],
          overallSentiment: "データ不足",
          generatedAt: new Date().toISOString(),
        },
      });
    }

    // 統計計算
    const totalCount = testimonials.length;
    const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / totalCount;
    const ratingDistribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    testimonials.forEach((t) => {
      ratingDistribution[t.rating] = (ratingDistribution[t.rating] || 0) + 1;
    });

    // テキスト分析
    const allContent = testimonials.map((t) => t.content).join(" ");

    // キーワード抽出（シンプルな頻出語分析）
    const keywords = extractKeywords(allContent);

    // ポジティブ・ネガティブ分析
    const positiveWords = ["満足", "素晴らしい", "良い", "最高", "おすすめ", "丁寧", "親切", "便利", "簡単", "感謝", "嬉しい", "綺麗", "美味しい", "早い", "安心"];
    const negativeWords = ["不満", "悪い", "遅い", "高い", "難しい", "分かりにくい", "残念", "改善", "微妙", "期待はずれ"];

    const positiveCount = positiveWords.reduce((count, word) => count + (allContent.split(word).length - 1), 0);
    const negativeCount = negativeWords.reduce((count, word) => count + (allContent.split(word).length - 1), 0);

    let overallSentiment = "普通";
    if (averageRating >= 4.5 && positiveCount > negativeCount * 3) overallSentiment = "非常にポジティブ";
    else if (averageRating >= 4.0) overallSentiment = "ポジティブ";
    else if (averageRating >= 3.0) overallSentiment = "やや良い";
    else if (averageRating >= 2.0) overallSentiment = "改善の余地あり";
    else overallSentiment = "注意が必要";

    // ハイライト（高評価の口コミ上位3件）
    const highlights = testimonials
      .filter((t) => t.rating >= 4)
      .sort((a, b) => b.rating - a.rating || b.content.length - a.content.length)
      .slice(0, 3)
      .map((t) => ({
        content: t.content.substring(0, 100) + (t.content.length > 100 ? "..." : ""),
        rating: t.rating,
        name: t.customer_name,
      }));

    // 改善点（低評価の口コミ）
    const improvements = testimonials
      .filter((t) => t.rating <= 3)
      .sort((a, b) => a.rating - b.rating)
      .slice(0, 3)
      .map((t) => ({
        content: t.content.substring(0, 100) + (t.content.length > 100 ? "..." : ""),
        rating: t.rating,
        name: t.customer_name,
      }));

    // 月別トレンド
    const monthlyTrend = getMonthlyTrend(testimonials);

    return NextResponse.json({
      summary: {
        totalCount,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution,
        highlights,
        improvements,
        keywords,
        overallSentiment,
        positiveCount,
        negativeCount,
        monthlyTrend,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Summary error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function extractKeywords(text: string): { word: string; count: number }[] {
  // ストップワード（助詞・助動詞等）を除外
  const stopWords = new Set([
    "の", "に", "は", "を", "た", "が", "で", "て", "と", "し", "れ", "さ",
    "ある", "いる", "も", "する", "から", "な", "こと", "として", "い", "や",
    "れる", "など", "なっ", "ない", "この", "ため", "その", "あっ", "よう",
    "また", "もの", "という", "あり", "まで", "られ", "なる", "へ", "か",
    "だ", "これ", "によって", "により", "おり", "より", "による", "ず",
    "です", "ます", "でし", "まし", "てい", "した", "ました", "います",
  ]);

  // 2-4文字のトークンを抽出（簡易N-gram）
  const tokens: Record<string, number> = {};
  for (let len = 2; len <= 4; len++) {
    for (let i = 0; i <= text.length - len; i++) {
      const token = text.substring(i, i + len);
      if (/^[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]+$/.test(token) && !stopWords.has(token)) {
        tokens[token] = (tokens[token] || 0) + 1;
      }
    }
  }

  return Object.entries(tokens)
    .filter(([, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word, count]) => ({ word, count }));
}

function getMonthlyTrend(testimonials: { rating: number; created_at: string }[]) {
  const months: Record<string, { count: number; totalRating: number }> = {};

  testimonials.forEach((t) => {
    const date = new Date(t.created_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!months[key]) months[key] = { count: 0, totalRating: 0 };
    months[key].count++;
    months[key].totalRating += t.rating;
  });

  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({
      month,
      count: data.count,
      avgRating: Math.round((data.totalRating / data.count) * 10) / 10,
    }));
}
