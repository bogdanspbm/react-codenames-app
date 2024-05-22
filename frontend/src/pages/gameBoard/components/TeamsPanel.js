import React from 'react';
import TeamInfo from './TeamInfo';

function TeamsPanel({ teams, spectators, onJoinTeam }) {
    return (
        <div className="teams-panel">
            {teams.map((team, index) => (
                <TeamInfo key={index} team={team} onJoinTeam={onJoinTeam} />
            ))}
            <div className="team-info">
                <h3>Spectators</h3>
                <p>{Object.values(spectators).map(spectator => spectator.username).join(', ')}</p>
                <button onClick={() => onJoinTeam(-1)}>Join</button>
            </div>
        </div>
    );
}

export default TeamsPanel;
