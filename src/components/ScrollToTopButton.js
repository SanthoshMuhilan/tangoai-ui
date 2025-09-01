import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          padding: '10px 15px',
          fontSize: '16px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        ↑ Top
      </button>
    )
  );
};

function ScrollableContent() {
  return (
    <div
      style={{
        height: '300px',
        overflowY: 'scroll',
        border: '1px solid #ccc',
        borderRadius: 10,
        background: 'rgba(248, 247, 255, 0.55)',
        boxShadow: '0 2px 12px rgba(44,62,80,0.08)',
        padding: '18px 24px',
        margin: '24px auto',
        maxWidth: 700,
        width: '100%',
        color: '#3A294F',
        fontSize: '1.08rem',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
    </div>
  );
}

export default function ComparePage() {
  return (
    <div>
      <ScrollableContent />
      <ScrollToTopButton />
    </div>
  );
}
