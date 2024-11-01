import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import Logo from "../layout/images/logo.png";
import './style.css';
import { Link } from 'react-router-dom';

function TradeRequest() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [trades, setTrades] = useState([]);
    const [bookDetails, setBookDetails] = useState({});
    const [buyerDetails, setBuyerDetails] = useState({});
    const [sellerDetails, setSellerDetails] = useState({});
    const [selectedTrade, setSelectedTrade] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const loggedInUserId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/trades');
                if (!response.ok) {
                    throw new Error('Error fetching trades');
                }
                const data = await response.json();
                setTrades(data);
                await fetchBookDetails(data);
                await fetchBuyerDetails(data);
                await fetchSellerDetails(data);
            } catch (error) {
                console.error('Error fetching trades:', error);
            }
        };

        fetchTrades();
    }, []);

    const fetchBookDetails = async (trades) => {
        const bookPromises = trades.map(async (trade) => {
            const response = await fetch(`http://localhost:3001/api/books/${trade.book_id}`);
            return response.json();
        });
        const books = await Promise.all(bookPromises);
        const details = {};
        books.forEach((book, index) => {
            details[trades[index].id] = book;
        });
        setBookDetails(details);
    };

    const fetchBuyerDetails = async (trades) => {
        const buyerPromises = trades.map(async (trade) => {
            const response = await fetch(`http://localhost:3001/users/${trade.buyer_id}`);
            return response.json();
        });
        const buyers = await Promise.all(buyerPromises);
        const details = {};
        buyers.forEach((buyer, index) => {
            details[trades[index].buyer_id] = buyer;
        });
        setBuyerDetails(details);
    };

    const fetchSellerDetails = async (trades) => {
        const sellerPromises = trades.map(async (trade) => {
            const response = await fetch(`http://localhost:3001/users/${trade.seller_id}`);
            return response.json();
        });
        const sellers = await Promise.all(sellerPromises);
        const details = {};
        sellers.forEach((seller, index) => {
            details[trades[index].seller_id] = seller;
        });
        setSellerDetails(details);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const openPopup = (trade) => {
        setSelectedTrade(trade);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedTrade(null);
    };

    const handleRejectTrade = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/trades/${selectedTrade.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTrades((prevTrades) => prevTrades.filter(trade => trade.id !== selectedTrade.id));
                closePopup();
            } else {
                console.error('Error deleting trade:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAcceptTrade = async () => {
        if (!selectedTrade) return;

        try {
            const response = await fetch(`http://localhost:3001/api/trades/${selectedTrade.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'accepted' }),
            });

            if (response.ok) {
                const updatedTrade = { ...selectedTrade, status: 'accepted' };
                setTrades((prevTrades) =>
                    prevTrades.map(trade => (trade.id === selectedTrade.id ? updatedTrade : trade))
                );
                closePopup();
            } else {
                console.error('Error updating trade status:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const generatePDF = () => {
        const buyer = buyerDetails[selectedTrade.buyer_id];
        const seller = sellerDetails[selectedTrade.seller_id];
        const sellerBook = bookDetails[selectedTrade.id];
        const buyerBook = selectedTrade.title;

        const buyerId = selectedTrade.buyer_id || 'N/A';
        const sellerId = selectedTrade.seller_id || 'N/A';

        const currentDate = new Date().toLocaleDateString();

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
        doc.text(`at the meet up location: ${selectedTrade.meet_up_location}.`, 20, 160);
        doc.text(`All trades are made final and cannot be changed once the agreement is made.`, 20, 190);
        doc.text(`Date of agreement: ${currentDate}`, 20, 200);
        
        doc.save("receipt.pdf");
    };

    const filteredTrades = trades.filter(trade =>
        trade.buyer_id.toString() === loggedInUserId || trade.seller_id.toString() === loggedInUserId
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
                        <li><Link to="/pages/recommendbook">Recommended Book</Link></li>
                        <li><Link to="/pages/aboutus">About Us</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </div>

                <div className="request_container">
                    <h1>Trade Requests History</h1>

                    {filteredTrades.length === 0 ? (
                        <p>No trades found.</p>
                    ) : (
                        filteredTrades.map(trade => (
                            <div key={trade.id} className="request_card">
                                <p>
                                    {buyerDetails[trade.buyer_id]?.username || 'Unknown'} ID:{trade.buyer_id} made 
                                    a {trade.request_type} request to
                                    seller {sellerDetails[trade.seller_id]?.username || 'Loading...'} ID: 
                                    {trade.seller_id} for the book: {bookDetails[trade.id]?.title || 'Loading...'} 
                                </p>
                                <button onClick={() => openPopup(trade)}>Check Detail</button>
                            </div>
                        ))
                    )}
                </div>

                {isPopupOpen && selectedTrade && (
                <div className="request_popup">
                    <div className="request_popup_content">
                        <button className="close_popup" onClick={closePopup}>X</button>
                        <h1>Request Details</h1>
                        <p>
                            {`${buyerDetails[selectedTrade.buyer_id]?.username || 'Unknown'} 
                            wants to ${selectedTrade.request_type} "${bookDetails[selectedTrade.id]?.title}".`}
                        </p>
                        <p><b>Phone:</b> {selectedTrade.phone_number || 'N/A'}</p>
                        <p><b>Meet up Address:</b> {selectedTrade.meet_up_location || 'N/A'}</p>
                        <p><b>Book:</b> {selectedTrade.title || 'N/A'}</p>
                        <p><b>Book Condition:</b> {selectedTrade.book_condition || 'N/A'}</p>
                        <p><b>Description:</b> {selectedTrade.description || 'No description available.'}</p>
                        
                        {selectedTrade.status === 'pending' && selectedTrade.seller_id.toString() === loggedInUserId ? (
                            <>
                                <button className="accept_button" onClick={handleAcceptTrade}>Accept</button>
                                <button className="reject_button" onClick={handleRejectTrade}>Reject</button>
                            </>
                        ) : selectedTrade.status === 'accepted' ? (
                            <>
                                <h2>Request has been Accepted</h2>
                                <button onClick={generatePDF}>Download Receipt</button>
                            </>
                        ) : (
                            <button className="reject_button" onClick={handleRejectTrade}>Cancel Request</button>
                        )}
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}

export default TradeRequest;
