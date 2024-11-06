import React, { useState, useEffect } from "react";
import Logo from "../layout/images/logo.png";
import './style.css';
import { Link } from 'react-router-dom';

function UserComplaint() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [notification, setNotification] = useState({ message: "", isVisible: false });
    const [confirmation, setConfirmation] = useState(false);
    const [complaintToDelete, setComplaintToDelete] = useState(null);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/complaints');
            if (response.ok) {
                const data = await response.json();
                setComplaints(data);
            } else {
                console.error('Error fetching complaints:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const openPopup = (complaint) => {
        setSelectedComplaint(complaint);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedComplaint(null);
    };

    const handleDeleteClick = (complaintId) => {
        setComplaintToDelete(complaintId);
        setConfirmation(true);
    };

    const confirmDelete = async () => {
        if (!complaintToDelete) return;

        try {
            const response = await fetch(`http://localhost:3001/api/complaints/${complaintToDelete}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                setNotification({ message: data.message || 'Complaint deleted successfully!', isVisible: true });
                fetchComplaints();
            } else {
                setNotification({ message: data.message || 'Failed to delete the complaint.', isVisible: true });
            }

            setTimeout(() => setNotification({ ...notification, isVisible: false }), 5000);
        } catch (error) {
            console.error('Error deleting complaint:', error);
            setNotification({ message: 'Error deleting complaint.', isVisible: true });
            setTimeout(() => setNotification({ ...notification, isVisible: false }), 5000);
        } finally {
            setConfirmation(false);
            setComplaintToDelete(null);
            closePopup();
        }
    };

    const cancelDelete = () => {
        setConfirmation(false);
        setComplaintToDelete(null);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
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
                    <h1>Admin Dashboard<img src={Logo} alt="Logo" className="logo" /></h1>
                </div>

                <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                    <button className="close_button" onClick={toggleSidebar}>X</button>
                    <ul>
                        <li><Link to="/pages/dashboard">Dashboard</Link></li>
                        <li><Link to="/pages/bookproduct">Book Product</Link></li>
                        <li><Link to="/pages/useraccounts">User Accounts</Link></li>
                        <li><Link to="/pages/acceptedrequest">Accepted Book Request</Link></li>
                        <li><Link to="/pages/usercomplaint">User Complaints</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </div>

                <div className="request_container">
                    <h1>User Complaints</h1>

                    {complaints.length === 0 ? (
                        <h2>No complaints found.</h2>
                    ) : (
                        complaints.map((complaint) => (
                            <div key={complaint.id} className="request_card">
                                <p><b>{complaint.username}</b> submitted a complaint regarding <b>{complaint.issue_type}</b>. </p>
                                <p><b>Submitted on:</b> {new Date(complaint.created_time).toLocaleString()}</p>
                                <button onClick={() => openPopup(complaint)}>Check Detail</button>
                            </div>
                        ))
                    )}
                </div>

                {isPopupOpen && selectedComplaint && (
                    <div className="popup">
                        <div className="popup_content">
                            <button className="close_popup" onClick={closePopup}>X</button>
                            <h1>Complaint Detail</h1>
                            <button onClick={() => handleDeleteClick(selectedComplaint.id)} className="delete_button">
                                Delete Complaint</button>
                            <h3>Username: {selectedComplaint.username}</h3>
                            <p><b>Contact Email:</b> {selectedComplaint.email}</p>
                            <p><b>Issue Type:</b> {selectedComplaint.issue_type}</p>
                            <p><b>Detail:</b> {selectedComplaint.detail}</p>
                            <p><b>Submitted Time:</b> {new Date(selectedComplaint.created_time).toLocaleString()}</p>
                        </div>
                    </div>
                )}

                {confirmation && (
                    <div className="confirmation_popup">
                        <div className="confirmation_content">
                            <h2>Are you sure you want to delete this complaint?</h2>
                            <button onClick={confirmDelete}>Yes</button>
                            <button onClick={cancelDelete}>No</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserComplaint;
