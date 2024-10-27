import React, { useState, useEffect } from "react";
import Logo from "../layout/images/logo.png";
import './style.css';
import { Link } from 'react-router-dom';

function Dashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [bookCounts, setBookCounts] = useState({ selling: 0, trading: 0 });

    useEffect(() => {
        fetch('http://localhost:3001/api/book-counts') 
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setBookCounts(data))
            .catch(error => {
                console.error('Error fetching book counts:', error);
                setBookCounts({ selling: 0, trading: 0 });
            });
    }, []);

    const searchBook = (event) => {
        if (event.key === 'Enter') {
            console.log(searchTerm);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="background">
            <div className="container">
                <div className="header">
                    <div className="header_title">
                        <button className="sidebar_toggle" onClick={toggleSidebar}><h1>≡</h1></button>
                    </div>
                    <h1>Admin Dashboard<img src={Logo} alt="Logo" className="logo" /></h1>
                </div>

                <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                    <button className="close_button" onClick={toggleSidebar}>X</button>
                    <ul>
                        <li><Link to="/pages/dashboard">Dashboard</Link></li>
                        <li><Link to="/pages/bookproduct">Book Product</Link></li>
                        <li><Link to="/pages/home">Featured New Book</Link></li>
                        <li><Link to="/pages/useraccounts">User Accounts</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </div>

    
                <div className="book_counts">
                    <div className="count_item"><b>Total Books Being Sold:</b> {bookCounts.selling}</div>
                    <div className="count_item"><b>Total Books Being Traded:</b> {bookCounts.trading}</div>
                </div>

                <div className="search">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={searchBook}
                    />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
