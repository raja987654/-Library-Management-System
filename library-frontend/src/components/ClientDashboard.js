import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardBody, CardTitle, CardText, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom'; 

const ClientDashboard = () => {
    const [books, setBooks] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [searchAuthor, setSearchAuthor] = useState('');
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchBooks = async () => {
            const res = await axios.get('http://localhost:5000/api/books', {
                params: { title: searchTitle, author: searchAuthor }
            });
            setBooks(res.data);
        };
        fetchBooks();
    }, [searchTitle, searchAuthor]); 

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/'); 
    };

    const handleBuyBook = (bookId) => {
        navigate(`/payment/${bookId}`); 
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center text-white font-weight-bold">Livres Disponibles</h2>
            <button onClick={handleLogout} className="btn btn-danger mb-4">Déconnexion</button> 
            <Input
                type="text"
                placeholder="Rechercher par titre"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="mb-3"
            />
            <Input
                type="text"
                placeholder="Rechercher par auteur"
                value={searchAuthor}
                onChange={(e) => setSearchAuthor(e.target.value)}
                className="mb-3"
            />
            <h3 className="text-white font-weight-bold">Liste des livres</h3>
            <div className="row">
                {books.map(book => (
                    <div className="col-md-4 mb-4" key={book._id}>
                        <Card>
                            <CardBody>
                                <CardTitle tag="h5">{book.title}</CardTitle>
                                <CardText>Auteur: {book.author}</CardText>
                                
                                {/* Affichage de l'image */}
                                {book.image && (
                                    <img 
                                        src={book.image} // Chemin de l'image
                                        alt={book.title}
                                        className="img-fluid mb-2"
                                        style={{ width: '100px', height: 'auto' }} // Ajustez la taille ici
                                    />
                                )}
                                
                                <CardText>Description: {book.description}</CardText>
                                <CardText>Prix: ${book.price}</CardText>
                                {/* Bouton Acheter */}
                                <Button onClick={() => handleBuyBook(book._id)} color="primary">
                                    Acheter
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientDashboard;
