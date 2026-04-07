import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  try {
    console.log("🔥 WEBHOOK HIT");

    const body = await req.text();

    const headersList = await headers();
    const sig = headersList.get("stripe-signature");

    if (!sig) {
      console.log("❌ NO SIGNATURE");
      return new Response("No signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("✅ EVENT:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const deviceId = session.metadata?.deviceId;

      console.log("💰 PAID:", deviceId);
    }

    return new Response("ok", { status: 200 });

  } catch (err: any) {
    console.error("❌ WEBHOOK ERROR:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}