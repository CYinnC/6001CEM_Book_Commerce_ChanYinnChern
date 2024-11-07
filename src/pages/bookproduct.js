import React, { useState, useEffect } from "react";
import Logo from "../layout/images/logo.png";
import './style.css';
import { Link } from 'react-router-dom';

function Bookproduct() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [bookCounts, setBookCounts] = useState({ selling: 0, trading: 0 });
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [notification, setNotification] = useState({ message: "", isVisible: false });
    const [confirmation, setConfirmation] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);
    const [acceptedBookIds, setAcceptedBookIds] = useState(new Set());

    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 8;

    useEffect(() => {
        fetch('http://localhost:3001/api/book-counts')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setBookCounts(data))
            .catch(error => {
                console.error('Error fetching book counts:', error);
                setBookCounts({ selling: 0, trading: 0 });
            });

        fetchBooks();
        fetchAcceptedRequests();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/books');
            if (response.ok) {
                const data = await response.json();
                const booksWithUsernames = await Promise.all(data.map(async (book) => {
                    const userResponse = await fetch(`http://localhost:3001/users/${book.user_id}`);
                    const userData = await userResponse.json();
                    return { ...book, username: userData.username };
                }));

                const sortedBooks = booksWithUsernames.sort((a, b) => new Date(b.time) - new Date(a.time));
                setBooks(sortedBooks);
            } else {
                console.error('Error fetching books:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchAcceptedRequests = async () => {
        try {
            const [tradesResponse, purchasesResponse] = await Promise.all([
                fetch('http://localhost:3001/api/trades'),
                fetch('http://localhost:3001/api/purchases')
            ]);

            const trades = await tradesResponse.json();
            const purchases = await purchasesResponse.json();

            const acceptedTrades = trades.filter(trade => trade.status === 'accepted').map(trade => trade.book_id);
            const acceptedPurchases = purchases.filter(purchase => purchase.status === 'accepted').map(purchase => purchase.book_id);

            setAcceptedBookIds(new Set([...acceptedTrades, ...acceptedPurchases]));
        } catch (error) {
            console.log('Error fetching accepted requests:', error);
        }
    };

    const openPopup = (book) => {
        setSelectedBook(book);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedBook(null);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleUpdateRecommendation = async (bookId, status) => {
        try {
            const response = await fetch(`http://localhost:3001/api/recommendations`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ book_id: bookId, status: status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update book recommendation status');
            }

            const data = await response.json();
            setNotification({ message: data.message, isVisible: true });
            setTimeout(() => setNotification({ ...notification, isVisible: false }), 5000);
            fetchBooks();
        } catch (error) {
            console.error('Error updating book recommendation status:', error);
            setNotification({ message: 'Failed to update book recommendation status.', isVisible: true });
            setTimeout(() => setNotification({ ...notification, isVisible: false }), 5000);
        }
    };

    const handleDeleteClick = (bookId) => {
        setBookToDelete(bookId);
        setConfirmation(true);
    };

    const confirmDelete = async () => {
        if (!bookToDelete) return;

        try {
            const response = await fetch(`http://localhost:3001/api/books/${bookToDelete}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                setNotification({ message: data.message || 'Book deleted successfully!', isVisible: true });
            } else {
                setNotification({ message: data.message || 'Failed to delete the book.', isVisible: true });
            }

            setTimeout(() => setNotification({ ...notification, isVisible: false }), 5000);
            fetchBooks(); 
        } catch (error) {
            console.error('Error deleting book:', error);
            setNotification({ message: 'Error deleting book.', isVisible: true });
            setTimeout(() => setNotification({ ...notification, isVisible: false }), 5000);
        } finally {
            setConfirmation(false);
            setBookToDelete(null);
        }
    };

    const cancelDelete = () => {
        setConfirmation(false);
        setBookToDelete(null);
    };

    const filteredBooks = books.filter(book =>
        book.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !acceptedBookIds.has(book.id)
    );

    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const startIndex = (currentPage - 1) * booksPerPage;
    const currentBooks = filteredBooks.slice(startIndex, startIndex + booksPerPage);

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

                <div className="product_counts">
                    <div className="product_item"><b>Total Books Being Sold:</b> {bookCounts.selling}</div>
                    <div className="product_item"><b>Total Books Being Traded:</b> {bookCounts.trading}</div>
                </div>

                <div className="search">
                    <input type="text" placeholder="Search Seller" value={searchTerm} onChange={handleSearchChange} />
                </div>

                <div className="pagination">
                    <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                    <span>{currentPage} / {totalPages}</span>
                    <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
                </div>

                <div className="books_display_container_admin">
                    {currentBooks.map((book, index) => (
                        <div className="book_card_admin" key={index} onClick={() => openPopup(book)}>
                            <img src={book.image ? `http://localhost:3001/${book.image.replace('\\', '/')}` : "placeholder-image-url"} 
                                 alt={book.title} />
                            <h3>{book.title}</h3>
                            <h4>Seller: {book.username}</h4>

                            {book.recommended === 'recommended' ? (
                                <button className="r_remove_button" onClick={(e) => { e.stopPropagation(); handleUpdateRecommendation(book.id, 'default'); }}>
                                    Unrecommend
                                </button>
                            ) : (
                                <button className="r_add_button" onClick={(e) => { e.stopPropagation(); handleUpdateRecommendation(book.id, 'recommended'); }}>
                                    Recommend
                                </button>
                            )}
                            <div className="bp_button_container">
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(book.id); }} className="delete_button">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>

                {isPopupOpen && selectedBook && (
                    <div className="popup">
                        <div className="popup_content">
                            <button className="close_popup" onClick={closePopup}>X</button>
                            <h1>Book Detail</h1>
                            <h3>{selectedBook.title}</h3>
                            <p>Author: {selectedBook.author}</p>
                            <p>Condition: {selectedBook.condition}</p>
                            <p>Description: {selectedBook.description}</p>
                            <p className="book_price">{selectedBook.price === "0.00" ? "Up for trade" : `Price: RM${selectedBook.price}`}</p>
                        </div>
                    </div>
                )}

                {confirmation && (
                    <div className="confirmation_popup">
                        <div className="confirmation_content">
                            <h2>Are you sure you want to delete this book?</h2>
                            <button onClick={confirmDelete}>Yes</button>
                            <button onClick={cancelDelete}>No</button>
                        </div>
                    </div>
                )}

                <div className="pagination">
                    <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                    <span>{currentPage} / {totalPages}</span>
                    <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
                </div>
            </div>
        </div>
    );
}

export default Bookproduct;
