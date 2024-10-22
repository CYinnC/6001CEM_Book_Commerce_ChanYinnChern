import React, { useState } from "react";
import Logo from "../layout/images/logo.png"
import Newbook from "../layout/images/newbook.jpg"
import'./style.css';
import {Link} from 'react-router-dom'


function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
    const searchBook = (event) => {
      if (event.key === 'Enter') {
        // Implement your search logic here
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
      <h1>Book Commerce<img src={Logo} alt="Logo" className="logo" /></h1></div>

<div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <button className="close_button" onClick={toggleSidebar}>X</button>
                <ul>
                    <li><Link to="/pages/home">Home</Link></li>
                    <li><Link to="/pages/myproduct">My Product</Link></li>
                    <li><Link to="/pages/myproduct">Trade House</Link></li>
                    <li><Link to="/pages/aboutus">About Us</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                
                </ul>
            </div>

          <div className="button_container">
            <Link  to="/pages/myproduct" class="new_book_button"><img src={Newbook} alt="newbook" /></Link>
          </div>


            <div className="subtitle"><h1>Enjoy Exploring all Second Handed Books Here!!</h1></div>

                <div className="search">
                <input type="text" placeholder="Search"  value={searchTerm}onChange={(e) => 
                    setSearchTerm(e.target.value)}onKeyPress={searchBook}/>
            </div>

</div>

</div>
)
}

export default Home;