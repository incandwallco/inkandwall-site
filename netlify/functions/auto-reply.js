// netlify/functions/auto-reply.js
// Sends an autoresponse email when a Netlify form submission is created.
// Requires environment vars in Netlify: SENDGRID_API_KEY, REPLY_FROM, REPLY_NAME
// Optional: BCC_EMAIL

const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const payload = body.payload || {};
    const formName = payload.form_name || payload.form_name || "";
    const data = payload.data || {};
    const email = (data.email || "").toString().trim();
    const name = (data.name || "there").toString().trim();

    if (!email) {
      return { statusCode: 200, body: JSON.stringify({ ok: true, skipped: "no email field" }) };
    }

    // Only respond to "booking" form
    if (formName && formName !== "booking") {
      return { statusCode: 200, body: JSON.stringify({ ok: true, skipped: "not booking form" }) };
    }

    const SG_KEY = process.env.SENDGRID_API_KEY;
    const REPLY_FROM = process.env.REPLY_FROM || "no-reply@yourdomain.com";
    const REPLY_NAME = process.env.REPLY_NAME || "Ink & Wall Co.";
    const BCC_EMAIL = process.env.BCC_EMAIL || "";

    if (!SG_KEY) {
      console.warn("Missing SENDGRID_API_KEY");
      return { statusCode: 500, body: JSON.stringify({ error: "Missing SENDGRID_API_KEY" }) };
    }

    const subject = "We saved your booking request — Ink & Wall Co.";
    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#0f172a">
        <h2 style="margin:0 0 10px">Thanks, ${name}!</h2>
        <p>We received your request and will reply within <strong>24 hours</strong>.</p>
        <p><strong>What happens next?</strong></p>
        <ol>
          <li>We’ll confirm your goals and wall details.</li>
          <li>You’ll receive a concept sketch in 48–72 hours.</li>
          <li>We schedule a tidy, on-time install.</li>
        </ol>
        <p style="margin-top:14px">If you prefer to talk now, call us at <a href="tel:+16196354119">619‑635‑4119</a>.</p>
        <p style="margin-top:20px;color:#64748b">Ink & Wall Co. — Calm, professional wall printing</p>
      </div>
    `;

    const msg = {
      personalizations: [{
        to: [{ email }],
        bcc: BCC_EMAIL ? [{ email: BCC_EMAIL }] : undefined,
        subject
      }],
      from: { email: REPLY_FROM, name: REPLY_NAME },
      content: [{ type: "text/html", value: html }]
    };

    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SG_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(msg)
    });

    if (res.status >= 200 && res.status < 300) {
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    } else {
      const text = await res.text();
      return { statusCode: 500, body: JSON.stringify({ error: "SendGrid error", detail: text }) };
    }
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
