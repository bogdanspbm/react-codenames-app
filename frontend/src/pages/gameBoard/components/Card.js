import React from 'react';

function Card({isOwner, isOwnerTurn, word, teamIndex, votes, onVote, isSelected = false}) {
    const handleVote = () => {
        if (onVote) {
            onVote(word);
        }
    };

    const colorMap = {
        0: "#d9f7be",
        1: "#ffccc7",
        2: "#bae0ff",
        3: "#ffffb8",
        4: "#efdbff"
    }

    const borderColorMap = {
        0: "#52c41a",
        1: "#f5222d",
        2: "#1677ff",
        3: "#fadb14",
        4: "#722ed1"
    }

    if (isOwner || isSelected) {
        return (
            <div className={`card`} style={{background : colorMap[teamIndex], border: `1px solid ${borderColorMap[teamIndex]}`}}>
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
