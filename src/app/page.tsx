import Link from 'next/link';
import { Baby, Heart, Shield, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-50 via-pink-50 to-peach-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Baby className="w-8 h-8 text-peach-500" />
            <h1 className="text-2xl font-bold text-peach-600">sitr</h1>
          </div>
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

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Find the Perfect Babysitter
            <span className="text-peach-500"> Anytime, Anywhere</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with trusted, verified babysitters in your area. Safe, reliable, and easy to use.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register?type=parent"
              className="px-8 py-4 bg-peach-500 text-white rounded-lg hover:bg-peach-600 transition-colors font-semibold text-lg"
            >
              I Need a Babysitter
            </Link>
            <Link
              href="/register?type=babysitter"
              className="px-8 py-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-semibold text-lg"
            >
              I'm a Babysitter
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-peach-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified & Safe</h3>
            <p className="text-gray-600">
              All babysitters are verified with ID and must be 16 years or older
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Rated & Reviewed</h3>
            <p className="text-gray-600">
              See ratings and reviews from other parents to make informed decisions
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="w-16 h-16 bg-peach-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-peach-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-600">
              Find, book, and manage babysitters all in one convenient platform
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-peach-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Sign Up</h4>
              <p className="text-gray-600 text-sm">Create your account as a parent or babysitter</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-peach-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Set Preferences</h4>
              <p className="text-gray-600 text-sm">Add your location and transportation preferences</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-peach-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Browse & Book</h4>
              <p className="text-gray-600 text-sm">Find babysitters by rate, rating, and availability</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-peach-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h4 className="font-semibold mb-2">Rate & Review</h4>
              <p className="text-gray-600 text-sm">Share your experience to help other parents</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-20 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 Sitr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
