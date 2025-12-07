import { NextRequest, NextResponse } from 'next/server';
import { reviews, babysitters, findBabysitterById } from '@/data/storage';
import { Review } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { babysitterId, parentId, rating, comment } = data;

    const reviewId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const newReview: Review = {
      id: reviewId,
      babysitterId,
      parentId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);

    // Update babysitter rating
    const babysitter = findBabysitterById(babysitterId);
    if (babysitter) {
      const babysitterReviews = reviews.filter(r => r.babysitterId === babysitterId);
      const totalRating = babysitterReviews.reduce((sum, r) => sum + r.rating, 0);
      babysitter.rating = totalRating / babysitterReviews.length;
      babysitter.totalReviews = babysitterReviews.length;
    }

    return NextResponse.json({
      success: true,
      review: newReview,
    });
  } catch (error) {
    console.error('Review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const babysitterId = searchParams.get('babysitterId');

    if (!babysitterId) {
      return NextResponse.json({ reviews: [] });
    }

    const babysitterReviews = reviews.filter(r => r.babysitterId === babysitterId);

    return NextResponse.json({ reviews: babysitterReviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
