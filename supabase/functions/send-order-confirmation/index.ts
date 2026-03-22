import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { orderId, email, name, items, total, address, state, deliveryDate, timeSlot, instructions } = await req.json();

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not set' }), { status: 500, headers: corsHeaders });
    }

    const slotLabels: Record<string, string> = {
      morning: 'Morning (9am – 12pm)',
      afternoon: 'Afternoon (12pm – 4pm)',
      evening: 'Evening (4pm – 7pm)',
    };

    const itemsHtml = Array.isArray(items) ? items.map((item: any) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0e0e3;">
          <span style="font-weight: 600; text-transform: capitalize;">${item.productType || 'Item'}</span>
          ${item.customization?.size ? ` — ${item.customization.size}"` : ''}
          ${item.customization?.flavor || item.customization?.flavors?.[0] ? ` · ${item.customization.flavors?.[0] || item.customization.flavor}` : ''}
          <span style="color: #888; font-size: 13px;"> × ${item.quantity || 1}</span>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0e0e3; text-align: right; font-weight: 600;">
          ₦${((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString()}
        </td>
      </tr>
    `).join('') : '';

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf5f6;font-family:Arial,sans-serif;">
  <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #f0e0e3;">

    <!-- Header -->
    <div style="background:#7c1d2e;padding:28px 32px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:0.5px;">🎂 Frosted Crusts</h1>
      <p style="color:#f3c5cc;margin:6px 0 0;font-size:13px;">Handcrafted with love · Abuja, Nigeria</p>
    </div>

    <!-- Success banner -->
    <div style="background:#fdf4f5;border-bottom:1px solid #f0e0e3;padding:20px 32px;text-align:center;">
      <p style="font-size:28px;margin:0;">✅</p>
      <h2 style="color:#7c1d2e;margin:8px 0 4px;font-size:20px;">Order Confirmed!</h2>
      <p style="color:#888;margin:0;font-size:14px;">Order <strong>#${orderId}</strong></p>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">
      <p style="color:#333;line-height:1.6;margin:0 0 20px;">
        Hi <strong>${name || 'there'}</strong>, thanks for your order! We're already planning your delicious treats. 🥐
      </p>

      <!-- Items -->
      <h3 style="color:#7c1d2e;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 8px;">Your Order</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        ${itemsHtml}
        <tr>
          <td style="padding:12px 0 0;font-weight:700;font-size:15px;">Total</td>
          <td style="padding:12px 0 0;text-align:right;font-weight:700;font-size:15px;color:#7c1d2e;">₦${Number(total || 0).toLocaleString()}</td>
        </tr>
      </table>

      <hr style="border:none;border-top:1px solid #f0e0e3;margin:20px 0;" />

      <!-- Delivery -->
      <h3 style="color:#7c1d2e;font-size:14px;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 12px;">Delivery Details</h3>
      <table style="width:100%;font-size:14px;color:#444;line-height:1.8;">
        <tr><td style="color:#888;width:110px;">Address</td><td>${address || '—'}</td></tr>
        <tr><td style="color:#888;">State</td><td>${state || '—'}</td></tr>
        ${deliveryDate ? `<tr><td style="color:#888;">Date</td><td>${deliveryDate}</td></tr>` : ''}
        ${timeSlot ? `<tr><td style="color:#888;">Time slot</td><td>${slotLabels[timeSlot] || timeSlot}</td></tr>` : ''}
        ${instructions ? `<tr><td style="color:#888;vertical-align:top;">Notes</td><td style="font-style:italic;">"${instructions}"</td></tr>` : ''}
      </table>

      <hr style="border:none;border-top:1px solid #f0e0e3;margin:20px 0;" />

      <p style="color:#555;font-size:13px;line-height:1.6;margin:0;">
        Questions? Reply to this email or WhatsApp us at <strong>+234 9133748447</strong>.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#fdf4f5;padding:16px 32px;text-align:center;border-top:1px solid #f0e0e3;">
      <p style="color:#bbb;font-size:11px;margin:0;">Frosted Crusts · Abuja, Nigeria</p>
    </div>
  </div>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Frosted Crusts <onboarding@resend.dev>',
        to: [email],
        subject: `Order #${orderId} confirmed — Frosted Crusts`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: err }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
});
