// frontend/src/components/Navigation.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="dashboard-nav">
      <Link 
        href="/"
        className={`nav-button ${pathname === '/' ? 'active' : ''}`}
      >
        Dashboard
      </Link>
      <Link 
        href="/services"
        className={`nav-button ${pathname === '/services' ? 'active' : ''}`}
      >
        Services
      </Link>
      <Link 
        href="/deployments" 
        className={`nav-button ${pathname === '/deployments' ? 'active' : ''}`}
      >
        Deployments
      </Link>
      <Link 
        href="/settings"
        className={`nav-button ${pathname === '/settings' ? 'active' : ''}`}
      >
        Settings
      </Link>
    </nav>
  );
}