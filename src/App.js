import React from 'react';
import Main from './pages/main';
import Login from './pages/login';
import Signup from './pages/signup';

import Home from './pages/home';
import Myproduct from './pages/myproduct';
import Bookdetail from './pages/bookdetail';
import Bookrequest from './pages/bookrequest';
import Trequest from './pages/trequest';
import Prequest from './pages/prequest';
import Recommendedbook from './pages/recommendbook';
import Aboutus from './pages/aboutus';

import Dashboard from './pages/dashboard';
import Bookproduct from './pages/bookproduct';
import Useraccounts from './pages/useraccounts';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


const ProtectedRoute = ({ element }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    console.log('User is logged in:', isLoggedIn); 
    return isLoggedIn ? element : <Navigate to="/pages/login" />;
};

const Logout = () => {
    const handleLogout = () => {
        console.log("Logging out user with ID:", localStorage.getItem('userId'));
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');
    };

    handleLogout();
    return <Navigate to="/" />;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/pages/login" element={<Login />} />
                <Route path="/pages/signup" element={<Signup />} />
                <Route path="/pages/home" element={<Home />} />

                <Route path="/pages/myproduct" element={<ProtectedRoute element={<Myproduct />} />} />
                <Route path="/pages/bookdetail/:bookId" element={<ProtectedRoute element={<Bookdetail />} />} />
                <Route path="/pages/bookrequest" element={<ProtectedRoute element={<Bookrequest />} />} />
                <Route path="/pages/Trequest" element={<ProtectedRoute element={<Trequest />} />} />
                <Route path="/pages/Prequest" element={<ProtectedRoute element={<Prequest />} />} />
                <Route path="/pages/recommendbook" element={<ProtectedRoute element={<Recommendedbook />} />} />
                <Route path="/pages/aboutus" element={<ProtectedRoute element={<Aboutus />} />} />

                <Route path="/pages/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/pages/bookproduct" element={<ProtectedRoute element={<Bookproduct />} />} />
                <Route path="/pages/useraccounts" element={<ProtectedRoute element={<Useraccounts />} />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
