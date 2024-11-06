import React, { useState } from "react";
import Logo from "../layout/images/logo.png";
import './style.css';
import { Link } from 'react-router-dom';

function Complaint() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [issueType, setIssueType] = useState('product quality');
    const [detail, setDetail] = useState('');
    const [notification, setNotification] = useState({ message: '', isVisible: false });

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const complaintData = { username, email, issueType, detail };

        try {
            const response = await fetch('http://localhost:3001/api/complaints', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(complaintData),
            });

            if (!response.ok) throw new Error('Failed to submit complaint');
            const result = await response.json();

            setNotification({ message: result.message, isVisible: true });
            setTimeout(() => setNotification({ ...notification, isVisible: false }), 5000);
            
            
            setUsername('');
            setEmail('');
            setIssueType('product quality');
            setDetail('');
        } catch (error) {
            console.error('Error submitting complaint:', error);
            setNotification({ message: 'An error occurred while submitting the complaint.', isVisible: true });
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
                <div className="header">
                    <div className="header_title">
                        <button className="sidebar_toggle" onClick={toggleSidebar}><h1>≡</h1></button>
                    </div>
                    <h1>Book Commerce<img src={Logo} alt="Logo" className="logo" /></h1>
                </div>

                <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                    <button className="close_button" onClick={toggleSidebar}>X</button>
                    <ul>
                        <li><Link to="/pages/home">Home</Link></li>
                        <li><Link to="/pages/myproduct">My Product</Link></li>
                        <li><Link to="/pages/bookrequest">Book Request</Link></li>
                        <li><Link to="/pages/recommendbook">Recommended Book</Link></li>
                        <li><Link to="/pages/aboutus">About Us</Link></li>
                        <li><Link to="/pages/complaint">Complaint</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </div>

                <div className="complaint_form">
                    <h2>Submit a Complaint</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} 
                            placeholder="Username" required />
                        </div>
                        <div>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Email" required />
                        </div>
                        <div>
                            <label>Issue Type:</label>
                            <select value={issueType} onChange={(e) => setIssueType(e.target.value)} required>
                                <option value="product quality">Product Quality</option>
                                <option value="scam">Scam</option>
                                <option value="site issue">Site Issue</option>
                                <option value="payment issue">Payment Issue</option>
                            </select>
                        </div>
                        <div>
                            <textarea value={detail} onChange={(e) => setDetail(e.target.value)} 
                            placeholder="Detail" required />
                        </div>
                        <button type="submit">Submit Complaint</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Complaint;
