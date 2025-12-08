import { NextRequest, NextResponse } from 'next/server';
import { feedbacks, addFeedback } from '@/data/storage';
import { sanitizeString } from '@/lib/validation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ feedbacks });
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { rating, comment, type, userId, userEmail } = data;

    // Validate input
    if (!comment || comment.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment is required' },
        { status: 400 }
      );
    }

    if (type === 'rating' && (!rating || rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedComment = sanitizeString(comment).substring(0, 1000);

    addFeedback({
      userId,
      rating: type === 'rating' ? rating : undefined,
      comment: sanitizedComment,
      type: type || 'problem',
      userEmail: userEmail ? sanitizeString(userEmail) : undefined,
    });

    return NextResponse.json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
