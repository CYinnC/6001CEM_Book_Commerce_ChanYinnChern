import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import Logo from "../layout/images/logo.png";
import './style.css';
import { Link } from 'react-router-dom';

function PurchaseRequest() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [purchases, setPurchases] = useState([]);
    const [bookDetails, setBookDetails] = useState({});
    const [buyerDetails, setBuyerDetails] = useState({});
    const [sellerDetails, setSellerDetails] = useState({});
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const loggedInUserId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/purchases');
                if (!response.ok) {
                    throw new Error('Error fetching purchases');
                }
                const data = await response.json();

                const sortedData = data.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));
                setPurchases(sortedData);
                await fetchBookDetails(sortedData);
                await fetchBuyerDetails(sortedData);
                await fetchSellerDetails(sortedData);
            } catch (error) {
                console.error('Error fetching purchases:', error);
            }
        };

        fetchPurchases();
    }, []);

    const fetchBookDetails = async (purchases) => {
        const bookPromises = purchases.map(async (purchase) => {
            const response = await fetch(`http://localhost:3001/api/books/${purchase.book_id}`);
            return response.json();
        });
        const books = await Promise.all(bookPromises);
        const details = {};
        books.forEach((book, index) => {
            details[purchases[index].id] = book;
        });
        setBookDetails(details);
    };

    const fetchBuyerDetails = async (purchases) => {
        const buyerPromises = purchases.map(async (purchase) => {
            const response = await fetch(`http://localhost:3001/users/${purchase.buyer_id}`);
            return response.json();
        });
        const buyers = await Promise.all(buyerPromises);
        const details = {};
        buyers.forEach((buyer, index) => {
            details[purchases[index].buyer_id] = buyer;
        });
        setBuyerDetails(details);
    };

    const fetchSellerDetails = async (purchases) => {
        const sellerPromises = purchases.map(async (purchase) => {
            const response = await fetch(`http://localhost:3001/users/${purchase.seller_id}`);
            return response.json();
        });
        const sellers = await Promise.all(sellerPromises);
        const details = {};
        sellers.forEach((seller, index) => {
            details[purchases[index].seller_id] = seller;
        });
        setSellerDetails(details);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const openPopup = (purchase) => {
        setSelectedPurchase(purchase);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedPurchase(null);
    };

    const handleRejectPurchase = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/purchases/${selectedPurchase.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setPurchases((prevPurchases) => prevPurchases.filter(purchase => purchase.id !== selectedPurchase.id));
                closePopup();
            } else {
                console.error('Error deleting purchase:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleAcceptPurchase = async () => {
        if (!selectedPurchase) return;

        try {
            const response = await fetch(`http://localhost:3001/api/purchases/${selectedPurchase.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'accepted' }),
            });

            if (response.ok) {
                const updatedPurchase = { ...selectedPurchase, status: 'accepted' };
                setPurchases((prevPurchases) =>
                    prevPurchases.map(purchase => (purchase.id === selectedPurchase.id ? updatedPurchase : purchase))
                );
                closePopup();
            } else {
                console.error('Error updating purchase status:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };




/*==================================================================================================================== */


    const generatePDF = () => {
        const buyer = buyerDetails[selectedPurchase.buyer_id];
        const seller = sellerDetails[selectedPurchase.seller_id];
        const book = bookDetails[selectedPurchase.id];

        const buyerId = selectedPurchase.buyer_id || 'N/A';
        const sellerId = selectedPurchase.seller_id || 'N/A';
        const phoneNumber = selectedPurchase.phone_number || 'N/A';
        const shippingAddress = selectedPurchase.shipping_address || 'N/A';
        const currentDate = new Date().toLocaleDateString();

        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Book Commerce", 20, 20);
        doc.addImage(Logo, 'PNG', 75, 10, 19, 15);
        doc.setFontSize(16);
        doc.text("Purchase Receipt", 20, 40);
        doc.line(20, 45, 200, 45);
        doc.setFontSize(12);
        doc.text(`Buyer: ${buyer.username}`, 20, 60);
        doc.text(`ID: ${buyerId}`, 20, 70);
        doc.text(`Phone: ${phoneNumber}`, 20, 80);
        doc.text(`Shipping Address: ${shippingAddress}`, 20, 90);
        doc.text(`Book: ${book.title}`, 20, 110);
        doc.text(`Price: $${book.price}`, 20, 120);
        doc.line(20, 125, 200, 125);
        doc.text(`The seller ${seller.username} ID: ${sellerId} has agreed to sell the book ${book.title}`, 20, 140);
        doc.text(`to the Buyer.`, 20, 150);
        doc.text(`All purchases are final and cannot be changed once completed.`, 20, 170);
        doc.text(`Date of purchase: ${currentDate}`, 20, 180);
        
        doc.save("receipt.pdf");
    };

    const filteredPurchases = purchases.filter(purchase =>
        purchase.buyer_id.toString() === loggedInUserId || purchase.seller_id.toString() === loggedInUserId
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
                    <h1>Purchase Requests History</h1>

                    {filteredPurchases.length === 0 ? (
                        <p>No purchases found.</p>
                    ) : (
                        filteredPurchases.map(purchase => (
                            <div key={purchase.id} className="request_card">
                                <p>
                                    {buyerDetails[purchase.buyer_id]?.username || 'Unknown'} ID: {purchase.buyer_id} made 
                                    a purchase request to
                                    seller {sellerDetails[purchase.seller_id]?.username || 'Loading...'} ID: 
                                    {purchase.seller_id} for the book: {bookDetails[purchase.id]?.title || 'Loading...'} 
                                    <br />
                                    <p><b>Requested on: {new Date(purchase.created_time).toLocaleString()}</b></p>
                                </p>
                                <button onClick={() => openPopup(purchase)}>Check Detail</button>
                            </div>
                        ))
                    )}
                </div>

                {isPopupOpen && selectedPurchase && (
                <div className="request_popup">
                    <div className="request_popup_content">
                        <button className="close_popup" onClick={closePopup}>X</button>
                        <h1>Request Details</h1>
                        <p>
                            {`${buyerDetails[selectedPurchase.buyer_id]?.username || 'Unknown'} 
                            wants to purchase "${bookDetails[selectedPurchase.id]?.title}".`}
                        </p>
                        <p><b>Phone:</b> {selectedPurchase.phone_number || 'N/A'}</p>
                        <p><b>Shipping Address:</b> {selectedPurchase.shipping_address || 'N/A'}</p>
                        
                        {selectedPurchase.status === 'pending' && selectedPurchase.seller_id.toString() === loggedInUserId ? (
                            <>
                                <button className="accept_button" onClick={handleAcceptPurchase}>Accept</button>
                                <button className="reject_button" onClick={handleRejectPurchase}>Reject</button>
                            </>
                        ) : selectedPurchase.status === 'accepted' ? (
                            <>
                                <h2>Request has been Accepted</h2>
                                <button onClick={generatePDF}>Download Receipt</button>
                            </>
                        ) : (
                            <button className="reject_button" onClick={handleRejectPurchase}>Cancel Request</button>
                        )}
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}

export default PurchaseRequest;
