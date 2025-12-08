'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Upload } from 'lucide-react';

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultType = searchParams.get('type') as 'parent' | 'babysitter' || 'parent';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    type: defaultType,
    name: '',
    age: '',
    phone: '',
    location: '',
    preferredTransportation: 'either' as 'own_car' | 'uber' | 'either',
    hourlyRate: '',
    bio: '',
    experience: '',
    transportation: 'either' as 'own_car' | 'uber' | 'either',
  });

  const [idPhoto, setIdPhoto] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (parseInt(formData.age) < 16) {
      setError('You must be at least 16 years old to register');
      return;
    }

    if (!idPhoto) {
      setError('Please upload your ID photo');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
          idPhotoUrl: idPhoto,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push(formData.type === 'parent' ? '/parent/dashboard' : '/babysitter/dashboard');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Create Account</h2>
        <p className="text-center text-gray-600 mb-6">
          Join Sitr as a {formData.type === 'parent' ? 'Parent' : 'Babysitter'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a
            </label>
            <div className="flex gap-4">
              <label className="flex-1">
                <input
                  type="radio"
                  name="type"
                  value="parent"
                  checked={formData.type === 'parent'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'parent' })}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg cursor-pointer text-center ${
                  formData.type === 'parent' ? 'border-peach-500 bg-peach-50' : 'border-gray-200'
                }`}>
                  <span className="font-semibold">Parent</span>
                </div>
              </label>
              <label className="flex-1">
                <input
                  type="radio"
                  name="type"
                  value="babysitter"
                  checked={formData.type === 'babysitter'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'babysitter' })}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg cursor-pointer text-center ${
                  formData.type === 'babysitter' ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
                }`}>
                  <span className="font-semibold">Babysitter</span>
                </div>
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age (16+ required)
              </label>
              <input
                type="number"
                required
                min="16"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              required
              placeholder="City, State"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
            />
          </div>

          {/* Transportation */}
          {formData.type === 'parent' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Transportation
              </label>
              <select
                value={formData.preferredTransportation}
                onChange={(e) => setFormData({ ...formData, preferredTransportation: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
              >
                <option value="either">Either (own car or Uber)</option>
                <option value="own_car">Babysitter with own car</option>
                <option value="uber">Will provide Uber</option>
              </select>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Transportation
                </label>
                <select
                  value={formData.transportation}
                  onChange={(e) => setFormData({ ...formData, transportation: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
                >
                  <option value="either">Flexible (own car or Uber)</option>
                  <option value="own_car">I have my own car</option>
                  <option value="uber">I need Uber/transportation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  step="0.50"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell parents about yourself..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience
                </label>
                <textarea
                  rows={2}
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="e.g., 3 years of babysitting experience with ages 2-10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peach-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          {/* ID Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload ID Photo (Required - Must be 16+)
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                {idPhoto ? (
                  <div>
                    <img src={idPhoto} alt="ID" className="mx-auto h-32 w-auto mb-2" />
                    <button
                      type="button"
                      onClick={() => setIdPhoto('')}
                      className="text-sm text-peach-600 hover:text-peach-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-peach-600 hover:text-peach-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="sr-only"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
              formData.type === 'parent'
                ? 'bg-peach-500 hover:bg-peach-600'
                : 'bg-pink-500 hover:bg-pink-600'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-peach-600 hover:text-peach-700 font-medium">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
