import React, { useState } from "react";
import Logo from "../layout/images/logo.png"
import'./style.css';
import {Link} from 'react-router-dom'


function Dashboard() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
    const searchBook = (event) => {
      if (event.key === 'Enter') {
       
        console.log(searchTerm);
      }
    };

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
  };

return(
<div className="background">
<div className="container">
    

  <div className="header">
  <div className="header_title"><button className="sidebar_toggle" onClick={toggleSidebar}><h1>≡</h1></button></div>
      <h1>Admin Dashboard<img src={Logo} alt="Logo" className="logo" /></h1></div>

<div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <button className="close_button" onClick={toggleSidebar}>X</button>
                <ul>
                    <li><Link to="/pages/dashboard">Dashboard</Link></li>
                    <li><Link to="/pages/dashboard">Book Product</Link></li>
                    <li><Link to="/pages/home">Featured Book</Link></li>
                    <li><Link to="/pages/useraccounts">User Accounts</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                
                </ul>
            </div>

<div className="subtitle"><h1>Enjoy All Diffrent Kind of Books Here!!</h1></div>

<div className="search">
<input type="text" placeholder="Search"  value={searchTerm}onChange={(e) => 
    setSearchTerm(e.target.value)}onKeyPress={searchBook}/>
</div>

</div>
</div>
)
}

export default Dashboard;