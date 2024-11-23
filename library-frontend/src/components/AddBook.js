import React, { useState } from 'react';
import axios from 'axios';

const AddBook = () => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState(null);
    const [pdf, setPdf] = useState(null);
    const [alert, setAlert] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAlert(null);

        const token = localStorage.getItem('token');
        if (!token) {
            setAlert({ type: 'danger', message: 'Veuillez vous connecter pour ajouter un livre.' });
            setIsLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('author', author);
            formData.append('description', description);
            formData.append('price', price);
            if (image) formData.append('image', image);
            if (pdf) formData.append('pdf', pdf);

            await axios.post(
                'http://localhost:5000/api/books',
                formData,
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    } 
                }
            );

            setAlert({ type: 'success', message: 'Livre ajouté avec succès !' });
            // Reset form
            setTitle('');
            setAuthor('');
            setDescription('');
            setPrice('');
            setImage(null);
            setPdf(null);
        } catch (error) {
            console.error('Erreur détaillée:', error.response?.data || error.message);
            setAlert({ 
                type: 'danger', 
                message: `Erreur lors de l'ajout du livre: ${error.response?.data?.message || error.message}` 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Ajouter un livre</h2>
            {alert && (
                <div className={`alert alert-${alert.type} mt-4`} role="alert">
                    {alert.message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="form-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Titre"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Auteur"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <textarea
                        className="form-control"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Prix"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Image du livre</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/jpeg,image/png"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Fichier PDF</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="application/pdf"
                        onChange={(e) => setPdf(e.target.files[0])}
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                    {isLoading ? 'Ajout en cours...' : 'Ajouter'}
                </button>
            </form>
        </div>
    );
};

export default AddBook;