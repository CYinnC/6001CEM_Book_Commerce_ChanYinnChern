import React, { useState, useEffect } from "react";
import Logo from "../layout/images/logo.png";
import './style.css';
import { Link } from 'react-router-dom';

function Bookproduct() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [bookCounts, setBookCounts] = useState({ selling: 0, trading: 0 });
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null); // State for selected book
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup visibility

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
                setBooks(booksWithUsernames);
            } else {
                console.error('Error fetching books:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
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

    const filteredBooks = books.filter(book =>
        book.username.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

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
                        <li><Link to="/pages/home">Featured New Book</Link></li>
                        <li><Link to="/pages/useraccounts">User Accounts</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </div>

                <div className="book_counts">
                    <div className="count_item"><b>Total Books Being Sold:</b> {bookCounts.selling}</div>
                    <div className="count_item"><b>Total Books Being Traded:</b> {bookCounts.trading}</div>
                </div>

                <div className="search">
                    <input  type="text" placeholder="Search Seller" value={searchTerm} onChange={handleSearchChange}/></div>


                <div className="books_display_container_admin">
                   {filteredBooks.map((book, index) => (
                    <div className="book_card_admin" key={index} onClick={() => openPopup(book)}>
                        <img src={book.image ? `http://localhost:3001/${book.image.replace('\\', '/')}` : "placeholder-image-url"} 
                        alt={book.title} />
                        <h3>{book.title}</h3>
                        <h4>Seller: {book.username}</h4>
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
            </div>
        </div>
    );
}

export default Bookproduct;
