import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('fund_allocations')
      .select('*');

    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch investments data' },
      { status: 500 }
    );
  }
} 