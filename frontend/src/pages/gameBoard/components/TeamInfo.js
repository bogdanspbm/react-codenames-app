import React from 'react';

function TeamInfo({ team, onJoinTeam }) {
    return (
        <div className="team-info">
            <h3>{team.name}</h3>
            <p>Owner: {team.owner ? team.owner.username : "None"}</p>
            <p>Members: {Object.values(team.members).map(member => member.username).join(', ')}</p>
            <button onClick={() => onJoinTeam(team.id)}>Join</button>
        </div>
    );
}

export default TeamInfo;
