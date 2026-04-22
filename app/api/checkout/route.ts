import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    let price = 1000;
    let name = "Tarot – Rozkład ogólny";

    if (type === "love") {
      name = "Tarot – Rozkład miłosny";
    }

    if (type === "question") {
      price = 2000;
      name = "Tarot – Własne pytanie";
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "pln",
            product_data: {
              name,
            },
            unit_amount: price,
          },
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