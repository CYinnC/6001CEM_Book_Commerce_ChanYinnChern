import React from 'react'
import Main from './pages/main';
import Login from './pages/login';
import Signup from './pages/signup';

import Home from './pages/home';
import Myproduct from './pages/myproduct';
import Aboutus from './pages/aboutus';


import Dashboard from './pages/dashboard';
import Useraccounts from './pages/useraccounts';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';



function App() {
   
    
  const handleLogout = () => {
    // Clear the login data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  };



  return (
    <BrowserRouter>
        <Routes>
            
            <Route path="/" element={<Main />} />
            <Route path="/pages/login" element={<Login />} />
            <Route path="/pages/signup" element={<Signup />} />


            <Route path="/pages/home" element={<Home />} />
            <Route path="/pages/myproduct" element={<Myproduct />} />
            <Route path="/pages/aboutus" element={<Aboutus />} />


            <Route path="/pages/dashboard" element={<Dashboard />} />
            <Route path="/pages/useraccounts" element={<Useraccounts />} />
            
            {/* Logout Route */}
            <Route
                path="/logout"
                element={
                    <>
                        {handleLogout()} {/* Call the logout function */}
                        <Navigate to="/" /> {/* Redirect to login */}
                    </>
                }
            />
        </Routes>
    </BrowserRouter>
);
}

export default App;
