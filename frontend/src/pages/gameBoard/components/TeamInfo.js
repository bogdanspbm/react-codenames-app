import React from 'react';

function TeamInfo({ teamName, leaderName, color }) {
    return (
        <div className={`team-info ${color}`}>
            <div className="team-header">{teamName}</div>
            <div>{leaderName}</div>
            {/* Дополнительная информация о команде */}
        </div>
    );
}

export default TeamInfo;
