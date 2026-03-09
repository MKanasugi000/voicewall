import { NextResponse } from "next/server";
import { stripe, STARTER_PRICE_ID, PRO_PRICE_ID, AGENCY_PRICE_ID } from "@/lib/stripe";

const PRICE_MAP: Record<string, string> = {
  starter: STARTER_PRICE_ID,
  pro: PRO_PRICE_ID,
  agency: AGENCY_PRICE_ID,
};

export async function POST(request: Request) {
  try {
    const { email, userId, plan } = await request.json();

    if (!email || !userId) {
      return NextResponse.json({ error: "Missing email or userId" }, { status: 400 });
    }

    // planが指定されていない場合はProをデフォルトに（後方互換性）
    const selectedPlan = plan || "pro";
    const priceId = PRICE_MAP[selectedPlan];

    if (!priceId) {
      return NextResponse.json({ error: `Price not configured for plan: ${selectedPlan}` }, { status: 500 });
    }

    // Stripe Checkout セッションを作成
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
        plan: selectedPlan,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://voicewall.vercel.app"}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://voicewall.vercel.app"}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "チェックアウトの作成に失敗しました" }, { status: 500 });
  }
}
