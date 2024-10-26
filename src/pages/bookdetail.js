import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './style.css';

const BookDetail = () => {
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formDetails, setFormDetails] = useState({});

    useEffect(() => {
        const fetchBookData = async (id) => {
            const response = await fetch(`http://localhost:3001/api/books/${id}`);
            if (!response.ok) {
                throw new Error('Could not fetch book details');
            }
            return response.json();
        };

        const fetchBookDetails = async () => {
            try {
                const response = await fetchBookData(bookId);
                setBook(response);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchBookDetails();
    }, [bookId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
       
        console.log('Image selected:', e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formDetails);
        setIsFormVisible(false);
     
    };

    if (!book) {
        return <div>No book details available.</div>;
    }

    return (
        <div className="background">
            <div className="container">
                {isFormVisible && <div className="backdrop" onClick={() => setIsFormVisible(false)} />}

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
                                <p className="book_price">{book.price === "0.00" ? "Trade Only" : `Price: RM${book.price}`}</p>
                            </div>
                            <button className="purchase_button" onClick={() => setIsFormVisible(true)}>
                                <b>Request {book.price === "0.00" ? 'Trade' : 'Purchase'}</b>
                            </button>
                        </div>
                    </div>
                </div>

                {isFormVisible && (
                    <div className="form_container">
                        <form onSubmit={handleSubmit}>
                            <h2>{book.price === "0.00" ? 'Request to Trade Book' : 'Request to Purchase Book'}</h2>

                            <input type="text" name="phoneNumber" placeholder="Phone Number" 
                                   value={formDetails.phoneNumber} onChange={handleInputChange} required />
                            <input type="text" name="shippingAddress" placeholder="Shipping Address" 
                                   value={formDetails.shippingAddress} onChange={handleInputChange} required />
                            
                            {book.price === "0.00" && (
                                <>
                                    <input type="text" name="booktitle" placeholder="Book Title" 
                                           value={formDetails.title} onChange={handleInputChange} required />
                                    <input type="text" name="bookcondition" placeholder="Book Condition" 
                                           value={formDetails.condition} onChange={handleInputChange} required />
                                    <textarea name="description" placeholder="Description" 
                                              value={formDetails.description} onChange={handleInputChange} required />
                                    <input type="file" accept="image/*" onChange={handleImageChange} required />
                                </>
                            )}

                            <button type="submit">{book.price === "0.00" ? 'Trade' : 'Purchase'}</button>
                            <button type="button" onClick={() => setIsFormVisible(false)}>Close</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookDetail;
