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

    // ✅ MAPA PRICE ID (USTAW SWOJE!)
    const priceMap: Record<string, string> = {
      general: "price_1TJhzWJkGpeXxxwVUMmw54Va",   // 🔁 podmień
      love: "price_1TOGYmJkGpeXxxwV27I9rYso",      // 🔁 podmień
      question: "price_1TOGhPJkGpeXxxwV4wx4o6EI",  // 🔁 podmień
    };

    const priceId = priceMap[type];

    if (!priceId) {
      return NextResponse.json(
        { error: "Price not found" },
        { status: 400 }
      );
    }

    console.log("CHECKOUT TYPE:", type, "PRICE:", priceId);

    // ✅ STRIPE SESSION
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik"],
      mode: "payment",

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
    console.error("STRIPE ERROR:", err);

    return NextResponse.json(
      { error: "Stripe error" },
      { status: 500 }
    );
  }
}