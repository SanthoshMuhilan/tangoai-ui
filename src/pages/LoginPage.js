import React from 'react';
import { useNavigate } from 'react-router-dom';
 
function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="loginpage-bg ">
      <form className="loginpage-form" onSubmit={e => { e.preventDefault(); navigate('/Home'); }}>
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
        <div className="mt-4 text-center">         <span>Don't have an account? </span>
          <a href="/register" className="loginpage-link">Register</a>
        </div>
      </form>
    </div>
  );
}
 
export default LoginPage;