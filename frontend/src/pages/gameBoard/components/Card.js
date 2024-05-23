import React from 'react';

function Card({started = false, colorMap, borderColorMap, isOwner, isOwnerTurn, word, teamIndex, votes, onVote, isSelected = false}) {
    const handleVote = () => {
        if (onVote) {
            onVote(word);
        }
    };


    if ( started && (isOwner || isSelected)) {
        return (
            <div className={`card`} style={{
                color: "white",
                background: colorMap[teamIndex],
                border: `1px solid ${borderColorMap[teamIndex]}`
            }}>
                <div className="card-text">{word}</div>
                {votes !== undefined && <div className="card-votes">0</div>}
            </div>
        );
    } else {
        return (
            <div className={isOwnerTurn ? `card button-disabled` : `card button-enabled`} onClick={handleVote}>
                <div className="card-text">{word}</div>
                {votes !== undefined && <div className="card-votes">{votes.length}</div>}
            </div>
        );
    }
}

export default Card;
