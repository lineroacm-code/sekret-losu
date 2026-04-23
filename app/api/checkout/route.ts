import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { deviceId, type } = await req.json();

    // ✅ WALIDACJA
    if (!["general", "love", "question"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type" },
        { status: 400 }
      );
    }

    // ✅ MAPA PRICE ID (upewnij się że to price_ a nie prod_)
    const priceMap: Record<string, string> = {
      general: "price_1TJhzWJkGpeXxxwVUMmw54Va",
      love: "price_1TOGYmJkGpeXxxwV27I9rYso",
      question: "price_1TOGhPJkGpeXxxwV4wx4o6EI",
    };

    const priceId = priceMap[type];

    if (!priceId) {
      return NextResponse.json(
        { error: "Price not found" },
        { status: 400 }
      );
    }

    // 🔍 DEBUG (bardzo ważne teraz)
    console.log("👉 TYPE:", type);
    console.log("👉 PRICE ID:", priceId);

    // ✅ STRIPE SESSION
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card", "blik"],

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_URL}/tarot?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/tarot`,

      metadata: {
        deviceId: deviceId || "unknown",
        type,
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error("❌ STRIPE ERROR:", err);

    return NextResponse.json(
      { error: "Stripe error" },
      { status: 500 }
    );
  }
}