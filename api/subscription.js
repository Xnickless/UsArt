import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    let body = req.body;
    if (typeof body === "string") body = JSON.parse(body || "{}");
    body = body || {};

    // Pobierz dane subskrypcji po zakończonej płatności (po powrocie ze Stripe)
    if (body.action === "sync") {
      const s = await stripe.checkout.sessions.retrieve(body.session_id, { expand: ["subscription"] });
      const sub = s.subscription;
      if (!sub) return res.status(200).json({});
      return res.status(200).json({
        customer: typeof s.customer === "string" ? s.customer : s.customer?.id || null,
        subscription_id: sub.id,
        status: sub.status,
        start: sub.start_date,
        period_end: sub.current_period_end,
        trial_end: sub.trial_end,
        cancel_at_period_end: sub.cancel_at_period_end,
      });
    }

    // Anuluj subskrypcję na koniec bieżącego okresu
    if (body.action === "cancel") {
      const sub = await stripe.subscriptions.update(body.subscription_id, { cancel_at_period_end: true });
      return res.status(200).json({
        subscription_id: sub.id,
        status: sub.status,
        period_end: sub.current_period_end,
        cancel_at_period_end: sub.cancel_at_period_end,
      });
    }

    return res.status(400).json({ error: "Unknown action" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
