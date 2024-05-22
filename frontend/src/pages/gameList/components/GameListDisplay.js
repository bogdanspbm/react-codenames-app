import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameRoom from './GameRoom';

function GameListDisplay() {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/v1/public/rooms')
            .then(response => response.json())
            .then(data => setRooms(data));
    }, []);

    return (
        <div>
            <input type="text" placeholder="Search by room name" className="search-input" />
            <div className="game-grid">
                {rooms.map(room => (
                    <GameRoom
                        key={room.id}
                        roomName={room.name}
                        roomId={room.id}
                        language={room.language}
                        teamCount={room.teamCount}
                    />
                ))}
            </div>
            <button type="button" onClick={() => navigate(-1)}>Back</button>
        </div>
    );
}

export default GameListDisplay;
