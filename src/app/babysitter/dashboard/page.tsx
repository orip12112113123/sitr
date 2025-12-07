'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Baby, LogOut, Calendar, DollarSign, Star, MapPin, Car, User } from 'lucide-react';
import { Booking } from '@/lib/types';

export default function BabysitterDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    if (userData.type !== 'babysitter') {
      router.push('/parent/dashboard');
      return;
    }
    setUser(userData);
    fetchProfile(userData.id);
    fetchBookings(userData.id);
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const response = await fetch('/api/babysitters');
      const data = await response.json();
      const myProfile = data.babysitters.find((b: any) => b.id === userId);
      setProfile(myProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (userId: string) => {
    try {
      const response = await fetch(`/api/bookings?babysitterId=${userId}`);
      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
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
            <Baby className="w-8 h-8 text-pink-500" />
            <h1 className="text-2xl font-bold text-pink-600">sitr</h1>
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
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Babysitter Dashboard</h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'bookings'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Bookings ({bookings.length})
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && profile && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{profile.name}</h3>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {profile.age} years old
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                <span className="text-xl font-semibold text-yellow-900">
                  {profile.rating > 0 ? profile.rating.toFixed(1) : 'New'}
                </span>
                <span className="text-sm text-gray-600">
                  ({profile.totalReviews} {profile.totalReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-3">Contact Information</h4>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-medium">Email:</span> {profile.email}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {profile.phone}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3">Service Details</h4>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-pink-600" />
                    <span className="font-semibold text-pink-600 text-xl">
                      ${profile.hourlyRate}/hour
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    <span>
                      {profile.transportation === 'own_car'
                        ? 'I have my own car'
                        : profile.transportation === 'uber'
                        ? 'I need Uber/transportation'
                        : 'Flexible transportation'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {profile.bio && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">About Me</h4>
                <p className="text-gray-700">{profile.bio}</p>
              </div>
            )}

            {profile.experience && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Experience</h4>
                <p className="text-gray-700">{profile.experience}</p>
              </div>
            )}

            <div className="mt-6 p-4 bg-pink-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Profile Status:</span> Active and visible to parents
              </p>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings Yet</h3>
                <p className="text-gray-600">
                  You'll see booking requests from parents here once they start coming in.
                </p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-pink-600" />
                        <span className="font-semibold text-lg">
                          {new Date(booking.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">
                        Duration: {booking.hours} {booking.hours === 1 ? 'hour' : 'hours'}
                      </p>
                      <p className="text-gray-600">Parent ID: {booking.parentId}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-pink-600 mb-1">
                        ${booking.totalAmount.toFixed(2)}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
