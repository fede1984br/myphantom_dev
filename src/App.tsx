import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import all your page components
import RootLayout from './components/RootLayout';
import Dashboard from './Pages/Dashboard';
import Achievements from './Pages/Achievements';
import PhantomChat from './Pages/PhantomChat';
import QuestDetail from './Pages/QuestDetail';
import QuestMap from './Pages/QuestMap';
import StudentDashboard from './Pages/StudentDashboard';
import StudentProfile from './Pages/StudentProfile';
import WeeklySummaries from './Pages/WeeklySummaries';

function App() {
  // Read the environment variable set during the build process
  const portalType = process.env.REACT_APP_PORTAL_TYPE;

  // --- Render the Parent Portal ---
  if (portalType === 'parent') {
    return (
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* Parent Dashboard is the home page */}
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="weekly-summaries" element={<WeeklySummaries />} />
        </Route>
      </Routes>
    );
  }

  // --- Render the Student Portal ---
  if (portalType === 'student') {
    return (
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* Student Dashboard is the home page */}
          <Route index element={<StudentDashboard />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="phantom-chat" element={<PhantomChat />} />
          <Route path="quest-detail" element={<QuestDetail />} />
          <Route path="quest-map" element={<QuestMap />} />
          <Route path="student-profile" element={<StudentProfile />} />
        </Route>
      </Routes>
    );
  }

  // --- Render the Landing Page by default ---
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<h1>Welcome to My Phantom AI</h1>} />
      </Route>
    </Routes>
  );
}

export default App;