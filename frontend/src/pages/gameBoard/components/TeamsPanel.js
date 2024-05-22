import React from 'react';

const TeamPanel = ({ teams, onJoinTeam }) => (
    <div className="teams-panel">
        {teams.map((team) => (
            <div key={team.id} className="team-info">
                <h2>{team.name}</h2>
                <ul>
                    {Object.values(team.members).map((member) => (
                        <li key={member.id}>{member.username}</li>
                    ))}
                </ul>
                <button onClick={() => onJoinTeam(team.id)}>Join Team</button>
            </div>
        ))}
    </div>
);

export default TeamPanel;
