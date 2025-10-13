import { Link, Outlet } from 'react-router-dom';
import { Home, LayoutGrid, Trophy, Map, User } from 'lucide-react';

export default function RootLayout() {
  // 1. Determine the portal type from environment variables
  const portalType = process.env.REACT_APP_PORTAL_TYPE;

  let navigationItems = [];

  // 2. Conditionally build the navigation array
  if (portalType === 'parent') {
    // --- PARENT PORTAL NAVIGATION ---
    navigationItems = [
      { title: 'Home', url: '/' },
      { title: 'Parent Dashboard', url: '/parent-dashboard' },
      { title: 'Profile', url: '/profile' },
    ];
  } else {
    // --- STUDENT PORTAL NAVIGATION (DEFAULT) ---
    navigationItems = [
      { title: 'Home', url: '/' },
      { title: 'Student Dashboard', url: '/student-dashboard' },
      { title: 'Achievements', url: '/achievements' },
      { title: 'Quest Map', url: '/quest-map' },
      { title: 'Profile', url: '/profile' },
    ];
  }

  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
        {/* 3. Map over the correct array to render links dynamically */}
        {navigationItems.map((item) => (
          <Link key={item.title} to={item.url}>
            {item.title}
          </Link>
        ))}
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}