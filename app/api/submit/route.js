# from your project root (~/nextapp)
cat > app/api/submit/route.js <<'EOF'
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // If no DB URL is provided, don't attempt to connect.
    // This prevents build-time errors. At runtime, pass DATABASE_URL to the container.
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.warn("DATABASE_URL not provided — skipping DB insert (build/runtime safe).");
      // Return success so the frontend can still work in non-DB mode.
      return NextResponse.json({ success: true, warning: "No DB configured (skipped insert)" });
    }

    // Import neon only at runtime (inside handler)
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(dbUrl);

    // Example insert — change table/columns to your DB schema
    await sql`
      INSERT INTO contact_form (name, email, message)
      VALUES (${name}, ${email}, ${message})
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API /api/submit error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
EOF
