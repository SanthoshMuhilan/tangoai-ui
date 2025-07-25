import React, { useState } from 'react';
import IconImg from '../Icons/Cognizant.jpg';

function RegistrationLogin() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  // New async register handler for backend integration
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://<your-local-ip>:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setSuccess(true);
        setUsername('');
        setEmail('');
        setPassword('');
        alert(data.message || 'Registration Complete');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      alert('Registration failed');
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      {/* Left side with Icon.jpg and gradient overlay */}
      <div style={{
        flex: 1,
        position: 'relative',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
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
      </div>

      {/* Right side with registration form */}
      <div style={{
        flex: 1,
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000048',
      }}>
        <div className="loginpage-form" style={{ width: '100%', maxWidth: 400 }}>
          <h1 className="loginpage-title">Register</h1>
          {success && <div className="text-green-600 font-semibold mb-2">Registration successful!</div>}
          <form onSubmit={handleRegister} className="w-full">
            <div className="loginpage-field">
              <label className="loginpage-label">Username</label>
              <input
                type="text"
                className="loginpage-input"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="loginpage-field">
              <label className="loginpage-label">Email</label>
              <input
                type="email"
                className="loginpage-input"
                placeholder="Enter email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="loginpage-field">
              <label className="loginpage-label">Password</label>
              <input
                type="password"
                className="loginpage-input"
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="loginpage-btn loginpage-btn-login" type="submit">Get Started</button>
          </form>
          <div className="mt-4 text-center">
            <span>Already have an account? </span>
            <a href="/" className="loginpage-link">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationLogin;

