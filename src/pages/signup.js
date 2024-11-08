import React, { useState } from "react";
import { Link ,useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState({ message: "", isVisible: false });
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/signup', { username, email, password });
      setNotification({ message: response.data.message, isVisible: true });
      setTimeout(() => setNotification({ ...notification, isVisible: false }), 5000);
      navigate("/pages/login");
    } catch (error) {
      setNotification({ message: error.response?.data.message || 'Signup error!', isVisible: true });
      setTimeout(() => setNotification({ ...notification, isVisible: false }), 5000);
    }
  };

  /*==================================================================================================================== */

  return (
    <div className="background">
      {notification.isVisible && (
        <div className={`notification ${notification.message.includes('error') ? 'error' : ''} show`}>
          {notification.message}
        </div>
      )}
      <div className="container">
        <form onSubmit={handleSignUp}>
          <div className="login_n_register_container">
            <div className="login_n_register_title"><b>Register Account</b></div>
            <input  type="text"  placeholder="Username"  className="login_n_register_input"  value={username} 
              onChange={(e) => setUsername(e.target.value)}  required />

            <input  type="email"  placeholder="Email"  className="login_n_register_input"  value={email} 
              onChange={(e) => setEmail(e.target.value)}  required />

            <input type="password"  placeholder="Password"  className="login_n_register_input"  value={password} 
              onChange={(e) => setPassword(e.target.value)} required />
               <Link to="/pages/login" className="l_n_r_button">Already have an account? Login here!!</Link>
            <button type="submit" className="login_n_register_button">
              <b>Create Account</b>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
