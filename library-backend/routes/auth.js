const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Modèle utilisateur
const router = express.Router();

// Middleware de vérification du token JWT
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Aucun token fourni' });

    const bearerToken = token.split(' ');
    if (bearerToken.length !== 2 || bearerToken[0] !== 'Bearer') {
        return res.status(400).json({ message: 'Format du token incorrect' });
    }

    jwt.verify(bearerToken[1], 'votre_clé_secrète', (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token invalide', error: err.message });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

// Route de connexion
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Nom d’utilisateur ou mot de passe incorrect' });

        const token = jwt.sign({ id: user._id, role: user.role }, 'votre_clé_secrète', { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route d'inscription
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const newUser = new User({ username, password, role });
        await newUser.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de l’inscription' });
    }
});

// Exemple de route protégée accessible uniquement aux administrateurs
router.get('/protected', verifyToken, (req, res) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Accès interdit. Rôle admin requis.' });
    }
    res.status(200).json({ message: 'Accès autorisé' });
});

module.exports = router;
