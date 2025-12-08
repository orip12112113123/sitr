import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/data/storage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // In production, verify admin authentication here
    const summary = getAnalyticsSummary();
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
