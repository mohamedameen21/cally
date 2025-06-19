import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Frontend validation
    const newErrors: Record<string, string> = {};
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
      await resetPassword(email, password, passwordConfirmation, token);
      navigate('/login', { state: { message: 'Password has been reset successfully. You can now login with your new password.' } });
    } catch (error: any) {
      const responseErrors = error.response?.data?.errors;
      if (responseErrors) {
        setErrors(responseErrors);
      } else {
        setErrors({ general: error.response?.data?.message || 'Failed to reset password' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token || !email) {
    return (
      <MainLayout>
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">Invalid reset link</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The password reset link is invalid or has expired.
              </p>
              <div className="mt-4">
                <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/90">
                  Request a new password reset link
                </Link>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground">Reset your password</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          {errors.general && (
            <div className="rounded-md bg-destructive/15 p-4">
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="email" value={email} />

            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                  New Password
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
                  placeholder="New Password"
                />
                {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-foreground mb-1">
                  Confirm New Password
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
                  placeholder="Confirm New Password"
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
                {isSubmitting ? 'Resetting password...' : 'Reset password'}
              </Button>
            </div>

            <div className="text-center">
              <Link to="/login" className="font-medium text-primary hover:text-primary/90">
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};