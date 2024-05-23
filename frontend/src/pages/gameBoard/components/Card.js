import React from 'react';

function Card({isOwner, isOwnerTurn, word, teamIndex, votes, onVote, isSelected = false}) {
    const handleVote = () => {
        if (onVote) {
            onVote(word);
        }
    };

    const colorMap = {
        default: "#fafafa",
        0: "#73d13d",
        1: "#ff4d4f",
        2: "#4096ff",
        3: "#ffec3d",
        4: "#9254de",
        5: "#262626"
    }

    const borderColorMap = {
        default: "#d9d9d9",
        0: "#52c41a",
        1: "#f5222d",
        2: "#1677ff",
        3: "#fadb14",
        4: "#722ed1",
        5: "#141414"
    }

    if (isOwner || isSelected) {
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
