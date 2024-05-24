import React from 'react';
import GameListDisplay from './components/GameListDisplay';
import '../../App.css';
import './styles/GameList.css';
import {useNavigate} from "react-router-dom";

function GameList() {
    const navigate = useNavigate();

    return (
        <div className="game-list-container">
            <h1>Game List</h1>
            <GameListDisplay/>
            <div className="button-back" onClick={() => navigate(-1)}>Back</div>
        </div>
    );
}

export default GameList;
