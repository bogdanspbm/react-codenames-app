import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function CreateGameForm() {
    const [formData, setFormData] = useState({ name: '', teamCount: 2, language: 'en', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = Cookies.get('token');
        const response = await fetch('/api/v1/private/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const result = await response.json();
            navigate(`/game/${result.id}`);
        } else {
            console.error('Error:', response.statusText);
        }
    };

    return (
        <form className="create-game-form" onSubmit={handleSubmit}>
            <div>
                <label>Room Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Number of Teams:</label>
                <input
                    type="number"
                    name="teamCount"
                    value={formData.teamCount}
                    min="2"
                    max="5"
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Language:</label>
                <select name="language" value={formData.language} onChange={handleChange} required>
                    <option value="en">English</option>
                    <option value="ru">Russian</option>
                    <option value="de">German</option>
                </select>
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Create</button>
            <button className="button-back" type="button" onClick={() => navigate(-1)}>Back</button>
        </form>
    );
}

export default CreateGameForm;
