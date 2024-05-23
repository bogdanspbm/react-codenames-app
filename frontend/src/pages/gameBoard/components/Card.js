import React from 'react';

function Card({started = false, colorMap, borderColorMap, isOwner, isOwnerTurn, word, teamIndex, votes, onVote, isSelected = false}) {
    const handleVote = () => {
        if (onVote) {
            onVote(word);
        }
    };


    if (started && (isOwner || isSelected)) {
        return (
            <div className={`card`} style={{color: "white", background : colorMap[teamIndex], border: `1px solid ${borderColorMap[teamIndex]}`}}>
                <p>{word}</p>
                {votes !== undefined && <p>Votes: {votes}</p>}
            </div>
        );
    } else {
        return (
            <div className={isOwnerTurn ? `card button-disabled` : `card button-enabled`} onClick={handleVote}>
                <p>{word}</p>
                {votes !== undefined && <p>Votes: {votes}</p>}
            </div>
        );
    }
}

export default Card;
