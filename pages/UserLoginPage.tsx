
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import { LOGO_TEXT } from '../constants';

const UserLoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error: authError } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!identifier || !password) {
      setFormError('Please enter both identifier and password.');
      return;
    }
    try {
      await login({ identifier, password });
    } catch (err: any) {
      setFormError(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-black">{LOGO_TEXT}</h2>
          <p className="mt-2 text-center text-md text-gray-600">
            Sign in to continue
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg border">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {(authError || formError) && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md text-center">{authError || formError}</p>}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded-r-lg">
                <p className="text-sm text-blue-800">
                    <strong>Test User Credentials:</strong><br />
                    Identifier: <code>user</code> or <code>user@example.com</code><br />
                    Password: <code>password123</code>
                </p>
            </div>
            <FormField
              label="Identifier"
              name="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username"
              placeholder="Enter your username or email"
            />
            <FormField
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between text-sm">
              <div/>
              <a href="#" className="font-medium text-black hover:underline">
                Forgot your password?
              </a>
            </div>

            <div>
              <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                Sign In
              </Button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            New here?{' '}
            <Link to="/register" className="font-medium text-black hover:underline">
              Register here
            </Link>
          </p>
           <p className="mt-2 text-center text-sm text-gray-600">
            Are you an Admin?{' '}
            <Link to="/admin/login" className="font-medium text-black hover:underline">
              Login as Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
