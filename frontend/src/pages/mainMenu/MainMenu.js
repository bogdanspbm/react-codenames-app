import React, { useState, useEffect } from 'react';
import MainMenuOptions from './components/MainMenuOptions';
import AuthForm from './components/AuthForm';
import Cookies from 'js-cookie';
import '../../App.css';

function MainMenu() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            // Отправляем запрос на сервер для валидации токена и получения имени пользователя
            fetch('/api/v1/private/validate', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Token validation failed');
                    }
                })
                .then(data => {
                    setIsLoggedIn(true);
                    setUsername(data.username);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }, []);

    const handleLogin = (username) => {
        setIsLoggedIn(true);
        setUsername(username);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUsername('');
        Cookies.remove('token');
    };

    return (
        <div className="container">
            <div className="panel">
                <h1>Main Menu</h1>
                <div className="main-menu">
                    <MainMenuOptions />
                </div>
            </div>
            <div className="auth-container">
                <AuthForm
                    isLoggedIn={isLoggedIn}
                    username={username}
                    onLogin={handleLogin}
                    onLogout={handleLogout}
                />
            </div>
        </div>
    );
}

export default MainMenu;
