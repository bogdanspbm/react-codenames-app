import React from 'react';
import TeamsPanel from './components/TeamsPanel';
import Chat from './components/Chat';
import Card from './components/Card';
import '../../App.css';

function GameBoard() {
    const cards = [
        { word: 'Word A', id: 1 },
        { word: 'Word B', id: 2 },
        { word: 'Word C', id: 3 },
        { word: 'Word D', id: 4 },
        { word: 'Word E', id: 5 },
        { word: 'Word F', id: 6 },
        { word: 'Word G', id: 7 },
        { word: 'Word H', id: 8 },
        { word: 'Word I', id: 9 },
        { word: 'Word J', id: 10 },
        { word: 'Word K', id: 11 },
        { word: 'Word L', id: 12 },
    ];

    return (
        <div className="container">
            <TeamsPanel />
            <div className="cards">
                {cards.map(card => (
                    <Card key={card.id} word={card.word} />
                ))}
            </div>
            <Chat />
        </div>
    );
}

export default GameBoard;
