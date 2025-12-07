import { NextRequest, NextResponse } from 'next/server';
import { babysitters } from '@/data/storage';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const location = searchParams.get('location');
    const maxRate = searchParams.get('maxRate');
    const minRating = searchParams.get('minRating');
    const transportation = searchParams.get('transportation');

    let filtered = [...babysitters];

    // Filter by location
    if (location) {
      filtered = filtered.filter(b =>
        b.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by max hourly rate
    if (maxRate) {
      filtered = filtered.filter(b => b.hourlyRate <= parseFloat(maxRate));
    }

    // Filter by minimum rating
    if (minRating) {
      filtered = filtered.filter(b => b.rating >= parseFloat(minRating));
    }

    // Filter by transportation
    if (transportation && transportation !== 'either') {
      filtered = filtered.filter(b =>
        b.transportation === transportation || b.transportation === 'either'
      );
    }

    // Remove sensitive data
    const safeBabysitters = filtered.map(({ password, ...rest }) => rest);

    return NextResponse.json({ babysitters: safeBabysitters });
  } catch (error) {
    console.error('Error fetching babysitters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch babysitters' },
      { status: 500 }
    );
  }
}
