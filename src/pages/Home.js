import React, { useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CognizantIcon from '../Icons/CognizantIcon.svg';

function Home() {
  const navigate = useNavigate();
  const firstCardRef = useRef(null);
  const lastCardRef = useRef(null);
  const cardsContainerRef = useRef(null);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to last card on hover
  const handleCardMouseEnter = () => {
    if (lastCardRef.current && cardsContainerRef.current) {
      lastCardRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'end',
        block: 'nearest',
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col items-center"
      style={{ overflowY: 'auto', height: '100vh' }}
    >
      <nav
        className="navbar w-full"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1100,
          background: '#000048',
          boxShadow: '0 2px 12px rgba(44,62,80,0.08)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
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
      {/* Add top padding so content is not hidden behind fixed nav */}
      <div style={{ paddingTop: 80, width: '100%' }}>
        {/* Welcome message centered at the top */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'rgb(22, 17, 28)',
              borderRadius: 1,
              padding: '6px 6px',
              textAlign: 'center',
              letterSpacing: '0.5px',
            }}
          >
            Welcome to Tango AI!
          </h2>
        </div>
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
          <div style={{ marginTop: 10, textAlign: 'center' }}>
            <b>Tango AI is an integrated platform for applied Artificial Intelligence!!!</b>
</div>
            <ul style={{ marginTop: 10, paddingLeft: 20, listStyleType: 'disc', lineHeight: 1.5 }}>
              <p>Tango AI provides a suite of AI and Machine Learning–driven use cases that enable users to harness intelligent solutions with ease. The platform offers interactive widgets that guide you to capabilities such as document comparison, predictive modeling, and exploratory AI applications, with more features being added continuously. Each section is designed to demonstrate how advanced AI techniques can drive efficiency, accuracy, and innovation in real-world scenarios.</p>
              <div style={{ marginTop: 10 }} />
              <p>As the platform expands, Tango AI will serve as a comprehensive hub for exploring practical AI applications across diverse domains.</p>
            </ul>

          </div>
        
        {/* Main Content as horizontal cards with horizontal scroll */}
        <div
          ref={cardsContainerRef}
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            gap: 12,
            overflowX: 'auto',
            overflowY: 'hidden',
            padding: '20px 0',
            justifyContent: 'center',
            width: '100%',
            scrollbarWidth: 'thin',
            maxWidth: '100vw',
          }}
        >
          <div
            className="compare-card"
            ref={firstCardRef}
            onClick={() => navigate('/compare')}
            onMouseEnter={handleCardMouseEnter}
          >
            <div className="slide1">
              <div className="slide1-title">Compare Documents</div>
            </div>
            <div className="slide2">
              <h2 className="compare-card-title">Start Comparing</h2>
              <p className="compare-card-desc">Upload two documents and instantly see the differences.</p>
            </div>
          </div>
          <div className="compare-card" onMouseEnter={handleCardMouseEnter}>
            <div className="slide1">
              <div className="slide1-title">Document History</div>
            </div>
            <div className="slide2">
              <h2 className="compare-card-title">Document History</h2>
              <p className="compare-card-desc">View your recent document comparison history for quick access.</p>
            </div>
          </div>
          <div className="compare-card" onMouseEnter={handleCardMouseEnter}>
            <div className="slide1">
              <div className="slide1-title">AI Chat</div>
            </div>
            <div className="slide2">
              <h2 className="compare-card-title">AI Chat Assistant</h2>
              <p className="compare-card-desc">Get instant help and insights about your documents with our AI chatbot.</p>
            </div>
          </div>
          {/* New Card - Example */}
          <div className="compare-card" ref={lastCardRef} onMouseEnter={handleCardMouseEnter}>
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
    </div>
  );
}

export default Home;
