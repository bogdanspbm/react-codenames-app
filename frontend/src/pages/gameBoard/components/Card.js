import React from 'react';

function Card({ word, teamIndex }) {
    return (
        <div className={`card team-${teamIndex}`}>
            <p>{word}</p>
        </div>
    );
}

export default Card;
