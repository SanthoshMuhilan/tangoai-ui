import React, { useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CognizantIcon from '../Icons/CognizantIcon.svg';
import PaperIcon from '../Icons/paper_2.jpg';
import HistoryIcon from '../Icons/History.jpg';
import ChatIcon from '../Icons/DocumentComparisonIcon.jpg';

function Home() {
  const navigate = useNavigate();
  const firstCardRef = useRef(null);
  const lastCardRef = useRef(null);
  const cardsContainerRef = useRef(null);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center">
      <nav className="navbar w-full">
        <div className="navbar-content">
          <div className="navbar-brand flex items-center gap-2" style={{ alignItems: 'center' }}>
            <img src={CognizantIcon} alt="Cognizant" style={{ width: 32, height: 32, display: 'inline-block', verticalAlign: 'middle' }} />
            <span className="navbar-title" style={{ display: 'inline-block', verticalAlign: 'middle', lineHeight: '32px' }}>Tango AI</span>
          </div>
        </div>
        <div className="navbar-left">
          <Link to="/home" className="navbar-link">Home</Link>
          <Link to="/" className="navbar-link ml-4">FAQ</Link>
          <Link to="/" className="navbar-link ml-4">Logout</Link>
        </div>
      </nav>
      <div
        style={{
          background: 'rgba(248, 247, 255, 0.55)', // semi-transparent
          border: '1px solid #bdbdfc',
          borderRadius: 18,
          padding: '22px 30px',
          margin: '0 auto 36px auto',
          maxWidth: 1200,
          width: '100%',
          color: '#3A294F',
          fontSize: '1.08rem',
          boxShadow: '0 8px 32px rgba(44,62,80,0.12)',
          textAlign: 'left',
          backdropFilter: 'blur(12px)', // glass effect
          WebkitBackdropFilter: 'blur(12px)', // Safari support
        }}
      >
        <div style={{ marginTop: 10 }}>
          Document comparison and analysis platform designed to help users quickly identify differences between documents, maintain a history of comparisons, and interact with an AI assistant for instant insights. 
          <li>Upload two documents to compare their content.</li>
          <li>View a history of past comparisons for quick access.</li>   
        </div>
      </div>
      {/* Main Content as horizontal cards */}
      <div
        ref={cardsContainerRef}
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap', // Ensure horizontal scroll
          gap: 12,
          overflowX: 'auto',
          padding: '20px 0',
          justifyContent: 'center',
          width: '100%',
          scrollbarWidth: 'thin',
        }}
      >
        <div className="compare-card" ref={firstCardRef} onClick={() => navigate('/compare')}>
          <div className="slide1">
            <div className="slide1-title">Compare Documents</div>
            <div className="icon">
              <img
                src={PaperIcon}
                alt="Compare Documents"
                className="compare-card-image"
                style={{ width: '48px', height: '48px', objectFit: 'contain', display: 'block', margin: '10px auto' }}
              />
            </div>
          </div>
          <div className="slide2">
            <h2 className="compare-card-title">Start Comparing</h2>
            <p className="compare-card-desc">Upload two documents and instantly see the differences.</p>
          </div>
        </div>
        <div className="compare-card">
          <div className="slide1">
            <div className="slide1-title">Document History</div>
            <div className="icon">
              <img
                src={HistoryIcon}
                alt="Document History"
                className="compare-card-image"
                style={{ width: '48px', height: '48px', objectFit: 'contain', display: 'block', margin: '10px auto' }}
              />
            </div>
          </div>
          <div className="slide2">
            <h2 className="compare-card-title">Document History</h2>
            <p className="compare-card-desc">View your recent document comparison history for quick access.</p>
          </div>
        </div>
        <div className="compare-card">
          <div className="slide1">
            <div className="slide1-title">AI Chat</div>
            <div className="icon">
              <img
                src={ChatIcon}
                alt="AI Chat"
                className="compare-card-image"
                style={{ width: '48px', height: '48px', objectFit: 'contain', display: 'block', margin: '10px auto' }}
              />
            </div>
          </div>
          <div className="slide2">
            <h2 className="compare-card-title">AI Chat Assistant</h2>
            <p className="compare-card-desc">Get instant help and insights about your documents with our AI chatbot.</p>
          </div>
        </div>
        {/* New Card - Example */}
        <div className="compare-card" ref={lastCardRef}>
          <div className="slide1">
            <div className="slide1-title">Coming Soon</div>
          </div>
          <div className="slide2">
            <h2 className="compare-card-title">Smart Suggestions</h2>
            <p className="compare-card-desc">Get smart tips and recommendations for your document workflow.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
