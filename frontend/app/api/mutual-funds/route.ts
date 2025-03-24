import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', '38e84414-3d32-495e-b1d2-6ebf6adf4320');

    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch mutual funds data' },
      { status: 500 }
    );
  }
}
