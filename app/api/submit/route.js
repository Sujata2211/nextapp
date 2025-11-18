import { neon } from "@neondatabase/serverless";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();

    // Only connect at runtime, not during build
    const sql = neon(process.env.DATABASE_URL);

    await sql`
      INSERT INTO contact_form (name, email, message)
      VALUES (${name}, ${email}, ${message})
    `;

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false }, { status: 500 });
  }
}

