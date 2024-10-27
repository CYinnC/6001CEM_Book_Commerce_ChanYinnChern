import React, { useState, useEffect } from "react";
import Logo from "../layout/images/logo.png";
import './style.css';
import { Link } from 'react-router-dom';

function Bookrequest() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [requests, setRequests] = useState([]);
    const [bookDetails, setBookDetails] = useState({});
    const [buyerDetails, setBuyerDetails] = useState({});
    const [sellerDetails, setSellerDetails] = useState({});
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const loggedInUserId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/requests');
                if (!response.ok) {
                    throw new Error('Error fetching requests');
                }
                const data = await response.json();
                setRequests(data);
                await fetchBookDetails(data);
                await fetchBuyerDetails(data);
                await fetchSellerDetails(data);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();
    }, []);
    
    const fetchBookDetails = async (requests) => {
        const bookPromises = requests.map(async (request) => {
            const response = await fetch(`http://localhost:3001/api/books/${request.book_id}`);
            return response.json();
        });
        const books = await Promise.all(bookPromises);
        const details = {};
        books.forEach((book, index) => {
            details[requests[index].id] = book;
        });
        setBookDetails(details);
    };

    const fetchBuyerDetails = async (requests) => {
        const buyerPromises = requests.map(async (request) => {
            const response = await fetch(`http://localhost:3001/users/${request.buyer_id}`);
            return response.json();
        });
        const buyers = await Promise.all(buyerPromises);
        const details = {};
        buyers.forEach((buyer, index) => {
            details[requests[index].buyer_id] = buyer;
        });
        setBuyerDetails(details);
    };

    const fetchSellerDetails = async (requests) => {
        const sellerPromises = requests.map(async (request) => {
            const response = await fetch(`http://localhost:3001/users/${request.seller_id}`);
            return response.json();
        });
        const sellers = await Promise.all(sellerPromises);
        const details = {};
        sellers.forEach((seller, index) => {
            details[requests[index].seller_id] = seller;
        });
        setSellerDetails(details);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const openPopup = (request) => {
        setSelectedRequest(request);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedRequest(null);
    };

    const handleRejectRequest = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/requests/${selectedRequest.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setRequests((prevRequests) => prevRequests.filter(req => req.id !== selectedRequest.id));
                closePopup();
            } else {
                console.error('Error deleting request:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCancelRequest = async () => {
        await handleRejectRequest();
    };

    const filteredRequests = requests.filter(request =>
        request.buyer_id.toString() === loggedInUserId || request.seller_id.toString() === loggedInUserId
    );

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
                        <li><Link to="/pages/aboutus">About Us</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </div>

                <div className="request-container">
                    <h1>Book Requests</h1>

                    {filteredRequests.length === 0 ? (
                        <p>No requests found.</p>
                    ) : (
                        filteredRequests.map(request => (
                            <div key={request.id} className="request-card">
                                <p>
                                    {buyerDetails[request.buyer_id]?.username || 'Unknown'} ID: {request.buyer_id} made 
                                    a {request.request_type} request to
                                    seller {sellerDetails[request.seller_id]?.username || 'Loading...'} ID: 
                                    {request.seller_id} for the book: 
                                    {bookDetails[request.id]?.title || 'Loading...'} 
                                </p>
                                <button onClick={() => openPopup(request)}>Check Detail</button>
                            </div>
                        ))
                    )}
                </div>

                {isPopupOpen && selectedRequest && (
                    <div className="request-popup">
                        <div className="request-popup_content">
                            <button className="close_popup" onClick={closePopup}>X</button>
                            <h1>Request Details</h1>
                            <p>
                                {`${buyerDetails[selectedRequest.buyer_id]?.username || 'Unknown'} 
                                wants to ${selectedRequest.request_type} "${bookDetails[selectedRequest.id]?.title}".`}
                            </p>
                            <p><b>Phone:</b> {selectedRequest.phone_number || 'N/A'}</p>
                            <p><b>Shipping Address:</b> {selectedRequest.shipping_address || 'N/A'}</p>
                            <p><b>Book:</b> {selectedRequest.title || 'N/A'}</p>
                            <p><b>Book Condition:</b> {selectedRequest.book_condition || 'N/A'}</p>
                            <p><b>Description:</b> {selectedRequest.description || 'No description available.'}</p>
                            
                            {selectedRequest.seller_id.toString() === loggedInUserId ? (
                                <>
                                    <button className="accept-button">Accept</button>
                                    <button className="reject-button" onClick={handleRejectRequest}>Reject</button>
                                </>
                            ) : (
                                <button className="reject-button" onClick={handleCancelRequest}>Cancel Request</button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Bookrequest;
