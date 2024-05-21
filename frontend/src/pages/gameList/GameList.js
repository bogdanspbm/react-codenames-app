import React from 'react';
import GameRoom from './components/GameRoom';
import '../../App.css';

function GameList() {
    const rooms = [
        { name: 'Room 1', id: 1 },
        { name: 'Room 2', id: 2 },
        { name: 'Room 3', id: 3 },
        { name: 'Room 4', id: 4 },
    ];

    return (
        <div className="container">
            <h1>Game List</h1>
            <input type="text" placeholder="Search by room name" className="search-input" />
            <div className="game-grid">
                {rooms.map(room => (
                    <GameRoom key={room.id} roomName={room.name} roomId={room.id} />
                ))}
            </div>
        </div>
    );
}

export default GameList;
