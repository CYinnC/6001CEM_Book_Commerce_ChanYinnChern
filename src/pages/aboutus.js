import React, { useState } from "react";
import Logo from "../layout/images/logo.png"
import'./style.css';
import {Link} from 'react-router-dom'


function Aboutus() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
  };

return(
<div className="background">
<div className="container">
    

  <div className="header">
  <div className="header_title"><button className="sidebar_toggle" onClick={toggleSidebar}><h1>≡</h1></button></div>
      <h1>Book Commerce<img src={Logo} alt="Logo" className="logo" /></h1></div>

<div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <button className="close_button" onClick={toggleSidebar}>X</button>
                <ul>
                    <li><Link to="/pages/home">Home</Link></li>
                    <li><Link to="/pages/myproduct">My Product</Link></li>
                    <li><Link to="/pages/home">Trade House</Link></li>
                    <li><Link to="/pages/aboutus">About Us</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                
                </ul>
            </div>

</div>
<div className="about_container">
                <h1>About Us</h1>
                <p>
                    Welcome to the Book Commerce website, this site is dedicated to provide everyone a platforme
                    to sell and trade their second handed books that they don;t need anymore.
                </p>
                <h2>Our Mission</h2>
                <p>
                    Our mission is to provide all the book lovers out there to get book and a more reasonable price and to provide 
                    everyone a oppertunitty to sell/ trade their book to others to unsure that no books are gone to waste.
                </p>
                <h2>Meet the Team</h2>
                <div className="team">
                    <div className="team_member">
                        <h3>Johnny Smith</h3>
                        <p>Founder & CEO</p>
                    </div>
                    <div className="team_member">
                        <h3>Adam Lee</h3>
                        <p>CTO</p>
                    </div>
                    <div className="team_member">
                        <h3>Isabella Hunter</h3>
                        <p>Product Manager</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Aboutus;