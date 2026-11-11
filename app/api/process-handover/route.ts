import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Mock AI extraction & verification logic
    return NextResponse.json({
      decisions: [
        {
          text: "Switched authentication from JWT to OAuth2 for better security",
          source: "commit_8f2a1b.md"
        },
        {
          text: "Database migrated to PostgreSQL to support multi-tenant schemas",
          source: "meeting_notes_oct12.txt"
        }
      ],
      risks: [
        {
          text: "Stripe webhook integration is unverified in production environment",
          uncertainty: "High Risk"
        }
      ]
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}