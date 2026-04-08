import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    
    // Check against AGENT_SECRET only
    const correct = process.env.AGENT_SECRET;
    
    console.log('Checking password...'); // debug
    
    if (!correct) {
      return NextResponse.json(
        { success: false, error: 'Secret not configured' },
        { status: 500 }
      );
    }
    
    if (password === correct) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { success: false },
      { status: 401 }
    );
    
  } catch (error) {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}