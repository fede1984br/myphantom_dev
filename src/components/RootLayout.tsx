import { Link, Outlet } from 'react-router-dom';
import { Home, LayoutGrid, Trophy, Map, User } from 'lucide-react';

interface NavigationItem {
  title: string;
  url: string;
}

export default function RootLayout() {
  const portalType = process.env.REACT_APP_PORTAL_TYPE;

  let navigationItems: NavigationItem[] = [];

  if (portalType === 'parent') {
    navigationItems = [
      { title: 'Parent Dashboard', url: '/' },
      { title: 'Profile', url: '/profile' },
      { title: 'Weekly Summaries', url: '/weekly-summaries' },
    ];
  } else if (portalType === 'student') {
    navigationItems = [
      { title: 'Student Dashboard', url: '/' },
      { title: 'Quest Map', url: '/quest-map' },
      { title: 'Achievements', url: '/achievements' },
      { title: 'Profile', url: '/student-profile' },
    ];
  }

  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
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