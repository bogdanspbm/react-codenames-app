import React from 'react';
import { Link } from 'react-router-dom';

function MainMenuOptions() {
    return (
        <ul>
            <li><Link to="/create">Create Game</Link></li>
            <li><Link to="/games">Join Game</Link></li>
            <li><Link to="/leaders">Leaderboards</Link></li>
        </ul>
    );
}

export default MainMenuOptions;
