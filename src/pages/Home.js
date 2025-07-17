import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-bg min-h-screen">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-content">
          <span className="navbar-title">Tango AI</span>
          </div>
          <div className="navbar-left">
            <Link to="/home" className="navbar-link">Home</Link>
            <Link to="/" className="navbar-link ml-4">FAQ</Link>
            <Link to="/" className="navbar-link ml-4">Logout</Link>
          
        </div>
      </nav>
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="compare-card" onClick={() => navigate('/compare')}>
          <h2 className="compare-card-title">Start Comparing</h2>
          <p className="compare-card-desc">Upload two documents and instantly see the differences.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
