'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const { resetPassword, error } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLocalError(null);
    setMessage(null);

    if (!token) {
      setLocalError('Reset token is missing from URL');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resetPassword(token, password);
      setMessage(response.message);
      setTimeout(() => router.push('/auth/login'), 1200);
    } catch {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-wrap page-shell">
      <div className="card">
        <h1 className="card-title">Reset Password</h1>
        <p className="muted" style={{ marginBottom: '1rem' }}>
          Enter your new password.
        </p>

        {message && <div className="success-message">{message}</div>}
        {localError && <div className="error-message">{localError}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              minLength={6}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="muted" style={{ marginTop: '1rem', textAlign: 'center' }}>
          Back to <Link href="/auth/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="loading"><div className="spinner"></div></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
