import React, { useState } from "react";
import'./style.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
      e.preventDefault();
      try {
          await axios.post('http://localhost:3001/signup', { username, email, password });
          navigate("/pages/login");
      } catch (error) {
          console.error('Signup error:', error.message);
      }
  };

return(
<div className="background">
<div className="container">
    
        <div className="login_n_register_container">
            <div className="login_n_register_title"><b>Register Account</b></div>
            <input type="text" placeholder="Username" className="login_n_register_input"  value={username} 
                onChange={(e) => setUsername(e.target.value)} />

            <input type="text" placeholder="Email" className="login_n_register_input" value={email} 
                onChange={(e) => setEmail(e.target.value)}/>

            <input type="password" placeholder="Password" className="login_n_register_input" value={password} 
                onChange={(e) => setPassword(e.target.value)}/>

            <Link  to="/pages/login" class="l_n_r_button">Already have an account. Login here!!</Link>
            <button className="login_n_register_button" onClick={handleSignUp}><b>Create Account</b></button>
        </div>

</div>
</div>
)
}

export default Signup;