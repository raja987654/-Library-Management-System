const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Configuration CORS plus détaillée
app.use(cors({
    origin: 'http://localhost:3000', // Remplacez par l'URL de votre frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration MongoDB - Supprimez les options dépréciées
mongoose.connect('mongodb://localhost:27017/library')
    .then(() => {
        console.log('Connecté à MongoDB');
    })
    .catch(err => {
        console.error('Erreur de connexion MongoDB:', err);
    });

// Configuration des routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/book');

// Middleware pour les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Une erreur est survenue',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    console.log(`API accessible à http://localhost:${PORT}`);
});