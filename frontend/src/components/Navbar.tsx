'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || 'Account';
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || 'BR';

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
            {isLoading ? (
              <li>
                <span className="navbar-user">Loading...</span>
              </li>
            ) : isAuthenticated ? (
              <>
                <li>
                  <Link href="/dashboard" className="navbar-link">Dashboard</Link>
                </li>
                <li>
                  <Link href="/dashboard/profile" className="navbar-link">Profile</Link>
                </li>
                <li>
                  <div className="navbar-user-block">
                    {user?.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={displayName}
                        className="navbar-avatar-image"
                        width={70}
                        height={70}
                        unoptimized
                      />
                    ) : (
                      <span className="navbar-avatar-fallback">{initials}</span>
                    )}
                    <div className="navbar-user-meta">
                      <span className="navbar-user">{displayName}</span>
                      <span className="navbar-user-email">{user?.email}</span>
                    </div>
                  </div>
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
