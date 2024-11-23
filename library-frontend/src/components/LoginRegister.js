import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Auth.css'; // CSS personnalisé supplémentaire

const LoginRegister = () => {
    const [isRegister, setIsRegister] = useState(false); // Gère le basculement entre connexion et inscription
    const navigate = useNavigate();

    const handleLogin = async (username, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            navigate(res.data.role === 'admin' ? '/dashboard' : '/client-dashboard');
        } catch (err) {
            alert('Nom d’utilisateur ou mot de passe incorrect.');
        }
    };

    const handleRegister = async (username, password, role) => {
        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, password, role });
            alert('Inscription réussie !');
            setIsRegister(false); // Retour à la connexion après inscription
        } catch (err) {
            alert('Erreur lors de l’inscription. Essayez un autre nom d’utilisateur.');
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card p-5 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
                <h2 className="text-center mb-4">{isRegister ? "S'inscrire" : 'Se connecter'}</h2>
                {isRegister ? (
                    <RegisterForm onRegister={handleRegister} setIsRegister={setIsRegister} />
                ) : (
                    <LoginForm onLogin={handleLogin} setIsRegister={setIsRegister} />
                )}
            </div>
        </div>
    );
};

const LoginForm = ({ onLogin, setIsRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(username, password);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Nom d'utilisateur</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Entrer votre nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Mot de passe</label>
                <input
                    type="password"
                    className="form-control"
                    placeholder="Entrer votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
                Connexion
            </button>
            <p className="text-center">
                Pas encore inscrit ?{' '}
                <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => setIsRegister(true)}>
                    Créez un compte
                </span>
            </p>
        </form>
    );
};

const RegisterForm = ({ onRegister, setIsRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client');

    const handleSubmit = (e) => {
        e.preventDefault();
        onRegister(username, password, role);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Nom d'utilisateur</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Choisir un nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Mot de passe</label>
                <input
                    type="password"
                    className="form-control"
                    placeholder="Créer un mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Rôle</label>
                <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <button type="submit" className="btn btn-success w-100 mb-3">
                Inscription
            </button>
            <p className="text-center">
                Déjà inscrit ?{' '}
                <span className="text-primary" style={{ cursor: 'pointer' }} onClick={() => setIsRegister(false)}>
                    Connectez-vous
                </span>
            </p>
        </form>
    );
};

export default LoginRegister;
