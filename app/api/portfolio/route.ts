import { NextResponse } from "next/server";
import { projects, testimonials } from "@/lib/portfolio-data";

async function readTable(table: "projects" | "testimonials") {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const response = await fetch(
    `${url}/rest/v1/${table}?select=*&order=sort_order.asc`,
    {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 60 },
    },
  );
  if (!response.ok)
    throw new Error(`Supabase ${table} query failed: ${response.status}`);
  return response.json();
}

export async function GET() {
  try {
    const [remoteProjects, remoteTestimonials] = await Promise.all([
      readTable("projects"),
      readTable("testimonials"),
    ]);
    return NextResponse.json({
      projects: remoteProjects ?? projects,
      testimonials: remoteTestimonials ?? testimonials,
    });
  } catch {
    return NextResponse.json({ projects, testimonials, fallback: true });
  }
}
