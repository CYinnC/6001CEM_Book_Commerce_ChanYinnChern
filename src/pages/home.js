import React, { useState, useEffect } from "react";
import Logo from "../layout/images/logo.png";
import Newbook from "../layout/images/newbook.jpg";
import './style.css';
import { Link } from 'react-router-dom';

function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 8;

    useEffect(() => {
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

    const searchBook = (event) => {
        if (event.key === 'Enter') {
            console.log(searchTerm);
        }
    };

   
    const filteredBooks = books.filter(book =>
        book.username.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <li><Link to="/pages/aboutus">About Us</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </div>
            </div>

            <div className="button_container">
                <Link to="/pages/myproduct" className="new_book_button"><img src={Newbook} alt="newbook" /></Link>
            </div>

            <div className="subtitle"><h1>Enjoy Exploring all Second Handed Books Here!!</h1></div>

            <div className="search">
                <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={searchBook} />
            </div>

            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage} / {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
            </div>

            <div className="home_display_container">
                {currentBooks.map((book, index) => (
                    <div className="home_book_card" key={index} onClick={() => openPopup(book)}>
                        <img src={book.image ? `http://localhost:3001/${book.image.replace('\\', '/')}` : "placeholder-image-url"} alt={book.title} />
                        <h3>{book.title}</h3>
                        <h4>Seller: {book.username}</h4>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage} / {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
            </div>

            {isPopupOpen && selectedBook && (
                <div className="popup">
                    <div className="popup_content">
                        <button className="close_popup" onClick={closePopup}>X</button>
                        <h1>Book Detail</h1>
                        <h3>{selectedBook.title}</h3>
                        <p><b>Author:</b> {selectedBook.author}</p>
                        <p><b>Condition:</b> {selectedBook.condition}</p>
                        <p><b>Description:</b> {selectedBook.description}</p>
                        <p className="book_price">{selectedBook.price === "0.00" ? "Up for trade" : `Price: RM${selectedBook.price}`}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
