import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { type } = await req.json();

   if (type !== "compatibility" && type !== "individual") {
  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
} 

    const priceId =
      type === "compatibility"
        ? "price_1TOxG3JkGpeXxxwVjbsoCvnU"
        : "price_1TOxESJkGpeXxxwVVcQ6bh97";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "blik"],
      mode: "payment",

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_URL}/numerologia?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/numerologia`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("STRIPE ERROR:", err);
    return NextResponse.json(
      { error: "Stripe error" },
      { status: 500 }
    );
  }
}