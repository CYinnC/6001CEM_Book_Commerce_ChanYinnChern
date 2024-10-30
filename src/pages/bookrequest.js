import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
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

    const handleAcceptRequest = async () => {
        if (!selectedRequest) return;

        try {
            const response = await fetch(`http://localhost:3001/api/requests/${selectedRequest.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'accepted' }),
            });

            if (response.ok) {
                const updatedRequest = { ...selectedRequest, status: 'accepted' };
                setRequests((prevRequests) =>
                    prevRequests.map(req => (req.id === selectedRequest.id ? updatedRequest : req))
                );
                closePopup();
            } else {
                console.error('Error updating request status:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

/*==================================================================================================================== */

    const generatePDF = () => {
        const buyer = buyerDetails[selectedRequest.buyer_id];
        const seller = sellerDetails[selectedRequest.seller_id];
        const sellerBook = bookDetails[selectedRequest.id];
        const buyerBook = selectedRequest.title;

        const buyerId = selectedRequest.buyer_id || 'N/A';
        const sellerId = selectedRequest.seller_id || 'N/A';

        const currentDate = new Date().toLocaleDateString(); // Get current date

        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Book Commerce", 20, 20);
        doc.addImage(Logo, 'PNG', 75, 10, 19, 15);
        doc.setFontSize(16);
        doc.text("Trade Receipt", 20, 40);
        doc.line(20, 45, 200, 45);
        doc.setFontSize(12);
        doc.text(`Buyer: ${buyer.username}`, 20, 60);
        doc.text(`ID: ${buyerId}`, 20, 70);
        doc.text(`Book: ${buyerBook}`, 20, 80);
        doc.text(`Seller: ${seller.username}`, 20, 100);
        doc.text(`ID: ${sellerId}`, 20, 110);
        doc.text(`Book: ${sellerBook.title}`, 20, 120);
        doc.line(20, 125, 200, 125);
        doc.text(`The seller has agreed to trade the book ${sellerBook.title}`, 20, 140);
        doc.text(`with the Buyer's book ${buyerBook}`, 20, 150);
        doc.text(`at the meet up location: ${selectedRequest.meet_up_location}.`, 20, 160);
        doc.text(`All trades are made final and cannot be changed once the agreement is made.`, 20, 190);
        doc.text(`Date of agreement: ${currentDate}`, 20, 200);
        
        doc.save("receipt.pdf");
    };

    const filteredRequests = requests.filter(request =>
        request.buyer_id.toString() === loggedInUserId || request.seller_id.toString() === loggedInUserId
    );


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
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </div>

                <div className="request_container">
                    <h1>Book Requests</h1>

                    {filteredRequests.length === 0 ? (
                        <p>No requests found.</p>
                    ) : (
                        filteredRequests.map(request => (
                            <div key={request.id} className="request_card">
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
                <div className="request_popup">
                    <div className="request_popup_content">
                        <button className="close_popup" onClick={closePopup}>X</button>
                        <h1>Request Details</h1>
                        <p>
                            {`${buyerDetails[selectedRequest.buyer_id]?.username || 'Unknown'} 
                            wants to ${selectedRequest.request_type} "${bookDetails[selectedRequest.id]?.title}".`}
                        </p>
                        <p><b>Phone:</b> {selectedRequest.phone_number || 'N/A'}</p>
                        <p><b>Meet up Address:</b> {selectedRequest.meet_up_location || 'N/A'}</p>
                        <p><b>Book:</b> {selectedRequest.title || 'N/A'}</p>
                        <p><b>Book Condition:</b> {selectedRequest.book_condition || 'N/A'}</p>
                        <p><b>Description:</b> {selectedRequest.description || 'No description available.'}</p>
                        
                        {selectedRequest.status === 'pending' && selectedRequest.seller_id.toString() === loggedInUserId ? (
                            <>
                                <button className="accept_button" onClick={handleAcceptRequest}>Accept</button>
                                <button className="reject_button" onClick={handleRejectRequest}>Reject</button>
                            </>
                        ) : selectedRequest.status === 'accepted' ? (
                            <>
                                <h2>Request has been Accepted</h2>
                                <button onClick={generatePDF}>Download Receipt</button>
                            </>
                        ) : (
                            <button className="reject_button" onClick={handleCancelRequest}>Cancel Request</button>
                        )}
                    </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Bookrequest;
