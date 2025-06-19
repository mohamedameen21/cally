import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Frontend validation
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = 'Name is required';
    if (!username) newErrors.username = 'Username is required';
    if (username && !/^[a-zA-Z0-9_-]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (password !== passwordConfirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name, username, email, password, passwordConfirmation);
      navigate('/');
    } catch (error: any) {
      const responseErrors = error.response?.data?.errors;
      if (responseErrors) {
        setErrors(responseErrors);
      } else {
        setErrors({ general: error.response?.data?.message || 'Registration failed' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">Create your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/90">
                Sign in
              </Link>
            </p>
          </div>

          {errors.general && (
            <div className="rounded-md bg-destructive/15 p-4">
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="relative block w-full rounded-md border-0 py-2 px-3 text-foreground bg-background shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  placeholder="Full Name"
                />
                {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="relative block w-full rounded-md border-0 py-2 px-3 text-foreground bg-background shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  placeholder="Username"
                />
                {errors.username && <p className="mt-1 text-sm text-destructive">{errors.username}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full rounded-md border-0 py-2 px-3 text-foreground bg-background shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  placeholder="Email address"
                />
                {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full rounded-md border-0 py-2 px-3 text-foreground bg-background shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  placeholder="Password"
                />
                {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-foreground mb-1">
                  Confirm Password
                </label>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="relative block w-full rounded-md border-0 py-2 px-3 text-foreground bg-background shadow-sm ring-1 ring-inset ring-input placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                  placeholder="Confirm Password"
                />
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-destructive">{errors.password_confirmation}</p>
                )}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="font-medium text-primary hover:text-primary/90">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="font-medium text-primary hover:text-primary/90">
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};