import React from 'react';
import GameBoardContent from './components/GameBoardContent';
import '../../App.css';
import './styles/Board.css'

function GameBoard({username}) {
    return (
        <div className="container">
            <GameBoardContent username={username} />
        </div>
    );
}

export default GameBoard;
