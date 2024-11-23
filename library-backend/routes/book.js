const express = require('express');
const Book = require('../models/Book');
const jwt = require('jsonwebtoken');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configuration de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'image') {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Le fichier doit être une image'), false);
            }
        } else if (file.fieldname === 'pdf') {
            if (file.mimetype !== 'application/pdf') {
                return cb(new Error('Le fichier doit être un PDF'), false);
            }
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// Middleware de vérification du token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token non fourni' });

    const bearerToken = token.split(' ');
    if (bearerToken.length !== 2 || bearerToken[0] !== 'Bearer') {
        return res.status(400).json({ message: 'Format du token incorrect' });
    }

    jwt.verify(bearerToken[1], 'votre_clé_secrète', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token invalide' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

// Route POST : Ajouter un livre avec photo et PDF
router.post('/', verifyToken, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 }
]), async (req, res) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Accès interdit. Rôle admin requis.' });
    }

    try {
        const { title, author, description, price } = req.body;

        if (!title || !author || !description || !price) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
        }

        const newBook = new Book({
            title,
            author,
            description,
            price: Number(price),
            image: req.files['image'] ? req.files['image'][0].path : null,
            pdf: req.files['pdf'] ? req.files['pdf'][0].path : null,
        });

        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Erreur lors de l\'ajout du livre:', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du livre', error: error.message });
    }
});

// Route GET : Récupérer tous les livres ou par titre
// Route GET : Récupérer tous les livres ou par titre
router.get('/', async (req, res) => {
    const { title } = req.query;
    try {
        const query = title ? { title: { $regex: title, $options: 'i' } } : {};
        const books = await Book.find(query);
        
        // Retourner le chemin complet pour chaque livre
        const booksWithImagePath = books.map(book => ({
            ...book.toObject(),
            image: book.image ? `http://localhost:5000/${book.image}` : null // Assurez-vous que le chemin est correct
        }));

        res.status(200).json(booksWithImagePath);
    } catch (error) {
        console.error('Erreur lors de la récupération des livres:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des livres' });
    }
});


// Route DELETE : Supprimer un livre (réservée aux admins)
router.delete('/:id', verifyToken, async (req, res) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Accès interdit. Rôle admin requis.' });
    }

    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }
        res.status(200).json({ message: 'Livre supprimé avec succès' });
    } catch (error) {
        console.error('Erreur serveur:', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du livre' });
    }
});


module.exports = router;
