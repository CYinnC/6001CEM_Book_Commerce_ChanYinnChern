import React, { useState } from "react";
import './style.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', { email, password });
            console.log('Login response:', response.data); // Debug log
            localStorage.setItem('isLoggedIn', 'true'); // Set login status
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('role', response.data.role);

            // Redirect based on user role
            if (response.data.role === 'admin') {
                navigate("/pages/dashboard");
            } else {
                navigate("/pages/home");
            }
        } catch (error) {
            console.error('Login error:', error.message);
            // Optionally set an error state to display a message
        }
    };

    return (
        <div className="background">
            <div className="container">
                <div className="login_n_register_container">
                    <div className="login_n_register_title"><b>Log In</b></div>
                    <form onSubmit={handleLogin}>
                        <input 
                            type="text" 
                            placeholder="Email" 
                            className="login_n_register_input" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="login_n_register_input" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <Link to="/pages/signup" className="l_n_r_button">Sign Up Here</Link>
                        <button type="submit" className="login_n_register_button"><b>Login</b></button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
