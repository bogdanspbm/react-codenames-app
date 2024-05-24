import React from 'react';
import '../styles/EndGamePopup.css';

function EndGamePopup() {

    return (
        <div className="end-game-background">
            <div className="end-game-popup">
                <h1>End Game</h1>
                <div onClick={ () => {window.location.assign('/')}} className="popup-button-blue">Exit</div>
            </div>
        </div>

    );

}

export default EndGamePopup;
