import React from 'react';
import CreateGameForm from './components/CreateGameForm';
import '../../App.css';

function CreateGame() {
    return (
        <div className="container">
            <h1>Create Game</h1>
            <CreateGameForm />
        </div>
    );
}

export default CreateGame;
