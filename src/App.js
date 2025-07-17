import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ComparePage from './pages/ComparePage';
import LoginPage from './pages/LoginPage';
import RegistrationLogin from './pages/RegistrationLogin'; // Import RegistrationLogin
import Home from './pages/Home'; // Import Home component
import Notification from './pages/Notification'; // Import Notification component
import HistoryPage from './pages/HistoryPage';
import './App.css'; // Import your CSS file
function App() {
  return (
    <Router>
      <div className="Background flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-6xl w-full mx-auto px-4">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/Home" element={<Home />} /> {/* Set Home as the starter page */}
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/register" element={<RegistrationLogin />} /> {/* Add this line */}
              <Route path="/notification" element={<Notification />} />
              <Route path="/history" element={<HistoryPage  />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
