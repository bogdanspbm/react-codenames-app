import React from 'react';

const TeamInfo = ({started, inTeam, onJoinTeam}) => {

    return (
        <div className="team-info">
            <h2>{inTeam.name}</h2>
            <ul>
                {Object.values(inTeam.members).map((member) => (
                    <li key={member.id}>{(inTeam.owner !== null && member.username === inTeam.owner.username) ? "Owner: " + member.username : member.username}</li>
                ))}
            </ul>
            {!started && (
                <button className="team-button" onClick={() => onJoinTeam(inTeam.id)}>
                    Join {inTeam.name}
                </button>
            )}
        </div>
    );
};

export default TeamInfo;
