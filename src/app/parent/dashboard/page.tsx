'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Baby, LogOut, MapPin, Car, DollarSign, Star, Search, Filter, Navigation } from 'lucide-react';
import { BabysitterProfile } from '@/lib/types';

export default function ParentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [babysitters, setBabysitters] = useState<BabysitterProfile[]>([]);
  const [filteredBabysitters, setFilteredBabysitters] = useState<BabysitterProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBabysitter, setSelectedBabysitter] = useState<BabysitterProfile | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [filters, setFilters] = useState({
    location: '',
    maxRate: '',
    minRating: '',
    transportation: 'uber', // Default to Uber - prioritize sitters who need rides
    maxDistance: '10', // Default to 10 miles
  });

  const [bookingForm, setBookingForm] = useState({
    date: '',
    hours: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    if (userData.type !== 'parent') {
      router.push('/babysitter/dashboard');
      return;
    }
    setUser(userData);
    fetchBabysitters();
  }, []);

  // Apply default filters when babysitters are loaded
  useEffect(() => {
    if (babysitters.length > 0) {
      applyFilters();
    }
  }, [babysitters]);

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

  const handleBooking = async () => {
    if (!selectedBabysitter || !bookingForm.date || !bookingForm.hours) {
      alert('Please fill in all booking details');
      return;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentId: user.id,
          babysitterId: selectedBabysitter.id,
          date: bookingForm.date,
          hours: parseFloat(bookingForm.hours),
        }),
      });

      if (response.ok) {
        alert('Booking request sent successfully!');
        setShowBookingModal(false);
        setBookingForm({ date: '', hours: '' });
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
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
          <div className="flex items-center gap-2">
            <Baby className="w-8 h-8 text-peach-500" />
            <h1 className="text-2xl font-bold text-peach-600">sitr</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Find a Babysitter</h2>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-peach-500" />
            <h3 className="text-lg font-semibold">Filters</h3>
          </div>
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

              <button
                onClick={() => {
                  setSelectedBabysitter(babysitter);
                  setShowBookingModal(true);
                }}
                className="w-full py-2 bg-peach-500 text-white rounded-lg hover:bg-peach-600 transition-colors font-medium"
              >
                Book Now
              </button>
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

      {/* Booking Modal */}
      {showBookingModal && selectedBabysitter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4">Book {selectedBabysitter.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={bookingForm.hours}
                  onChange={(e) => setBookingForm({ ...bookingForm, hours: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
                />
              </div>
              {bookingForm.hours && (
                <div className="bg-peach-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Cost</p>
                  <p className="text-2xl font-bold text-peach-600">
                    ${(selectedBabysitter.hourlyRate * parseFloat(bookingForm.hours)).toFixed(2)}
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleBooking}
                  className="flex-1 py-2 bg-peach-500 text-white rounded-lg hover:bg-peach-600 transition-colors font-medium"
                >
                  Confirm Booking
                </button>
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingForm({ date: '', hours: '' });
                  }}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
