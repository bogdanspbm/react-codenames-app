import React from 'react';
import Card from './Card';

const GameGrid = ({ words, selectedWords, votesMap, isOwnerTurn, isOwner, onVote }) => {
    return (
        <div className="game-grid">
            {words.map((wordObj, index) => (
                <Card
                    isOwner = {isOwner}
                    isOwnerTurn = {isOwnerTurn}
                    isSelected={selectedWords[wordObj.word]}
                    key={index}
                    word={wordObj.word}
                    teamIndex={wordObj.teamIndex}
                    votes={votesMap[wordObj.word]}
                    onVote={onVote}
                />
            ))}
        </div>
    );
};

export default GameGrid;
