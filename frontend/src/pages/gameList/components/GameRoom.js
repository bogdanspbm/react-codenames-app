import React from 'react';
import { useNavigate } from 'react-router-dom';

function GameRoom({ roomName, roomId, language, teamCount }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/game/${roomId}`);
    };

    return (
        <div className="game-room" onClick={handleClick}>
            <h2>{roomName}</h2>
            <p>Language: {language}</p>
            <p>Teams: {teamCount}</p>
        </div>
    );
}

export default GameRoom;
