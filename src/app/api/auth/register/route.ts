import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken } from '@/lib/auth';
import { users, parents, babysitters, findUserByEmail, trackEvent } from '@/data/storage';
import { ParentProfile, BabysitterProfile } from '@/lib/types';
import { validateUserInput, sanitizeString, checkRateLimit } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password, type, name, age, phone, location } = data;

    // Rate limiting to prevent abuse
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`register_${clientIp}`, 5, 3600000)) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Comprehensive input validation
    const validation = validateUserInput({ email, name, phone, age, bio: data.bio, location });
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.errors.join(', ') },
        { status: 400 }
      );
    }

    // Password strength validation
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check for duplicate users
    if (findUserByEmail(email)) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Securely hash password
    const hashedPassword = await hashPassword(password);

    // Create user with sanitized inputs to prevent XSS
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser = {
      id: userId,
      email: sanitizeString(email).toLowerCase(),
      password: hashedPassword,
      type,
      name: sanitizeString(name),
      age,
      phone: sanitizeString(phone),
      idPhotoUrl: data.idPhotoUrl || '/uploads/default-id.png',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Create type-specific profile with sanitized data
    if (type === 'parent') {
      const parentProfile: ParentProfile = {
        ...newUser,
        type: 'parent',
        location: sanitizeString(location),
        preferences: {
          preferredTransportation: data.preferredTransportation || 'either',
        },
      };
      parents.push(parentProfile);
    } else {
      const babysitterProfile: BabysitterProfile = {
        ...newUser,
        type: 'babysitter',
        location: sanitizeString(location),
        hourlyRate: Math.min(Math.max(data.hourlyRate || 15, 10), 200), // Prevent extreme values
        bio: sanitizeString(data.bio || '').substring(0, 500), // Limit length
        experience: sanitizeString(data.experience || '').substring(0, 500),
        transportation: data.transportation || 'either',
        rating: 0,
        totalReviews: 0,
        availability: [],
      };
      babysitters.push(babysitterProfile);
    }

    // Generate secure JWT token
    const token = generateToken(userId, type);

    // Track registration event for analytics
    trackEvent({
      type: 'registration',
      userId,
      metadata: { userType: type },
    });

    // Don't expose sensitive data in response
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: userId,
        email: newUser.email,
        name: newUser.name,
        type,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Generic error message to prevent information leakage
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
