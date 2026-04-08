import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { password } = await req.json();
  
  const correct = process.env.AGENT_SECRET;
  
  if (password === correct) {
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json(
    { success: false },
    { status: 401 }
  );
}