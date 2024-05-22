import React from 'react';
import TeamInfo from './TeamInfo';

function TeamsPanel({ teams }) {
    return (
        <div className="teams-panel">
            {teams.map((team, index) => (
                <TeamInfo key={index} team={team} />
            ))}
        </div>
    );
}

export default TeamsPanel;
