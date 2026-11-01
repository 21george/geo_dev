import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

// Nodemailer needs a Node.js runtime with outbound SMTP access (e.g. a Node host).
export const runtime = "nodejs";

const schema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("message"),
    name: z.string().trim().min(2).max(100),
    email: z.email().max(254),
    company: z.string().trim().max(120).optional().default(""),
    message: z.string().trim().min(10).max(5000),
    privacyConsent: z.literal(true),
    website: z.string().max(100).optional().default(""),
    formStartedAt: z.number().int().positive(),
  }),
  z.object({
    type: z.literal("call"),
    name: z.string().trim().min(2).max(100),
    email: z.email().max(254),
    company: z.string().trim().max(120).optional().default(""),
    message: z.string().trim().max(5000).optional().default(""),
    date: z.iso.date(),
    time: z.string().regex(/^(0[9]|1[0-7]):(00|30)$/),
    privacyConsent: z.literal(true),
    website: z.string().max(100).optional().default(""),
    formStartedAt: z.number().int().positive(),
  }),
]);

type Inquiry = z.infer<typeof schema>;

function berlinNow() {
  const pieces = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date());
  const p = Object.fromEntries(pieces.map(({type, value}) => [type,value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

function validateCallDate(date: string, time: string) {
  const now = berlinNow();
  if (date < now.date || (date === now.date && time <= now.time)) return false;
  const [y,m,d] = date.split("-").map(Number);
  const day = new Date(Date.UTC(y,m-1,d)).getUTCDay();
  if (day === 0 || day === 6) return false;
  const upper = new Date();
  upper.setUTCFullYear(upper.getUTCFullYear() + 1);
  return date <= upper.toISOString().slice(0,10);
}

async function saveInquiry(input: Inquiry) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing");
  const response = await fetch(`${url.replace(/\/$/,"")}/rest/v1/inquiries`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({
      kind: input.type,
      name: input.name,
      email: input.email,
      company: input.company,
      message: input.message,
      requested_date: input.type === "call" ? input.date : null,
      requested_time: input.type === "call" ? input.time : null,
      requested_timezone: input.type === "call" ? "Europe/Berlin" : null,
      status: input.type === "call" ? "pending" : "new",
      email_status: "pending",
      consent_at: new Date().toISOString(),
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Supabase insert failed (${response.status})`);
  const data = await response.json() as {id: string}[];
  if (!data[0]?.id) throw new Error("Supabase did not return an inquiry id");
  return { id: data[0].id, url: url.replace(/\/$/,""), key };
}

async function markEmail(id: string, status: "sent" | "failed", url: string, key: string) {
  const res = await fetch(`${url}/rest/v1/inquiries?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email_status: status }),
  });
  if (!res.ok) console.error("Could not update notification status", res.status);
}

async function sendNotification(input: Inquiry, id: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const from = process.env.SMTP_FROM;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!host || !from || !to || !Number.isInteger(port)) throw new Error("SMTP configuration is missing");
  const transporter = nodemailer.createTransport({
    host, port, secure: port === 465,
    auth: process.env.SMTP_USER && process.env.SMTP_PASS
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  const lines = [
    `Inquiry ID: ${id}`, `Type: ${input.type}`, `Name: ${input.name}`,
    `Email: ${input.email}`, `Company: ${input.company || "—"}`,
    ...(input.type === "call" ? [`Requested date: ${input.date}`, `Requested time: ${input.time} (Europe/Berlin)`, "Status: Pending your confirmation"] : []),
    "", "Message:", input.message || "(No additional message)",
  ];
  await transporter.sendMail({
    from,
    to,
    replyTo: input.email,
    subject: input.type === "call" ? `[geo_dev] New call request from ${input.name}` : `[geo_dev] New message from ${input.name}`,
    text: lines.join("\n"),
  });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 12000) return NextResponse.json({error:"Request too large"}, {status:413});
  let payload: unknown;
  try {
    const raw=await request.text();
    if(raw.length>12000)return NextResponse.json({error:"Request too large"}, {status:413});
    payload=JSON.parse(raw);
  } catch { return NextResponse.json({error:"Invalid request"}, {status:400}); }
  const result = schema.safeParse(payload);
  if (!result.success) return NextResponse.json({error:"Please check the form fields and try again."}, {status:400});
  const input = result.data;
  if (input.website || Date.now() - input.formStartedAt < 2000 || Date.now() - input.formStartedAt > 86_400_000) {
    return NextResponse.json({error:"Unable to process this request."}, {status:400});
  }
  if (input.type === "call" && !validateCallDate(input.date,input.time)) {
    return NextResponse.json({error:"Choose a future weekday between 09:00 and 17:30 (Munich time)."}, {status:400});
  }
  try {
    const saved = await saveInquiry(input);
    try {
      await sendNotification(input, saved.id);
      await markEmail(saved.id,"sent",saved.url,saved.key);
      return NextResponse.json({ok:true,notification:"sent",id:saved.id}, {status:201});
    } catch (error) {
      console.error("Inquiry stored but email notification failed", error);
      await markEmail(saved.id,"failed",saved.url,saved.key);
      return NextResponse.json({ok:true,notification:"failed",id:saved.id}, {status:202});
    }
  } catch (error) {
    console.error("Inquiry submission failed",error);
    return NextResponse.json({error:"We couldn't save your request. Please try again later."}, {status:503});
  }
}
