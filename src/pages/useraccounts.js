import React, { useState, useEffect } from "react";
import Logo from "../layout/images/logo.png";
import './style.css';
import { Link } from 'react-router-dom';

function Useraccounts() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState("all");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [roleChangeData, setRoleChangeData] = useState({ userId: null, newRole: null });
    const [notification, setNotification] = useState({ message: "", isVisible: false });

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3001/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const confirmDeleteUser = (userId) => {
        setUserToDelete(userId);
        setConfirmOpen(true);
    };

    const deleteUser = async () => {
        if (userToDelete) {
            try {
                const response = await fetch(`http://localhost:3001/users/${userToDelete}`, { method: 'DELETE' });
                const result = await response.json();
                if (response.ok) {
                    fetchUsers();
                    setNotification({ message: result.message, isVisible: true });
                    setTimeout(() => setNotification({ ...notification, isVisible: false }), 5000);
                } else {
                    setNotification({ message: result.error, isVisible: true });
                    setTimeout(() => setNotification({ ...notification, isVisible: false }), 5000);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                setNotification({ message: 'An error occurred while deleting the user.', isVisible: true });
                setTimeout(() => setNotification({ ...notification, isVisible: false }), 5000);
            }
        }
        setConfirmOpen(false);
        setUserToDelete(null);
    };

    const cancelDelete = () => {
        setConfirmOpen(false);
        setUserToDelete(null);
    };

    const changeUserRole = async (userId, newRole) => {
        setRoleChangeData({ userId, newRole });
        setConfirmOpen(true);
    };

    const confirmRoleChange = async () => {
        try {
            const response = await fetch(`http://localhost:3001/users/${roleChangeData.userId}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: roleChangeData.newRole }),
            });
            const result = await response.json();
            if (response.ok) {
                fetchUsers();
                setNotification({ message: result.message, isVisible: true });
                setTimeout(() => setNotification({ ...notification, isVisible: false }), 5000);
            } else {
                setNotification({ message: result.error, isVisible: true });
                setTimeout(() => setNotification({ ...notification, isVisible: false }), 5000);
            }
        } catch (error) {
            console.error('Error changing user role:', error);
            setNotification({ message: 'An error occurred while updating the user role.', isVisible: true });
            setTimeout(() => setNotification({ ...notification, isVisible: false }), 5000);
        }
        setConfirmOpen(false);
        setRoleChangeData({ userId: null, newRole: null });
    };

    const filteredUsers = users.filter(user => {
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesRole && matchesSearch;
    });



/*==================================================================================================================== */


    return (
        <div className="background">
            <div className="container">
                {notification.isVisible && (
                    <div className={`notification ${notification.message.includes('error') ? 'error' : ''} show`}>
                        {notification.message}
                    </div>
                )}
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
                        <li><Link to="/pages/useraccounts">User Accounts</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </div>

                <div className="subtitle"><h1>User Accounts</h1></div>

                <div className="search">
                    <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>
                                        <select value={user.role} onChange={(e) => changeUserRole(user.id, e.target.value)}>
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button className="delete_button" onClick={() => confirmDeleteUser(user.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">User doesn't exist</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {confirmOpen && (
                    <div className="confirmation_popup">
                        <div className="confirmation_content">
                            <h2>{userToDelete ? "Are you sure you want to delete this account?" : "Are you sure you want to change this account's role?"}</h2>
                            <button onClick={userToDelete ? deleteUser : confirmRoleChange}>Yes</button>
                            <button onClick={cancelDelete}>No</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Useraccounts;
