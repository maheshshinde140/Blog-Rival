'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch {
      // Error handled by hook
    }
  };

  return (
    <section className="auth-wrap page-shell">
      <div className="card">
        <h1 className="card-title">Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop: '0.85rem', textAlign: 'center' }}>
          <Link href="/auth/forgot-password">Forgot password?</Link>
        </p>
        <p className="muted" style={{ marginTop: '1rem', textAlign: 'center' }}>
          Do not have an account? <Link href="/auth/register">Create one</Link>
        </p>
      </div>
    </section>
  );
}
