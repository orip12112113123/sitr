'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Users, UserCheck, Baby, Calendar, Star, TrendingUp, MessageSquare } from 'lucide-react';

interface AnalyticsSummary {
  totalUsers: number;
  totalParents: number;
  totalBabysitters: number;
  totalBookings: number;
  totalReviews: number;
  totalPageViews: number;
  pageViewsLast24h: number;
  pageViewsLast7d: number;
  registrationsLast24h: number;
  registrationsLast7d: number;
  bookingsLast24h: number;
  bookingsLast7d: number;
}

interface Feedback {
  id: string;
  rating?: number;
  comment: string;
  type: 'rating' | 'problem';
  timestamp: string;
  userEmail?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin (simple check - in production use proper auth)
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      // Check if user email is admin (you can customize this)
      if (userData.email === 'admin@sitr.com' || userData.type === 'admin') {
        setIsAdmin(true);
        fetchAnalytics();
        fetchFeedbacks();
      } else {
        router.push('/');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/feedback');
      const data = await response.json();
      setFeedbacks(data.feedbacks || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  if (!isAdmin || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-peach-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const stats = [
    { label: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'blue' },
    { label: 'Parents', value: analytics.totalParents, icon: UserCheck, color: 'green' },
    { label: 'Babysitters', value: analytics.totalBabysitters, icon: Baby, color: 'purple' },
    { label: 'Total Bookings', value: analytics.totalBookings, icon: Calendar, color: 'orange' },
    { label: 'Total Reviews', value: analytics.totalReviews, icon: Star, color: 'yellow' },
    { label: 'Page Views', value: analytics.totalPageViews, icon: TrendingUp, color: 'pink' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <BarChart3 className="w-10 h-10 text-pink-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Sitr Platform Analytics & Insights</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-12 h-12 text-${stat.color}-500`} />
              </div>
            </div>
          ))}
        </div>

        {/* Activity Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Last 24 Hours */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Last 24 Hours</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Page Views</span>
                <span className="font-bold text-blue-600">{analytics.pageViewsLast24h}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">New Registrations</span>
                <span className="font-bold text-green-600">{analytics.registrationsLast24h}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700">New Bookings</span>
                <span className="font-bold text-orange-600">{analytics.bookingsLast24h}</span>
              </div>
            </div>
          </div>

          {/* Last 7 Days */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Last 7 Days</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Page Views</span>
                <span className="font-bold text-blue-600">{analytics.pageViewsLast7d}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">New Registrations</span>
                <span className="font-bold text-green-600">{analytics.registrationsLast7d}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700">New Bookings</span>
                <span className="font-bold text-orange-600">{analytics.bookingsLast7d}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-pink-600" />
            Recent Feedback
          </h2>
          <div className="space-y-4">
            {feedbacks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No feedback yet</p>
            ) : (
              feedbacks.slice(0, 10).map((feedback) => (
                <div
                  key={feedback.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-pink-300 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {feedback.type === 'rating' && feedback.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < feedback.rating!
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <span className={`px-2 py-1 rounded text-xs ${
                        feedback.type === 'rating'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {feedback.type === 'rating' ? 'Rating' : 'Problem Report'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(feedback.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{feedback.comment}</p>
                  {feedback.userEmail && (
                    <p className="text-xs text-gray-500 mt-2">From: {feedback.userEmail}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
