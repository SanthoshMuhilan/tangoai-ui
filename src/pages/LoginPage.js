import React from 'react';
import { useNavigate } from 'react-router-dom';
import IconImg from '../Icons/Icon.jpg';

function LoginPage() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      {/* Left side with Icon.jpg and gradient overlay */}
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
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.45,
            zIndex: 1,
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%' }}></div>
      </div>
      {/* Right side with login form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
        <form className="loginpage-form" onSubmit={e => { e.preventDefault(); navigate('/Home'); }} style={{ width: '100%', maxWidth: 400 }}>
          <h1 className="loginpage-title">Welcome!</h1>
          <div className="loginpage-field">
            <label className="loginpage-label">Username</label>
            <input type="text" className="loginpage-input" placeholder="Enter username" />
          </div>
          <div className="loginpage-field">
            <label className="loginpage-label">Password</label>
            <input type="password" className="loginpage-input" placeholder="Enter password" />
          </div>
          <button type="submit" className="loginpage-btn loginpage-btn-login">Login</button>
          <div className="mt-4 text-center">
            <span>Don't have an account? </span>
            <a href="/register" className="loginpage-link">Register</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;