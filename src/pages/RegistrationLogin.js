import React, { useState } from 'react';
function RegistrationLogin() {

  const [username, setUsername] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [success, setSuccess] = useState(false);

 



  const handleRegister = (e) => {

    e.preventDefault();

    // Here you would send data to your backend

    if (username && email && password) {

      setSuccess(true);

      // Reset fields if desired

      setUsername('');

      setEmail('');

      setPassword('');

    }

  };



  return (

    <div className="loginpage-bg">

      <div className="loginpage-form" >

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

  );

}



export default RegistrationLogin;

