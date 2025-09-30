import { Link, Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Parent Dashboard</Link>
        <Link to="/student-dashboard">Student Dashboard</Link>
        <Link to="/achievements">Achievements</Link>
        <Link to="/quest-map">Quest Map</Link>
        <Link to="/student-profile">Profile</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}