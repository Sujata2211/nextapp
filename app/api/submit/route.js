import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    await sql`
      CREATE TABLE IF NOT EXISTS form_entries (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        message TEXT
      )
    `;

    await sql`
      INSERT INTO form_entries (name, email, message)
      VALUES (${name}, ${email}, ${message})
    `;

    return Response.json({ success: true, message: "Data saved successfully!" });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
