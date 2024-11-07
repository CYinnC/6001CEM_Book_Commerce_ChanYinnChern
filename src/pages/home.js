import React, { useState, useEffect } from "react";
import Logo from "../layout/images/logo.png";
import Newbook from "../layout/images/recomand.jpg";
import './style.css';
import { Link } from 'react-router-dom';

function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [books, setBooks] = useState([]);
    const [acceptedBookIds, setAcceptedBookIds] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState("all");
    const [selectedGenre, setSelectedGenre] = useState("all");
    const booksPerPage = 8;

    useEffect(() => {
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
                setBooks(booksWithUsernames);
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

            if (!tradesResponse.ok || !purchasesResponse.ok) {
                throw new Error('Error fetching requests');
            }

            const trades = await tradesResponse.json();
            const purchases = await purchasesResponse.json();

            const acceptedTrades = trades.filter(trade => trade.status === 'accepted').map(trade => trade.book_id);
            const acceptedPurchases = purchases.filter(purchase => purchase.status === 'accepted').map(purchase => purchase.book_id);

            const combinedAcceptedIds = new Set([...acceptedTrades, ...acceptedPurchases]);
            setAcceptedBookIds(combinedAcceptedIds);
        } catch (error) {
            console.log('Error fetching accepted requests:', error);
        }
    };

    const sortedBooks = () => {
        let filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase())
        );


        filteredBooks = filteredBooks.filter(book => !acceptedBookIds.has(book.id));


        if (selectedGenre !== "all") {
            filteredBooks = filteredBooks.filter(book =>
                book.genres.toLowerCase() === selectedGenre
            );
        }

        switch (sortOption) {
            case "all":
                return filteredBooks.sort((a, b) => new Date(b.time) - new Date(a.time));
            case "oldest":
                return filteredBooks.sort((a, b) => new Date(a.time) - new Date(b.time));
            case "lowPrice":
                return filteredBooks.filter(book => parseFloat(book.price) > 0)
                    .sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            case "highPrice":
                return filteredBooks.filter(book => parseFloat(book.price) > 0)
                    .sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            case "tradeOnly":
                return filteredBooks.filter(book => parseFloat(book.price) === 0)
                    .sort((a, b) => new Date(b.time) - new Date(a.time));
            default:
                return filteredBooks;
        }
    };

    const totalPages = Math.ceil(sortedBooks().length / booksPerPage);
    const startIndex = (currentPage - 1) * booksPerPage;
    const currentBooks = sortedBooks().slice(startIndex, startIndex + booksPerPage);

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
                        <li><Link to="/pages/complaint">Complaint</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </div>
            </div>

            <div className="button_container">
                <Link to="/pages/recommendbook" className="new_book_button"><img src={Newbook} alt="newbook" /></Link>
            </div>

            <div className="subtitle"><h1>Enjoy Exploring all Second Handed Books Here!!</h1></div>

            <div className="search">
                <input type="text" placeholder="Search" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            <div className="sort_container">
                <label>Sort  :</label>
                <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="all">All</option>
                    <option value="oldest">Oldest to Newest</option>
                    <option value="lowPrice">Low Price to High Price</option>
                    <option value="highPrice">High Price to Low Price</option>
                    <option value="tradeOnly">Trade Only</option>
                </select>
            </div>

            <div className="filter_container">
                <label>Genre :</label>
                <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                    <option value="all">All</option>
                    <option value="fictional">Fiction</option>
                    <option value="nonfictional">Nonfiction</option>
                    <option value="educational">Educational</option>
                </select>
            </div>

            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage} / {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
            </div>

            <div className="home_display_container">
                {currentBooks.length === 0 ? (
                    <div className="no_result">
                        <h3>The book you are trying to search doesn't exist.</h3>
                    </div>
                ) : (
                    currentBooks.map((book, index) => (
                        <Link to={`/pages/bookdetail/${book.id}`} key={index} className="home_book_card">
                            <img src={book.image ? `http://localhost:3001/${book.image.replace('\\', '/')}` : "placeholder-image-url"} alt={book.title} />
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

export default Home;
