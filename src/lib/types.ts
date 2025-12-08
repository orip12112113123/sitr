export type UserType = 'parent' | 'babysitter';

export type TransportationType = 'own_car' | 'uber' | 'either';

export interface User {
  id: string;
  email: string;
  password: string;
  type: UserType;
  name: string;
  age: number;
  phone: string;
  idPhotoUrl: string;
  createdAt: string;
}

export interface ParentProfile extends User {
  type: 'parent';
  location: string;
  preferences: {
    preferredTransportation: TransportationType;
  };
}

export interface BabysitterProfile extends User {
  type: 'babysitter';
  location: string;
  hourlyRate: number;
  bio: string;
  experience: string;
  transportation: TransportationType;
  rating: number;
  totalReviews: number;
  availability: string[];
}

export interface Review {
  id: string;
  babysitterId: string;
  parentId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  parentId: string;
  babysitterId: string;
  date: string;
  startTime?: string;
  endTime?: string;
  hours: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  createdAt: string;
  needsUber?: boolean; // Whether Uber transportation is needed
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  type: UserType;
  name: string;
  age: number;
  phone: string;
  location: string;

  // Parent specific
  preferredTransportation?: TransportationType;

  // Babysitter specific
  hourlyRate?: number;
  bio?: string;
  experience?: string;
  transportation?: TransportationType;
}
