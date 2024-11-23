import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css'; 

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('client');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [showRegister, setShowRegister] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            navigate(res.data.role === 'admin' ? '/dashboard' : '/client-dashboard');
        } catch (err) {
            setError('Nom d’utilisateur ou mot de passe incorrect.');
        }
    };

    return (
        <div className="auth-container">
            {/* Cercle blanc avec message de bienvenue */}
            <div className="welcome-circle">
                <h2>Bonjour, vous êtes les bienvenus !</h2>
            </div>

            <div className="form-section">
                {!showRegister ? (
                    <div className="login-form">
                        <h2 className="text-center">Connexion</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nom d'utilisateur"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block">Se connecter</button>
                        </form>
                        {error && <p className="text-danger mt-3">{error}</p>}
                        <p className="text-center mt-3">
                            Pas encore inscrit ? <span onClick={() => setShowRegister(true)} className="link">S'inscrire</span>
                        </p>
                    </div>
                ) : (
                    <RegisterForm setShowRegister={setShowRegister} />
                )}
            </div>
        </div>
    );
};

const RegisterForm = ({ setShowRegister }) => {
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [role, setRole] = useState('client');
    const [error, setError] = useState('');

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/register', { username: registerUsername, password: registerPassword, role });
            alert('Inscription réussie !');
            setShowRegister(false);
        } catch (err) {
            setError('Erreur lors de l\'inscription. Vérifiez si le nom d’utilisateur existe déjà.');
        }
    };

    return (
        <div className="register-form">
            <h2 className="text-center">Inscription</h2>
            <form onSubmit={handleRegisterSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nom d'utilisateur"
                        value={registerUsername}
                        onChange={(e) => setRegisterUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Mot de passe"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="client">Client</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary btn-block">S'inscrire</button>
                <p className="text-center mt-3">
                    Déjà inscrit ? <span onClick={() => setShowRegister(false)} className="link">Se connecter</span>
                </p>
                {error && <p className="text-danger mt-3">{error}</p>}
            </form>
        </div>
    );
};

export default Login;
