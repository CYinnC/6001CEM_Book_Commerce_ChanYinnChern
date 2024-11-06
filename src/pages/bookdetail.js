import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './style.css';

const BookDetail = () => {
    const { bookId } = useParams();
    const [book, setBook] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formDetails, setFormDetails] = useState({
        phoneNumber: '',
        meetupLocation: '',
        title: '',
        bookCondition: '',
        description: '',
        shippingAddress: '',
    });
    const [notification, setNotification] = useState({ message: '', isVisible: false });

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/books/${bookId}`);
                if (!response.ok) throw new Error('Could not fetch book details');
                const data = await response.json();
                setBook(data);
            } catch (error) {
                console.error('Error fetching book:', error);
            }
        };
        fetchBookDetails();
    }, [bookId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const buyerId = localStorage.getItem('userId');
        const sellerId = book.user_id;

        try {
            let response;

            if (book.price !== "0.00") {
                const purchaseResponse = await fetch(`http://localhost:3001/api/purchases`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        bookId: book.id,
                        buyerId,
                        phoneNumber: formDetails.phoneNumber,
                        shippingAddress: formDetails.shippingAddress,
                        sellerId,
                        status: 'pending',
                    }),
                });

                if (!purchaseResponse.ok) throw new Error('Failed to log purchase');
                response = await purchaseResponse.json();
            } else {
               
                response = await fetch(`http://localhost:3001/api/trades`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        bookId: book.id,
                        phoneNumber: formDetails.phoneNumber,
                        meetupLocation: formDetails.meetupLocation,
                        buyerId,
                        sellerId,
                        title: formDetails.title,
                        bookCondition: formDetails.bookCondition,
                        description: formDetails.description,
                    }),
                });

                if (!response.ok) throw new Error('Failed to send trade request');
                response = await response.json();
            }

            setIsFormVisible(false);
            setFormDetails({
                phoneNumber: '',
                meetupLocation: '',
                title: '',
                bookCondition: '',
                description: '',
                shippingAddress: '',
            });

            setNotification({ message: 'Request has been made. Wait for the seller to approve.', isVisible: true });
            setTimeout(() => setNotification(prev => ({ ...prev, isVisible: false })), 5000);
        } catch (error) {
            console.error('Error:', error);
            setNotification({ message: 'An error occurred while making the request.', isVisible: true });
            setTimeout(() => setNotification(prev => ({ ...prev, isVisible: false })), 5000);
        }
    };

    if (!book) {
        return <div>No book details available.</div>;
    }


    
/*==================================================================================================================== */

    return (
        <div className="background">
            <div className="container">
                {notification.isVisible && (
                    <div className="notification show">
                        {notification.message}
                    </div>
                )}
                {isFormVisible && <div className="backdrop" onClick={() => setIsFormVisible(false)} />}
                <div className="back_button_container">
                    <button onClick={() => window.history.back()} className="back_button">Back</button>
                </div>

                <div className="book_detail_container">
                    <div className="book_detail_content">
                        <div className="book_image">
                            <img src={book.image ? `http://localhost:3001/${book.image.replace('\\', '/')}` : "placeholder-image-url"} alt={book.title} />
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
                            <h2>{book.price === "0.00" ? 'Trade Book' : 'Purchase Book'}</h2>
                            <input type="text" name="phoneNumber" placeholder="Phone Number" value={formDetails.phoneNumber} onChange={handleInputChange} required />
                            
                            {book.price === "0.00" ? ( 
                                <>
                                    <input type="text" name="meetupLocation" placeholder="Meet Up Location" value={formDetails.meetupLocation} onChange={handleInputChange} required />
                                    <input type="text" name="title" placeholder="Book Title" value={formDetails.title} onChange={handleInputChange} required />
                                    <input type="text" name="bookCondition" placeholder="Book Condition" value={formDetails.bookCondition} onChange={handleInputChange} required />
                                    <textarea name="description" placeholder="Description" value={formDetails.description} onChange={handleInputChange} required />
                                </>
                            ) : ( 
                                <>
                                    <input type="text" name="shippingAddress" placeholder="Shipping Address" value={formDetails.shippingAddress} onChange={handleInputChange} required />
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
