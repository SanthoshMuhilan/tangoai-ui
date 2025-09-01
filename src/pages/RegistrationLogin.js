import React, { useState } from 'react';
import IconImg from '../Icons/Cognizant.jpg';
import { useNavigate } from 'react-router-dom';
// Add eye icons
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function ErrorPopup({ message, onClose }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
          padding: '32px 40px',
          minWidth: 320,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 12,
            background: '#7373be', color: 'white',
            border: 'none', borderRadius: '50%',
            width: 32, height: 32, fontSize: 18, cursor: 'pointer'
          }}
          aria-label="Close"
        >×</button>
        <h3 style={{ color: '#3A294F', marginBottom: 16 }}>Error</h3>
        <div style={{ color: '#d32f2f', fontWeight: 500 }}>{message}</div>
      </div>
    </div>
  );
}

function RegistrationLogin() {
  const [errorMessage, setErrorMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmailId, setUserEmailId] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/registerUser?userName=${userName}&userEmailId=${userEmailId}&userPassword=${userPassword}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, userEmailId, userPassword })
      });
      const data = await response.json();
      if (data.userId === 'User registered successfully.') {
        navigate('/');
      } else if (data.userId) {
        setErrorMessage(data.message || 'Registration failed');
      } else {
        setErrorMessage(data.message || 'Registration failed');
      }
    } catch (err) {
      setErrorMessage('Network error');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      {/* Left side with Icon and gradient overlay */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <img
          src={IconImg}
          alt="Brand Icon"
          style={{
            position: 'relative',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 100,
            zIndex: 1,
            right: 0,
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}></div>
      </div>
      {/* Right side with registration form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000048' }}>
        <form className="loginpage-form" onSubmit={handleRegister} style={{ width: '100%', maxWidth: 400 }}>
          <h1 className="loginpage-title">Register for Tango AI!</h1>
          <div className="loginpage-field">
            <label className="loginpage-label">Username</label>
            <input
              type="text"
              className="loginpage-input"
              placeholder="Enter your username"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="loginpage-field">
            <label className="loginpage-label">Email</label>
            <input
              type="email"
              className="loginpage-input"
              placeholder="Enter your email"
              value={userEmailId}
              onChange={e => setUserEmailId(e.target.value)}
              required
            />
          </div>
          <div className="loginpage-field">
            <label className="loginpage-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={passwordVisible ? 'text' : 'password'}
                className="loginpage-input"
                placeholder="Enter password"
                value={userPassword}
                onChange={e => setUserPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                style={{
                  position: 'absolute', top: '50%', right: 12,
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                }}
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
              >
                {passwordVisible ? <FaEyeSlash size={20} color="#7373be" /> : <FaEye size={20} color="#7373be" />}
              </button>
            </div>
          </div>
          <button type="submit" className="loginpage-btn loginpage-btn-login">Register</button>
          <div className="mt-4 text-center">
            <span>Already have an account? </span>
            <a href="/" className="loginpage-link">Login</a>
          </div>
        </form>
      </div>
      <ErrorPopup message={errorMessage} onClose={() => setErrorMessage('')} />
    </div>
  );
}

export default RegistrationLogin;

