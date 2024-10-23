import React, { useState, useEffect } from "react";
import Logo from "../layout/images/logo.png"
import'./style.css';
import {Link} from 'react-router-dom'


function Useraccounts() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState("all");
  
    const searchBook = (event) => {
      if (event.key === 'Enter') {
      
        console.log(searchTerm);
      }
    };

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
  };


  useEffect(() => {
    fetchUsers();
}, []);

const fetchUsers = async () => {
    try {
        const response = await fetch('http://localhost:3001/users'); // Update with your endpoint
        const data = await response.json();
        setUsers(data);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
        try {
            await fetch(`http://localhost:3001/users/${userId}`, { method: 'DELETE' });
            fetchUsers(); // Refresh user list
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }
};

const changeUserRole = async (userId, newRole) => {
    try {
        await fetch(`http://localhost:3001/users/${userId}/role`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole }),
        });
        fetchUsers(); // Refresh user list
    } catch (error) {
        console.error('Error changing user role:', error);
    }
};


const filteredUsers = users.filter(user => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesSearch = user.username.includes(searchTerm);
    return matchesRole && matchesSearch;
    }
);


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
                    <li><Link to="/pages/bookproduct">Book Product</Link></li>
                    <li><Link to="/pages/home">Featured New Book</Link></li>
                    <li><Link to="/pages/useraccounts">User Accounts</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                
                </ul>
            </div>

<div className="subtitle"><h1>User Accounts</h1></div>

<div className="search">
<input type="text" placeholder="Search"  value={searchTerm}onChange={(e) => 
    setSearchTerm(e.target.value)}onKeyPress={searchBook}/>

    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
    </select>
</div>

                    <table>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
           
                            {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email.charAt(0) + '**********@' + user.email.split('@')[1]}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => changeUserRole(user.id, e.target.value)}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>  
                                  <button className="delete_button" onClick={() => deleteUser(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                  
                </table>
            </div>
        </div>
    );
}

export default Useraccounts;