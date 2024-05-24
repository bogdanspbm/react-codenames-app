import React from 'react';
import CreateGameForm from './components/CreateGameForm';
import '../../App.css';
import './styles/CreateGame.css';

function CreateGame() {
    return (
        <div className="create-game-container">
            <h1>Create Game</h1>
            <CreateGameForm />
        </div>
    );
}

export default CreateGame;
