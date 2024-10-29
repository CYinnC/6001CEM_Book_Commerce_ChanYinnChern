import React, { useState } from "react";
import Logo from "../layout/images/logo.png"
import'./style.css';
import {Link} from 'react-router-dom'


function Main() {
    const [searchTerm, setSearchTerm] = useState("");
  
    const searchBook = (event) => {
      if (event.key === 'Enter') {
        
        console.log(searchTerm);
      }
    };

return(
<div className="background">
<div className="container">
<div className="title"><h1>BOOK COMMERCE <img src={Logo} alt="logo" /></h1></div>    
<Link  to="/pages/signup" class="register_button"><b>Sign Up</b></Link>
<div className="subtitle"><h1>Explore the World of Second Handed Books</h1></div>
<Link  to="/pages/login" class="l_button"><b>Let's Get Started</b></Link>



</div>
</div>
)
}

export default Main;