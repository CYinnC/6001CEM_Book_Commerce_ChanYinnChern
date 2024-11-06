import React, { useState } from "react";
import Logo from "../layout/images/logo.png";
import Trade from "../layout/images/trade.png";
import Purchase from "../layout/images/purchase.png";
import './style.css';
import { Link } from 'react-router-dom';

function BookRequest() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
/*==================================================================================================================== */

    return (
        <div className="background">
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

                <div className="trade_n_purchase_container">
                    <Link to="/pages/trequest" className="trade_n_purchase_button"><img src={Trade} alt="trade" /></Link>
                    <Link to="/pages/prequest" className="trade_n_purchase_button"><img src={Purchase} alt="purchase" /></Link>
                </div>

            </div>
        </div>
    );
}

export default BookRequest;
