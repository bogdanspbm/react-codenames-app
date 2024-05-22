import React from 'react';

const GameGrid = ({ words }) => {
    return (
        <div className="game-grid">
            {words.map((word, index) => (
                <div key={index} className={`card team-${word.teamIndex}`}>
                    {word.word}
                </div>
            ))}
        </div>
    );
};

export default GameGrid;
