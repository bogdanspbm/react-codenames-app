import React from 'react';

const TeamPanel = ({ teams, spectators, onJoinTeam }) => (
    <div className="teams-panel">
        {teams.map((team) => (
            <div key={team.id} className="team-info">
                <h2>{team.name}</h2>
                <ul>
                    {Object.values(team.members).map((member) => (
                        <li key={member.id}>{member.username}</li>
                    ))}
                </ul>
                <button className="team-button" onClick={() => onJoinTeam(team.id)}>Join Team</button>
            </div>
        ))}
        <div key="spectators" className="team-info">
            <h2>Spectators</h2>
            <ul>
                {Object.values(spectators).map((spectator) => (
                    <li key={spectator.id}>{spectator.username}</li>
                ))}
            </ul>
            <button className="team-button" onClick={() => onJoinTeam(-1)}>Join Spectators</button>
        </div>
    </div>
);

export default TeamPanel;
