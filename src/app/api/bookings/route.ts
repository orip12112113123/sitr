import { NextRequest, NextResponse } from 'next/server';
import { bookings, findBabysitterById } from '@/data/storage';
import { Booking } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { parentId, babysitterId, date, hours } = data;

    const babysitter = findBabysitterById(babysitterId);
    if (!babysitter) {
      return NextResponse.json(
        { error: 'Babysitter not found' },
        { status: 404 }
      );
    }

    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const totalAmount = babysitter.hourlyRate * hours;

    const newBooking: Booking = {
      id: bookingId,
      parentId,
      babysitterId,
      date,
      hours,
      status: 'pending',
      totalAmount,
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);

    return NextResponse.json({
      success: true,
      booking: newBooking,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const parentId = searchParams.get('parentId');
    const babysitterId = searchParams.get('babysitterId');

    let filtered = [...bookings];

    if (parentId) {
      filtered = filtered.filter(b => b.parentId === parentId);
    }

    if (babysitterId) {
      filtered = filtered.filter(b => b.babysitterId === babysitterId);
    }

    return NextResponse.json({ bookings: filtered });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
