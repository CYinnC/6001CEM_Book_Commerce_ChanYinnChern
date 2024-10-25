import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './style.css';

const BookDetail = () => {
    const { bookId } = useParams();
    const [book, setBook] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await fetchBookData(bookId);
                if (response) {
                    setBook(response); 
                } else {
                    console.error('Error fetching book details: No response');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchBookDetails();
    }, [bookId]);

    const fetchBookData = async (id) => {
        const response = await fetch(`http://localhost:3001/api/books/${id}`);
        if (!response.ok) {
            throw new Error('Could not fetch book details');
        }
        return response.json(); 
    };

    if (!book) {
        return <div>No book details available.</div>;
    }

    return (
        <div className="background">
            <div className="container">

            <div className="back_button_container">
                <button onClick={() => window.history.back()} className="back_button">Back</button>
            </div>

                <div className="book_detail_container">
                    <div className="book_detail_content">
                        <div className="book_image">
                            <img
                                src={book.image ? `http://localhost:3001/${book.image.replace('\\', '/')}` : "placeholder-image-url"}
                                alt={book.title}
                            />
                        </div>
                        <div className="book_info">
                            <h1 className="book_title">{book.title}</h1>
                            <div className='details_container'>
                                <p className="book_author"><b>Author:</b> {book.author}</p>
                                <p className="book_condition"><b>Condition:</b> {book.condition}</p>
                                <p className="book_description"><b>Description:</b> {book.description}</p>
                                <p className="book_seller"><b>Seller:</b> {book.username}</p>
                                <p className="book_price">
                                    {book.price === "0.00" ? "Trade Only" : `Price: RM${book.price}`}</p>
                            </div>
                            <button className="purchase_button"><b>Purchase</b></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;
