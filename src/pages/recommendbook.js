import React, { useState, useEffect } from "react";
import Logo from "../layout/images/logo.png";
import './style.css';
import { Link } from 'react-router-dom';

function Recomandbook() {
    const [searchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 8;

    useEffect(() => {
        fetchRecommendedBooks();
    }, []);

    const fetchRecommendedBooks = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/books');
            if (response.ok) {
                const data = await response.json();
                const booksWithUsernames = await Promise.all(data.map(async (book) => {
                    const userResponse = await fetch(`http://localhost:3001/users/${book.user_id}`);
                    const userData = await userResponse.json();
                    return { ...book, username: userData.username };
                }));

                // Filter for books that have a recommended status
                const recommendedBooks = booksWithUsernames.filter(book => book.recommended === "recommended");

                const sortedBooks = recommendedBooks.sort((a, b) => new Date(b.time) - new Date(a.time));
                setBooks(sortedBooks);
            } else {
                console.error('Error fetching books:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <li><Link to="/pages/bookrequest">Book Request</Link></li>
                        <li><Link to="/pages/recommendbook">Recommended Book</Link></li>
                        <li><Link to="/pages/aboutus">About Us</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </div>
            </div>

            <div className="subtitle"><h1>Look at the books that we recommend!!</h1></div>

            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage} / {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
            </div>

            <div className="recommend_display_container">
                {filteredBooks.length === 0 ? (
                    <>
                    <div className="no_result">
                        <h2>No recommended books available.</h2>
                    </div>
                    </>
                ) : (
                    currentBooks.map((book, index) => (
                        <Link to={`/pages/bookdetail/${book.id}`} key={index} className="recommend_book_card">
                            <img src={book.image ? `http://localhost:3001/${book.image.replace('\\', '/')}` : "placeholder-image-url"} 
                                 alt={book.title} />
                            <h3>{book.title}</h3>
                            <h3 className="price">{book.price > 0 ? `RM${book.price}` : "Trade Only"}</h3>
                            <h4>Seller: {book.username}</h4>
                        </Link>
                    ))
                )}
            </div>

            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage} / {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
}

export default Recomandbook;
