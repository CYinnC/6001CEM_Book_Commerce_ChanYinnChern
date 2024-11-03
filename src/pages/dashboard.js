import React, { useState, useEffect } from "react";
import Logo from "../layout/images/logo.png";
import './style.css';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [bookCounts, setBookCounts] = useState({ selling: 0, trading: 0 });
    const [users, setUsers] = useState([]);
    const [books, setBooks] = useState([]);
    
    useEffect(() => {
        fetch('http://localhost:3001/api/book-counts')
            .then(response => response.json())
            .then(data => setBookCounts(data))
            .catch(error => {
                console.error('Error fetching book counts:', error);
                setBookCounts({ selling: 0, trading: 0 });
            });

        fetchRecentUsers();
        fetchRecentBooks();
    }, []);

    const fetchRecentUsers = async () => {
        try {
            const response = await fetch('http://localhost:3001/users');
            if (response.ok) {
                const data = await response.json();
                
        
                const sortedUsers = data.sort((a, b) => b.id - a.id).slice(0, 5);
                setUsers(sortedUsers);
            } else {
                console.error('Error fetching users:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchRecentBooks = async () => { 
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
                setBooks(sortedBooks.slice(0, 5));
            } else {
                console.error('Error fetching books:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const graphData = [
        { name: 'Selling', count: bookCounts.selling || 0 },
        { name: 'Trading', count: bookCounts.trading || 0 },
    ];

    const downloadPDF = () => {
        html2canvas(document.querySelector("#chart")).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF();
            
            pdf.addImage(imgData, "PNG", 10, 10, 200, 50);
            pdf.save("chart.pdf");
        });
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
                        <li><Link to="/pages/useraccounts">User Accounts</Link></li>
                        <li><Link to="/logout">Logout</Link></li>
                    </ul>
                </div>

                <div className="book_counts">
                    <h2>Book being sold and trade on Book Commerce Live</h2>
                    <div id="chart" style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={graphData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="rgb(239, 208, 83)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <button onClick={downloadPDF} className="chart_download_button">Download Chart</button>
                </div>

                <div className="recent_activity">
                    <div className="tables_container">
                        <div className="recent_users">
                            <h1>Recently Registered Users</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.username}</td>
                                            <td>{user.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="recent_books">
                            <h1>Recently Added Books</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Seller</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.map(book => (
                                        <tr key={book.id}>
                                            <td>{book.id}</td>
                                            <td>{book.title}</td>
                                            <td>{book.username}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
