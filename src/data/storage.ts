import { User, ParentProfile, BabysitterProfile, Review, Booking } from '@/lib/types';

// In-memory storage (replace with real database in production)
export const users: User[] = [];
export const parents: ParentProfile[] = [];
export const babysitters: BabysitterProfile[] = [];
export const reviews: Review[] = [];
export const bookings: Booking[] = [];

// Helper functions
export function findUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email);
}

export function findUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function findParentById(id: string): ParentProfile | undefined {
  return parents.find(p => p.id === id);
}

export function findBabysitterById(id: string): BabysitterProfile | undefined {
  return babysitters.find(b => b.id === id);
}

export function getReviewsForBabysitter(babysitterId: string): Review[] {
  return reviews.filter(r => r.babysitterId === babysitterId);
}

export function getBookingsForParent(parentId: string): Booking[] {
  return bookings.filter(b => b.parentId === parentId);
}

export function getBookingsForBabysitter(babysitterId: string): Booking[] {
  return bookings.filter(b => b.babysitterId === babysitterId);
}

// Add some mock babysitters for testing
export function initializeMockData() {
  if (babysitters.length === 0) {
    const mockBabysitters = [
      {
        id: 'mock_1',
        email: 'sarah.smith@example.com',
        password: 'hashed_password',
        type: 'babysitter' as const,
        name: 'Sarah Smith',
        age: 22,
        phone: '555-0101',
        idPhotoUrl: '/uploads/mock-id.png',
        createdAt: '2024-01-01T00:00:00.000Z',
        location: 'Los Angeles, CA',
        hourlyRate: 18,
        bio: 'Experienced babysitter with a passion for child development. CPR certified and love working with kids of all ages!',
        experience: '5 years of babysitting experience with children ages 1-12',
        transportation: 'own_car' as const,
        rating: 4.8,
        totalReviews: 24,
        availability: ['weekends', 'evenings'],
      },
      {
        id: 'mock_2',
        email: 'mike.jones@example.com',
        password: 'hashed_password',
        type: 'babysitter' as const,
        name: 'Mike Jones',
        age: 19,
        phone: '555-0102',
        idPhotoUrl: '/uploads/mock-id.png',
        createdAt: '2024-01-02T00:00:00.000Z',
        location: 'Los Angeles, CA',
        hourlyRate: 15,
        bio: 'College student studying early childhood education. Great with toddlers and school-age children.',
        experience: '2 years working at summer camps and after-school programs',
        transportation: 'uber' as const,
        rating: 4.5,
        totalReviews: 12,
        availability: ['afternoons', 'weekends'],
      },
      {
        id: 'mock_3',
        email: 'emma.davis@example.com',
        password: 'hashed_password',
        type: 'babysitter' as const,
        name: 'Emma Davis',
        age: 25,
        phone: '555-0103',
        idPhotoUrl: '/uploads/mock-id.png',
        createdAt: '2024-01-03T00:00:00.000Z',
        location: 'Santa Monica, CA',
        hourlyRate: 22,
        bio: 'Professional nanny with extensive experience. Specialized in infant care and early childhood development.',
        experience: '7 years as a professional nanny, infant care specialist',
        transportation: 'own_car' as const,
        rating: 4.9,
        totalReviews: 45,
        availability: ['full-time', 'part-time'],
      },
      {
        id: 'mock_4',
        email: 'alex.wilson@example.com',
        password: 'hashed_password',
        type: 'babysitter' as const,
        name: 'Alex Wilson',
        age: 20,
        phone: '555-0104',
        idPhotoUrl: '/uploads/mock-id.png',
        createdAt: '2024-01-04T00:00:00.000Z',
        location: 'Beverly Hills, CA',
        hourlyRate: 20,
        bio: 'Fun, energetic babysitter who loves arts and crafts. First aid and CPR certified.',
        experience: '3 years of babysitting, volunteer work with youth programs',
        transportation: 'either' as const,
        rating: 4.7,
        totalReviews: 18,
        availability: ['evenings', 'weekends'],
      },
      {
        id: 'mock_5',
        email: 'jessica.brown@example.com',
        password: 'hashed_password',
        type: 'babysitter' as const,
        name: 'Jessica Brown',
        age: 21,
        phone: '555-0105',
        idPhotoUrl: '/uploads/mock-id.png',
        createdAt: '2024-01-05T00:00:00.000Z',
        location: 'Pasadena, CA',
        hourlyRate: 17,
        bio: 'Caring and responsible babysitter. Great at homework help and meal preparation.',
        experience: '4 years of experience with multiple families',
        transportation: 'own_car' as const,
        rating: 4.6,
        totalReviews: 20,
        availability: ['after-school', 'weekends'],
      },
      {
        id: 'mock_6',
        email: 'chris.taylor@example.com',
        password: 'hashed_password',
        type: 'babysitter' as const,
        name: 'Chris Taylor',
        age: 18,
        phone: '555-0106',
        idPhotoUrl: '/uploads/mock-id.png',
        createdAt: '2024-01-06T00:00:00.000Z',
        location: 'Long Beach, CA',
        hourlyRate: 14,
        bio: 'Recent high school graduate with babysitting experience. Love playing games and outdoor activities.',
        experience: '1.5 years of babysitting for neighbors and family friends',
        transportation: 'uber' as const,
        rating: 0,
        totalReviews: 0,
        availability: ['flexible'],
      },
    ];

    babysitters.push(...mockBabysitters);
  }
}

// Initialize mock data on module load
initializeMockData();
