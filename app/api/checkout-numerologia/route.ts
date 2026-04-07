import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "p24"],
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: "pln",
          product_data: {
            name: "Analiza numerologiczna",
          },
          unit_amount: 1000, // 10 PLN
        },
        quantity: 1,
      },
    ],

    success_url: "http://localhost:3000/numerologia?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "http://localhost:3000/numerologia",
  });

  return NextResponse.json({ url: session.url });
}