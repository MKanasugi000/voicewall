import { NextResponse } from "next/server";
import { stripe, PRO_PRICE_ID } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { email, userId } = await request.json();

    if (!email || !userId) {
      return NextResponse.json({ error: "Missing email or userId" }, { status: 400 });
    }

    if (!PRO_PRICE_ID) {
      return NextResponse.json({ error: "Price not configured" }, { status: 500 });
    }

    // Stripe Checkout セッションを作成
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price: PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
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
