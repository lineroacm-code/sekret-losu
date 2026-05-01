import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { deviceId, type } = await req.json();

    // ✅ WALIDACJA
    const allowedTypes = [
      "general",
      "love",
      "question",
      "thinking",
      "feelings",
      "return",
      "week",
      "action",
      "distance",
    ];

    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // ✅ PRICE MAP
    const priceMap: Record<string, string> = {
      general: "price_1TJhzWJkGpeXxxwVUMmw54Va",
      love: "price_1TOGYmJkGpeXxxwV27I9rYso",
      question: "price_1TOGhPJkGpeXxxwV4wx4o6EI",

      thinking: "price_1TSLapJkGpeXxxwVflMwfj28",
      feelings: "price_1TSLe1JkGpeXxxwVmMvFK7On",
      return: "price_1TSLfvJkGpeXxxwVaDyPpH5E",
      week: "price_1TSLgcJkGpeXxxwVQYG5EynZ",
      action: "price_1TSLhEJkGpeXxxwVtfBxrEo8",
      distance: "price_1TSLhqJkGpeXxxwVQJZCGQ4b",
    };

    const priceId = priceMap[type as keyof typeof priceMap];

    if (!priceId) {
      return NextResponse.json({ error: "Price not found" }, { status: 400 });
    }

    // ✅ NAZWY (metadata)
    const productNameMap: Record<string, string> = {
      general: "Rozkład ogólny",
      love: "Rozkład miłosny",
      question: "Własne pytanie",

      thinking: "Czy on/ona o mnie myśli",
      feelings: "Co on/ona czuje naprawdę",
      return: "Czy wróci do mnie",
      week: "Najbliższe 7 dni",
      action: "Czy zrobić pierwszy krok",
      distance: "Dlaczego się oddalił(a)",
    };

    // ✅ STRIPE SESSION
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      // 👉 zostawiamy jak masz (skoro BLIK działa u Ciebie)
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
        productName: productNameMap[type],
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ STRIPE ERROR:", err);

    return NextResponse.json(
      { error: err.message || "Stripe error" },
      { status: 500 }
    );
  }
}