import React from 'react';
import GameListDisplay from './components/GameListDisplay';
import '../../App.css';

function GameList() {
    return (
        <div className="container">
            <h1>Game List</h1>
            <GameListDisplay />
        </div>
    );
}

export default GameList;
