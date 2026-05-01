import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const { deviceId, type } = await req.json();

    // ✅ WALIDACJA — wszystkie typy
    if (
      ![
        "general",
        "love",
        "question",
        "thinking",
        "feelings",
        "return",
        "week",
        "action",
        "distance",
      ].includes(type)
    ) {
      return NextResponse.json(
        { error: "Invalid type" },
        { status: 400 }
      );
    }

    /**
     * ✅ MAPA PRODUKTÓW → PRICE ID
     *
     * 🔴 TU MUSISZ WPISAĆ SWOJE price_xxx z Stripe
     * (Dashboard → Products → Price)
     */
    const priceMap: Record<string, string> = {
      // stare
      general: "price_1TJhzWJkGpeXxxwVUMmw54Va",
      love: "price_1TOGYmJkGpeXxxwV27I9rYso",
      question: "price_1TOGhPJkGpeXxxwV4wx4o6EI",

      // nowe produkty 👇
      thinking: "price_1TSLapJkGpeXxxwVflMwfj28",   // ← podmień
      feelings: "price_1TSLe1JkGpeXxxwVmMvFK7On",   // ← podmień
      return: "price_1TSLfvJkGpeXxxwVaDyPpH5E",       // ← podmień
      week: "price_1TSLgcJkGpeXxxwVQYG5EynZ",           // ← podmień
      action: "price_1TSLhEJkGpeXxxwVtfBxrEo8",       // ← podmień
      distance: "price_1TSLhqJkGpeXxxwVQJZCGQ4b",   // ← podmień
    };

    const priceId = priceMap[type];

    if (!priceId) {
      return NextResponse.json(
        { error: "Price not found" },
        { status: 400 }
      );
    }

    // 🔍 DEBUG
    console.log("👉 TYPE:", type);
    console.log("👉 PRICE ID:", priceId);

    // 🧠 opcjonalne: dynamiczna nazwa (logi + analityka)
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
      { error: "Stripe error" },
      { status: 500 }
    );
  }
}