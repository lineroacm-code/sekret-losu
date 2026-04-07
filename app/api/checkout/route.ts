import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { deviceId } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "p24"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "pln",
          product_data: {
            name: "Tarot Reading",
          },
          unit_amount: 1000, // 10 PLN
        },
        quantity: 1,
      },
    ],
      success_url: `${process.env.NEXT_PUBLIC_URL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}`,
    metadata: {
      deviceId,
    },
  });

  return NextResponse.json({ url: session.url });
}