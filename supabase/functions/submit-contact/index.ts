import "@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type SubmitContactBody = {
  name?: string;
  email?: string;
  message?: string;
  captcha_token?: string;
  website?: string;
  honeypot?: string;
};

type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

function jsonResponse(payload: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function getClientIp(req: Request): string | null {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) return xRealIp;

  return null;
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method Not Allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey =
    Deno.env.get("SUP_SERVICE_ROLE_KEY") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");

  if (!supabaseUrl || !serviceRoleKey || !turnstileSecret) {
    return jsonResponse({ error: "Server misconfigured" }, 500);
  }

  let body: SubmitContactBody;
  try {
    body = (await req.json()) as SubmitContactBody;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const honeypotValue = (body.website ?? body.honeypot ?? "").trim();
  if (honeypotValue) {
    return jsonResponse({ error: "Spam detected" }, 400);
  }

  const name = normalizeWhitespace(body.name ?? "");
  const email = normalizeWhitespace(body.email ?? "").toLowerCase();
  const message = (body.message ?? "").trim();
  const captchaToken = (body.captcha_token ?? "").trim();

  if (!name || !email || !message || !captchaToken) {
    return jsonResponse({ error: "Missing required fields" }, 400);
  }

  if (name.length < 1 || name.length > 120) {
    return jsonResponse({ error: "Name length is invalid" }, 400);
  }

  if (email.length < 5 || email.length > 254 || !email.includes("@")) {
    return jsonResponse({ error: "Email is invalid" }, 400);
  }

  if (message.length < 1 || message.length > 4000) {
    return jsonResponse({ error: "Message length is invalid" }, 400);
  }

  const turnstileForm = new URLSearchParams();
  turnstileForm.set("secret", turnstileSecret);
  turnstileForm.set("response", captchaToken);

  const clientIp = getClientIp(req);
  if (clientIp) {
    turnstileForm.set("remoteip", clientIp);
  }

  const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: turnstileForm,
  });

  if (!turnstileRes.ok) {
    return jsonResponse({ error: "CAPTCHA verification service unavailable" }, 502);
  }

  const turnstileJson = (await turnstileRes.json()) as TurnstileVerifyResponse;
  if (!turnstileJson.success) {
    return jsonResponse(
      {
        error: "CAPTCHA verification failed",
        details: turnstileJson["error-codes"] ?? [],
      },
      400,
    );
  }

  const insertRes = await fetch(`${supabaseUrl}/rest/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      name,
      email,
      message,
    }),
  });

  if (!insertRes.ok) {
    return jsonResponse({ error: "Failed to store message" }, 500);
  }

  return jsonResponse({ ok: true }, 200);
});
