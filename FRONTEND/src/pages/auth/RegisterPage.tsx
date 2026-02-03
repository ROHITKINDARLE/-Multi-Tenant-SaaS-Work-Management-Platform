// auth/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button, Input } from '@components/ui/BaseComponents';
import { useAuthStore } from '@stores/authStore';

export const RegisterPage: React.FC = () => {
  const [organizationName, setOrganizationName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      await register(
        organizationName,
        formData.name,
        formData.email,
        formData.password
      );
      navigate('/dashboard');
    } catch {
      // error handled in store
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 grid grid-cols-1 md:grid-cols-2">
      {/* Left Side - Branding */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 to-purple-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse-slow" />
          <div
            className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl animate-pulse-slow"
            style={{ animationDelay: '1s' }}
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Zap size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">DOPS</h1>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Join thousands of teams using DOPS to deliver projects on time.
          </p>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex flex-col justify-center p-8 md:p-12">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-slate-400">
              Join DOPS and start managing work better
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Organization Name"
              type="text"
              placeholder="Your Company / Team"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
            />

            <Input
              label="Full Name"
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              icon={<User size={18} />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              icon={<Mail size={18} />}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              icon={<Lock size={18} />}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={<Lock size={18} />}
              required
            />

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
              variant="primary"
              className="w-full"
            >
              Create Account
              <ArrowRight size={18} />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
