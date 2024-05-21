import React, { useState } from 'react';

function CreateGameForm() {
    const [roomName, setRoomName] = useState('');
    const [teamCount, setTeamCount] = useState(2);
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Логика создания комнаты
        console.log({ roomName, teamCount, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Room Name:</label>
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
            </div>
            <div>
                <label>Number of Teams:</label>
                <input
                    type="number"
                    value={teamCount}
                    min="2"
                    max="5"
                    onChange={(e) => setTeamCount(e.target.value)}
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">Create</button>
        </form>
    );
}

export default CreateGameForm;
