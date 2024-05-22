import React from 'react';

function TeamInfo({ team }) {
    return (
        <div className="team-info">
            <h3>{team.name}</h3>
            <p>Score: {team.score}</p>
        </div>
    );
}

export default TeamInfo;
