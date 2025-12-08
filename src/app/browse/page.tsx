'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Baby, MapPin, Car, DollarSign, Star, ArrowLeft, Navigation } from 'lucide-react';
import { BabysitterProfile } from '@/lib/types';

export default function BrowseBabysitters() {
  const [babysitters, setBabysitters] = useState<BabysitterProfile[]>([]);
  const [filteredBabysitters, setFilteredBabysitters] = useState<BabysitterProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState('Los Angeles, CA');

  const [filters, setFilters] = useState({
    location: '',
    maxRate: '',
    minRating: '',
    transportation: '',
    maxDistance: '',
  });

  useEffect(() => {
    fetchBabysitters();
  }, []);

  const fetchBabysitters = async () => {
    try {
      const response = await fetch('/api/babysitters');
      const data = await response.json();

      // Add fake distance data for demo
      const babysittersWithDistance = data.babysitters.map((b: BabysitterProfile) => ({
        ...b,
        distance: Math.floor(Math.random() * 15) + 1, // Random distance 1-15 miles
      }));

      setBabysitters(babysittersWithDistance);
      setFilteredBabysitters(babysittersWithDistance);
    } catch (error) {
      console.error('Error fetching babysitters:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...babysitters];

    if (filters.location) {
      filtered = filtered.filter(b =>
        b.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.maxRate) {
      filtered = filtered.filter(b => b.hourlyRate <= parseFloat(filters.maxRate));
    }

    if (filters.minRating) {
      filtered = filtered.filter(b => b.rating >= parseFloat(filters.minRating));
    }

    if (filters.transportation && filters.transportation !== 'either') {
      filtered = filtered.filter(b =>
        b.transportation === filters.transportation || b.transportation === 'either'
      );
    }

    if (filters.maxDistance) {
      filtered = filtered.filter(b => (b as any).distance <= parseFloat(filters.maxDistance));
    }

    setFilteredBabysitters(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-peach-50 via-pink-50 to-peach-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-50 via-pink-50 to-peach-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Baby className="w-8 h-8 text-peach-500" />
            <h1 className="text-2xl font-bold text-peach-600">sitr</h1>
          </Link>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-peach-600 hover:text-peach-700 font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-peach-500 text-white rounded-lg hover:bg-peach-600 transition-colors font-medium"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/" className="text-peach-600 hover:text-peach-700 flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Browse Babysitters</h2>
          <p className="text-gray-600 flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            Showing babysitters near <span className="font-semibold">{userLocation}</span>
          </p>
        </div>

        {/* Notice for guests */}
        <div className="bg-peach-50 border border-peach-200 rounded-lg p-4 mb-6">
          <p className="text-gray-700">
            <span className="font-semibold">Sign up to book!</span> You can browse babysitters here,
            but you'll need to{' '}
            <Link href="/register?type=parent" className="text-peach-600 hover:text-peach-700 font-semibold underline">
              create an account
            </Link>{' '}
            to make a booking.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Filter Babysitters</h3>
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="City, State"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Distance</label>
              <select
                value={filters.maxDistance}
                onChange={(e) => setFilters({ ...filters, maxDistance: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="5">Within 5 miles</option>
                <option value="10">Within 10 miles</option>
                <option value="15">Within 15 miles</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Rate ($/hr)</label>
              <input
                type="number"
                placeholder="e.g., 25"
                value={filters.maxRate}
                onChange={(e) => setFilters({ ...filters, maxRate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transportation</label>
              <select
                value={filters.transportation}
                onChange={(e) => setFilters({ ...filters, transportation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="own_car">Has Own Car</option>
                <option value="uber">Needs Uber</option>
              </select>
            </div>
          </div>
          <button
            onClick={applyFilters}
            className="mt-4 px-6 py-2 bg-peach-500 text-white rounded-lg hover:bg-peach-600 transition-colors font-medium"
          >
            Apply Filters
          </button>
        </div>

        {/* Babysitters List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBabysitters.map((babysitter: any) => (
            <div key={babysitter.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{babysitter.name}</h3>
                  <div className="flex items-center gap-1 text-gray-600 text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    {babysitter.location}
                  </div>
                  <div className="flex items-center gap-1 text-peach-600 text-sm mt-1 font-semibold">
                    <Navigation className="w-4 h-4" />
                    {babysitter.distance} miles away
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                  <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                  <span className="font-semibold text-yellow-900">
                    {babysitter.rating > 0 ? babysitter.rating.toFixed(1) : 'New'}
                  </span>
                </div>
              </div>

              {babysitter.bio && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{babysitter.bio}</p>
              )}

              {babysitter.experience && (
                <p className="text-gray-600 text-sm mb-3">
                  <span className="font-medium">Experience:</span> {babysitter.experience}
                </p>
              )}

              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Car className="w-4 h-4" />
                  <span>
                    {babysitter.transportation === 'own_car'
                      ? 'Own car'
                      : babysitter.transportation === 'uber'
                      ? 'Needs Uber'
                      : 'Flexible'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-peach-600 font-semibold">
                  <DollarSign className="w-4 h-4" />
                  <span>{babysitter.hourlyRate}/hr</span>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                {babysitter.totalReviews} {babysitter.totalReviews === 1 ? 'review' : 'reviews'}
              </div>

              <Link
                href="/register?type=parent"
                className="block w-full py-2 bg-peach-500 text-white rounded-lg hover:bg-peach-600 transition-colors font-medium text-center"
              >
                Sign Up to Book
              </Link>
            </div>
          ))}
        </div>

        {filteredBabysitters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No babysitters found matching your criteria.</p>
            <button
              onClick={() => {
                setFilters({ location: '', maxRate: '', minRating: '', transportation: '', maxDistance: '' });
                setFilteredBabysitters(babysitters);
              }}
              className="mt-4 px-6 py-2 bg-peach-500 text-white rounded-lg hover:bg-peach-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
