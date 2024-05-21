import React from 'react';
import { useNavigate } from 'react-router-dom';

function GameRoom({ roomName, roomId }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/game/${roomId}`);
    };

    return (
        <div className="game-room" onClick={handleClick}>
            {roomName}
        </div>
    );
}

export default GameRoom;
