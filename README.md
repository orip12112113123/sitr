# Sitr - Babysitter Platform

![Sitr Logo](https://img.shields.io/badge/Sitr-Babysitter%20Platform-ff6b47)

A modern web application connecting parents with trusted babysitters, similar to Uber but for babysitting services.

## Features

### For Parents
- Search and browse verified babysitters
- Filter by location, hourly rate, rating, and transportation
- View detailed profiles with ratings and reviews
- Book babysitters instantly
- Rate and review babysitters after service

### For Babysitters
- Create detailed professional profiles
- Set your own hourly rates
- Manage bookings and availability
- Build reputation through ratings and reviews
- Track earnings

### Security & Verification
- Age verification (16+ years required)
- ID photo upload requirement during registration
- Secure authentication with JWT tokens
- Password hashing with bcrypt

## Tech Stack

- **Frontend**: Next.js 14 (React), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Authentication**: JWT, bcryptjs
- **Styling**: Tailwind CSS with custom peach/pink theme
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sitr
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
sitr/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── babysitters/  # Babysitter endpoints
│   │   │   ├── bookings/     # Booking endpoints
│   │   │   └── reviews/      # Review endpoints
│   │   ├── parent/           # Parent dashboard
│   │   ├── babysitter/       # Babysitter dashboard
│   │   ├── register/         # Registration page
│   │   ├── login/            # Login page
│   │   └── page.tsx          # Homepage
│   ├── components/            # Reusable components
│   ├── lib/                   # Utilities and types
│   │   ├── types.ts          # TypeScript type definitions
│   │   └── auth.ts           # Authentication utilities
│   └── data/                  # Data storage (mock database)
│       └── storage.ts        # In-memory data storage
├── public/                    # Static assets
├── tailwind.config.js        # Tailwind CSS configuration
├── next.config.js            # Next.js configuration
└── package.json              # Dependencies and scripts
```

## Key Features Explained

### User Registration
- Dual registration system for parents and babysitters
- Required fields: name, age (16+), email, phone, location
- ID photo upload for verification
- Different onboarding flows based on user type

### Transportation Preferences
- **Parents**: Can specify if babysitter needs own car, will provide Uber, or either
- **Babysitters**: Can indicate if they have own car, need Uber, or are flexible

### Search & Filtering (Parent Dashboard)
- Filter by location (city/state)
- Set maximum hourly rate
- Filter by minimum rating (3+, 4+, 4.5+)
- Filter by transportation type

### Booking System
- Select date and duration
- Automatic cost calculation
- Real-time booking status tracking
- Booking history for both parents and babysitters

### Rating System
- 5-star rating system
- Written reviews
- Aggregate ratings displayed on profiles
- Review count tracking

## Color Scheme

The application uses a custom peach/pink color palette:

- **Peach**: Primary color for parent-facing features
  - `peach-50` to `peach-900`
  - Main: `#ff6b47`

- **Pink**: Primary color for babysitter-facing features
  - `pink-50` to `pink-900`
  - Main: `#ec4899`

## Mock Data

The application includes 6 mock babysitters for testing:
- Sarah Smith - $18/hr, 4.8 stars (Los Angeles, CA)
- Mike Jones - $15/hr, 4.5 stars (Los Angeles, CA)
- Emma Davis - $22/hr, 4.9 stars (Santa Monica, CA)
- Alex Wilson - $20/hr, 4.7 stars (Beverly Hills, CA)
- Jessica Brown - $17/hr, 4.6 stars (Pasadena, CA)
- Chris Taylor - $14/hr, New (Long Beach, CA)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Babysitters
- `GET /api/babysitters` - Get all babysitters (with optional filters)

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get bookings (filtered by parentId or babysitterId)

### Reviews
- `POST /api/reviews` - Create new review
- `GET /api/reviews` - Get reviews for a babysitter

## Future Enhancements

- Real database integration (PostgreSQL/MongoDB)
- Real-time chat between parents and babysitters
- Push notifications for booking updates
- Payment processing integration
- Background check verification
- Calendar integration
- Mobile app (React Native)
- Advanced search with map view
- Recurring bookings
- Multi-child support

## Contributing

This is a demo project. For production use, implement:
- Real database
- Proper file upload handling
- Payment gateway
- Email notifications
- SMS notifications
- Background check API integration
- More comprehensive error handling
- Unit and integration tests

## License

MIT License - feel free to use this project as a starting point for your own babysitting platform!

## Support

For questions or issues, please open an issue in the repository.

---

Built with ❤️ using Next.js and React
