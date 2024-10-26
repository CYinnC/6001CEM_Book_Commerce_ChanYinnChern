import React, { useState, useEffect } from "react";
import Logo from "../layout/images/logo.png"
import Addbook from "../layout/images/addbook.jpg"
import'./style.css';
import {Link} from 'react-router-dom'



function Myproduct() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newBook, setNewBook] = useState({ title: "", author: "", condition: "", description: "", image: null, 
        type: "selling", price: "" });
    const [books, setBooks] = useState([]);
  


    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };


  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
    
       
        setNewBook({ ...newBook, [name]: value });
    };
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewBook({ ...newBook, image: file }); // Store the file object
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('userId');
    
        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('title', newBook.title);
        formData.append('author', newBook.author);
        formData.append('condition', newBook.condition);
        formData.append('description', newBook.description);
        formData.append('image', newBook.image);
        formData.append('type', newBook.type);
    
        
        const priceToSubmit = newBook.type === "trading" ? "0.00" : newBook.price;
        formData.append('price', priceToSubmit);
    
        try {
            const response = await fetch('http://localhost:3001/api/books', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                const addedBook = await response.json();
                setBooks([...books, addedBook]);
                setNewBook({ title: "", author: "", condition: "", description: "", image: null, type: "selling", price: "" }); // Reset form
                setIsFormVisible(false);
            } else {
                console.error('Error adding book:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    



    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
    const userId = localStorage.getItem('userId');
    try {
        const response = await fetch(`http://localhost:3001/api/books?userId=${userId}`);
        console.log('Response:', response); 
        if (response.ok) {
            const data = await response.json();
            setBooks(data);
        } else {
            console.error('Error fetching books:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};



return(
<div className="background">
<div className="container">
    
{isFormVisible && <div className="backdrop" onClick={() => setIsFormVisible(false)} />}


  <div className="header">
  <div className="header_title"><button className="sidebar_toggle" onClick={toggleSidebar}><h1>≡</h1></button></div>
      <h1>Book Commerce<img src={Logo} alt="Logo" className="logo" /></h1></div>

<div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <button className="close_button" onClick={toggleSidebar}>X</button>
                <ul>
                    <li><Link to="/pages/home">Home</Link></li>
                    <li><Link to="/pages/myproduct">My Product</Link></li>
                    <li><Link to="/pages/home">Book Request</Link></li>
                    <li><Link to="/pages/aboutus">About Us</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                
                </ul>
     </div>
</div>



    
        {isFormVisible && (
            <div className="form_container">
            <form onSubmit={handleSubmit}>
    <h2>Add Book</h2>
    <input type="text" name="title" placeholder="Title" value={newBook.title} onChange={handleInputChange} required />
    <input type="text" name="author" placeholder="Author" value={newBook.author} onChange={handleInputChange} required />
    <input type="text" name="condition" placeholder="Condition" value={newBook.condition} onChange={handleInputChange} required />
    
    <input type="text" name="price" placeholder="Price" value={newBook.price} onChange={handleInputChange}

        required={newBook.type !== "trading"}
        disabled={newBook.type === "trading"} 

        style={{ backgroundColor: newBook.type === "trading" ? '#f0f0f0' : 'white' }}/>
    
    <textarea name="description" placeholder="Description" value={newBook.description} onChange={handleInputChange} required />
    <select name="type" value={newBook.type} onChange={handleInputChange}>
        <option value="selling">Sell</option>
        <option value="trading">Trade</option>
    </select>
    
    <input type="file" accept="image/*" onChange={handleImageChange} required />
    <button type="submit">Add Book</button>
    <button type="button" onClick={() => setIsFormVisible(false)}>Close</button>
    </form>

</div>
)}




    <div className="cards_container">
                           
        <div className="add_book_card">
            <div className="add_book_content">
                <img src={Addbook} alt="Addbook" className="addbook" />
                <div className="add_book_description">
                    <h1>My Product</h1>
                    <p><b>Selling your old book here on this page to help spread the love of book to more people and 
                        help make books more affortable to everyone, start by clicking add book below to get started.</b></p>
                    <button className="add_book_button" onClick={() => setIsFormVisible(true)}>Add Book +</button>
                </div>
            </div>
        </div>

        <div className="books_display_container">
                    {books.map((book, index) => (
                        <div className="book_card" key={index}>
                           <img src={book.image ? `http://localhost:3001/${book.image.replace('\\', '/')}` : "placeholder-image-url"} alt={book.title} />
                            <h3>{book.title}</h3>
                            <p><b>Author:</b> {book.author}</p>
                            <p><b>Condition:</b> {book.condition}</p>
                            <p><b>Description:</b> {book.description}</p>
                            <p className="book_price">{book.price === "0.00" ? "Up for trade" : `Price: RM${book.price}`}</p>
                        </div>
                    ))}
             </div>
            
        </div>
</div>

    );
}

export default Myproduct;