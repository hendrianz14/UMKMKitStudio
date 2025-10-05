import { NextResponse } from 'next/server';
import { supaServer } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Ensure data is always fresh

export async function GET() {
  const sb = supaServer();
  const { data: { user } } = await sb.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoISO = sevenDaysAgo.toISOString();

  // Fetch wallet data
  const { data: wallet, error: walletError } = await sb
    .from('credits_wallet')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (walletError) {
    console.error('Error fetching wallet:', walletError);
    return NextResponse.json({ error: 'Failed to fetch wallet data' }, { status: 500 });
  }

  // Fetch jobs this week
  const { count: jobsThisWeek, error: jobsError } = await sb
    .from('jobs')
    .select('id', { count: 'exact' })
    .eq('user_id', user.id)
    .gte('created_at', sevenDaysAgoISO);

  if (jobsError) {
    console.error('Error fetching jobs this week:', jobsError);
    return NextResponse.json({ error: 'Failed to fetch jobs data' }, { status: 500 });
  }

  // Fetch credits used this week
  const { data: creditsLedger, error: ledgerError } = await sb
    .from('credits_ledger')
    .select('change')
    .eq('user_id', user.id)
    .lt('change', 0) // Only count used credits (negative changes)
    .gte('created_at', sevenDaysAgoISO);

  if (ledgerError) {
    console.error('Error fetching credits ledger:', ledgerError);
    return NextResponse.json({ error: 'Failed to fetch credits ledger data' }, { status: 500 });
  }

  const creditsUsedThisWeek = creditsLedger?.reduce((sum, entry) => sum + Math.abs(entry.change), 0) ?? 0;

  const summary = {
    wallet: wallet,
    jobs_this_week: jobsThisWeek ?? 0,
    credits_used_this_week: creditsUsedThisWeek,
  };

  return NextResponse.json(summary);
}
