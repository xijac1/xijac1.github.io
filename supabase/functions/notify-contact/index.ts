import "@supabase/functions-js/edge-runtime.d.ts";

declare const Deno: {
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

type MessageRecord = {
  id?: number;
  name?: string;
  email?: string;
  message?: string;
  created_at?: string;
};

type WebhookBody = {
  type?: string;
  table?: string;
  record?: MessageRecord;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const webhookSecret = Deno.env.get("WEBHOOK_SHARED_SECRET");
    const providedSecret = req.headers.get("x-webhook-secret");

    if (!webhookSecret || providedSecret !== webhookSecret) {
      return new Response("Unauthorized", { status: 401 });
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const toEmail = Deno.env.get("TO_EMAIL");
    const fromEmail = Deno.env.get("FROM_EMAIL");

    if (!resendApiKey || !toEmail || !fromEmail) {
      return new Response("Missing required env vars", { status: 500 });
    }

    const body = (await req.json()) as WebhookBody;
    const record = body.record;

    if (!record?.name || !record?.email || !record?.message) {
      return new Response("Invalid payload", { status: 400 });
    }

    const safeName = escapeHtml(record.name.trim());
    const safeEmail = escapeHtml(record.email.trim());
    const safeMessage = escapeHtml(record.message.trim()).replace(/\n/g, "<br>");

    const subject = `New contact form message from ${safeName}`;
    const html = `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
      <hr>
      <p><small>Message ID: ${record.id ?? "n/a"}</small></p>
      <p><small>Created At: ${record.created_at ?? "n/a"}</small></p>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: safeEmail,
        subject,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      return new Response(`Resend error: ${errorText}`, { status: 502 });
    }

    return new Response("ok", { status: 200 });
  } catch (error) {
    return new Response(`Unhandled error: ${String(error)}`, { status: 500 });
  }
});
