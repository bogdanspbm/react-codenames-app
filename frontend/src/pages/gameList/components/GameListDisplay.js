import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameRoom from './GameRoom';

function GameListDisplay() {
    const [rooms, setRooms] = useState([]);
    const [filter, setFilter] = useState("");


    useEffect(() => {
        fetch('/api/v1/public/rooms')
            .then(response => response.json())
            .then(data => setRooms(data));
    }, []);

    return (
        <div className="vertical-container">
            <input onChange={(event) => {
               setFilter(event.target.value);
            }} type="text" placeholder="Search by room name" className="search-input" />
            <div className="game-list">
                {rooms.map(room => (
                    (!filter || room.name.toLowerCase().includes(filter.toLowerCase())) && <GameRoom
                        key={room.id}
                        roomName={room.name}
                        roomId={room.id}
                        language={room.language}
                        teamCount={room.teamCount}
                    />
                ))}
            </div>
        </div>
    );
}

export default GameListDisplay;
