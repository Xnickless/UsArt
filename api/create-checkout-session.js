import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const BASE = 4999;   // grosze — pierwszy artysta (49,99 zł)
const EXTRA = 4500;  // każdy kolejny artysta studia (45,00 zł)
const TRIAL_DAYS = 60;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body || "{}");
    body = body || {};

    const plan = body.plan === "studio" ? "studio" : "solo";
    const members = plan === "studio"
      ? Math.max(2, Math.min(10, parseInt(body.members, 10) || 2)) : 1;
    const amount = BASE + (members - 1) * EXTRA;
    const name = plan === "studio"
      ? `UsArt Studio (${members} artystów)` : "UsArt Artysta solo";

    const origin = body.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{
        price_data: {
          currency: "pln",
          product_data: { name },
          unit_amount: amount,
          recurring: { interval: "month" },
        },
        quantity: 1,
      }],
      subscription_data: { trial_period_days: TRIAL_DAYS },
      customer_email: body.email || undefined,
      success_url: `${origin}/?platnosc=ok`,
      cancel_url: `${origin}/?platnosc=anulowano`,
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
