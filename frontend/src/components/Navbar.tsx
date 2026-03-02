'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Account';

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link href="/" className="navbar-brand">
            Blog Rival
          </Link>
          <ul className="navbar-menu">
            <li>
              <Link href="/feed" className="navbar-link">Feed</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link href="/dashboard" className="navbar-link">Dashboard</Link>
                </li>
                <li>
                  <Link href="/dashboard/profile" className="navbar-link">Profile</Link>
                </li>
                <li>
                  <span className="navbar-user">{displayName}</span>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-secondary">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/auth/login" className="navbar-link">Login</Link>
                </li>
                <li>
                  <Link href="/auth/register" className="btn btn-primary">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
