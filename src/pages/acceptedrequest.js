import React, { useState, useEffect } from "react";
import Logo from "../layout/images/logo.png";
import './style.css';
import { Link } from 'react-router-dom';

function AcceptedRequest() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [acceptedRequests, setAcceptedRequests] = useState([]);
    const [bookDetails, setBookDetails] = useState({});
    const [buyerDetails, setBuyerDetails] = useState({});
    const [sellerDetails, setSellerDetails] = useState({});
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 3;

    useEffect(() => {
        const fetchAcceptedRequests = async () => {
            try {
                const [tradesResponse, purchasesResponse] = await Promise.all([
                    fetch('http://localhost:3001/api/trades'),
                    fetch('http://localhost:3001/api/purchases')
                ]);

                if (!tradesResponse.ok || !purchasesResponse.ok) {
                    throw new Error('Error fetching requests');
                }

                const trades = await tradesResponse.json();
                const purchases = await purchasesResponse.json();

               
                const acceptedTrades = trades.filter(trade => trade.status === 'accepted');
                const acceptedPurchases = purchases.filter(purchase => purchase.status === 'accepted');

                
                const combinedRequests = [...acceptedTrades, ...acceptedPurchases];
                setAcceptedRequests(combinedRequests);
                await fetchBookDetails(combinedRequests);
                await fetchBuyerDetails(combinedRequests);
                await fetchSellerDetails(combinedRequests);
            } catch (error) {
                console.log('Error fetching requests:', error);
            }
        };

        fetchAcceptedRequests();
    }, []);

    const fetchBookDetails = async (requests) => {
        const bookPromises = requests.map(request =>
            fetch(`http://localhost:3001/api/books/${request.book_id}`).then(response => response.json())
        );
        const books = await Promise.all(bookPromises);
        const details = {};
        books.forEach((book, index) => {
            details[requests[index].book_id] = book;
        });
        setBookDetails(details);
    };

    const fetchBuyerDetails = async (requests) => {
        const buyerPromises = requests.map(request =>
            fetch(`http://localhost:3001/users/${request.buyer_id}`).then(response => response.json())
        );
        const buyers = await Promise.all(buyerPromises);
        const details = {};
        buyers.forEach((buyer, index) => {
            details[requests[index].buyer_id] = buyer;
        });
        setBuyerDetails(details);
    };

    const fetchSellerDetails = async (requests) => {
        const sellerPromises = requests.map(request =>
            fetch(`http://localhost:3001/users/${request.seller_id}`).then(response => response.json())
        );
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

    // Filter requests based on search term (by seller name)
    const filteredRequests = acceptedRequests.filter(request => {
        const sellerName = sellerDetails[request.seller_id]?.username?.toLowerCase() || '';
        const searchTermLower = searchTerm.toLowerCase();
        return sellerName.includes(searchTermLower);
    });

    const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);
    const startIndex = (currentPage - 1) * requestsPerPage;
    const currentRequests = filteredRequests.slice(startIndex, startIndex + requestsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
/*==================================================================================================================== */

    return (
        <div className="background">
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
                        <li><Link to="/pages/acceptedrequest">Accepted Requests</Link></li>
                        <li><Link to="/pages/usercomplaint">User Complaints</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </div>

                <div className="request_container">
                    <h1>Accepted Requests</h1>

                    <div className="search_container">
                        <input
                            type="text"
                            placeholder="Search by seller name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {currentRequests.length === 0 ? (
                        <h2>No accepted requests found.</h2>
                    ) : (
                        currentRequests.map((request) => (
                            <div key={request.id} className="request_card" onClick={() => openPopup(request)}>
                                <p>
                                    <b>{buyerDetails[request.buyer_id]?.username || 'Unknown'}</b> 
                                    {request.meet_up_location ? " trade with " : " purchase from "} 
                                    <b>{sellerDetails[request.seller_id]?.username || 'Loading...'} </b> 
                                    the book: <b>{bookDetails[request.book_id]?.title || 'Loading...'}</b>.
                                    {request.price > 0 && (
                                        <span> Price: <b>${bookDetails[request.book_id]?.price || 'Loading...'}</b></span>
                                    )}
                                </p>
                                <p><b>Requested on:</b> {new Date(request.created_time).toLocaleString()}</p>
                            </div>
                        ))
                    )}

                    <div className="pagination">
                        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                        <span>{currentPage} / {totalPages}</span>
                        <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
                    </div>
                </div>

                {isPopupOpen && selectedRequest && (
                    <div className="popup">
                        <div className="popup_content">
                            <button className="close_popup" onClick={closePopup}>X</button>
                            <h1>Request Detail</h1>
                            <p>
                                <b>{buyerDetails[selectedRequest.buyer_id]?.username || 'Unknown'}</b> wants to 
                                {selectedRequest.meet_up_location ? " trade with " : " purchase from "} 
                                <b>{sellerDetails[selectedRequest.seller_id]?.username || 'Loading...'}</b> 
                                the book: <b>{bookDetails[selectedRequest.book_id]?.title || 'Loading...'}</b>.
                                {selectedRequest.price > 0 && (
                                    <span> Price: <b>${bookDetails[selectedRequest.book_id]?.price || 'Loading...'}</b></span>
                                )}
                            </p>
                            <p><b>Phone:</b> {selectedRequest.phone_number || 'N/A'}</p>
                            {selectedRequest.meet_up_location && (
                                <p><b>Meet-up Location:</b> {selectedRequest.meet_up_location || 'N/A'}</p>
                            )}
                            {selectedRequest.shipping_address && (
                                <p><b>Shipping Address:</b> {selectedRequest.shipping_address || 'N/A'}</p>
                            )}
                            <p><b>Submitted Time:</b> {new Date(selectedRequest.created_time).toLocaleString()}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AcceptedRequest;
