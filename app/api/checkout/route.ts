import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { deviceId, type } = await req.json();

  let price = 1000; // default 10 PLN
  let name = "Tarot – Rozkład ogólny";

  if (type === "love") {
    price = 1000;
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
      deviceId,
      type,
    },
  });

  return NextResponse.json({ url: session.url });
}