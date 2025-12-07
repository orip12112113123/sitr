import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, validateAge, generateToken } from '@/lib/auth';
import { users, parents, babysitters, findUserByEmail } from '@/data/storage';
import { ParentProfile, BabysitterProfile } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password, type, name, age, phone, location } = data;

    // Validate age (must be 16+)
    if (!validateAge(age)) {
      return NextResponse.json(
        { error: 'You must be at least 16 years old to register' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (findUserByEmail(email)) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser = {
      id: userId,
      email,
      password: hashedPassword,
      type,
      name,
      age,
      phone,
      idPhotoUrl: data.idPhotoUrl || '/uploads/default-id.png',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Create profile based on type
    if (type === 'parent') {
      const parentProfile: ParentProfile = {
        ...newUser,
        type: 'parent',
        location,
        preferences: {
          preferredTransportation: data.preferredTransportation || 'either',
        },
      };
      parents.push(parentProfile);
    } else {
      const babysitterProfile: BabysitterProfile = {
        ...newUser,
        type: 'babysitter',
        location,
        hourlyRate: data.hourlyRate || 15,
        bio: data.bio || '',
        experience: data.experience || '',
        transportation: data.transportation || 'either',
        rating: 0,
        totalReviews: 0,
        availability: [],
      };
      babysitters.push(babysitterProfile);
    }

    // Generate token
    const token = generateToken(userId, type);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: userId,
        email,
        name,
        type,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
