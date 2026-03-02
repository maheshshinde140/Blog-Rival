'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function ForgotPasswordPage() {
  const { requestPasswordReset, error } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setResetLink(null);

    try {
      const response = await requestPasswordReset(email);
      setMessage(response.message);
      if (process.env.NODE_ENV !== 'production' && response.resetToken) {
        setResetLink(`/auth/reset-password?token=${response.resetToken}`);
      }
    } catch {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-wrap page-shell">
      <div className="card">
        <h1 className="card-title">Forgot Password</h1>
        <p className="muted" style={{ marginBottom: '1rem' }}>
          Enter your account email and generate a password reset link.
        </p>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={isSubmitting} style={{ width: '100%' }}>
            {isSubmitting ? 'Generating...' : 'Generate Reset Link'}
          </button>
        </form>

        {resetLink && (
          <p style={{ marginTop: '1rem' }}>
            Reset link (dev mode): <Link href={resetLink}>Set new password</Link>
          </p>
        )}

        <p className="muted" style={{ marginTop: '1rem', textAlign: 'center' }}>
          Back to <Link href="/auth/login">Login</Link>
        </p>
      </div>
    </section>
  );
}
