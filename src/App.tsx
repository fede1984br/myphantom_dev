import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from './components/RootLayout';

// Import all the page components you've been working on
import Dashboard from './Pages/Dashboard';
import Achievements from './Pages/Achievements';
import PhantomChat from './Pages/PhantomChat';
import QuestDetail from './Pages/QuestDetail';
import QuestMap from './Pages/QuestMap';
import StudentDashboard from './Pages/StudentDashboard';
import StudentProfile from './Pages/StudentProfile';
import WeeklySummaries from './Pages/WeeklySummaries';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        {/* Home Page */}
        <Route index element={<h1>Welcome to My Phantom AI</h1>} />
        
        {/* All other pages are children of RootLayout */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="student-dashboard" element={<StudentDashboard />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="phantom-chat" element={<PhantomChat />} />
        <Route path="quest-detail" element={<QuestDetail />} />
        <Route path="quest-map" element={<QuestMap />} />
        <Route path="student-profile" element={<StudentProfile />} />
        <Route path="weekly-summaries" element={<WeeklySummaries />} />
      </Route>
    </Routes>
  );
}

export default App;