import React, { useState } from 'react';
import Cookies from 'js-cookie';

function AuthForm({ isLoggedIn, username, onLogin, onLogout }) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isRegister, setIsRegister] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isRegister ? '/api/v1/public/register' : '/api/v1/public/login';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const result = await response.json();
            if (!isRegister) {
                // При авторизации результатом будет объект с токеном
                const token = result.token;
                Cookies.set('token', token, { expires: 7 });
                Cookies.set('username', formData.username,{ expires: 7 } );
                onLogin(formData.username);
            } else {
                // При регистрации результатом будет объект пользователя
                onLogin(result.username);
            }
        } else {
            console.error('Error:', response.statusText);
        }
    };

    const toggleForm = () => {
        setIsRegister(!isRegister);
    };

    return (
        <div className="auth-form">
            {isLoggedIn ? (
                <div>
                    <p>Welcome, {username}</p>
                    <button onClick={() => {
                        onLogout();
                        Cookies.remove('token');
                    }}>Logout</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h3>{isRegister ? 'Register' : 'Login'}</h3>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
                    <button type="button" onClick={toggleForm}>
                        {isRegister ? 'Switch to Login' : 'Switch to Register'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default AuthForm;
