import React from 'react';

const TeamInfo = ({ team }) => {
    return (
        <div className={`team-info team-${team.id}`}>
            <h2>{team.name}</h2>
            <ul>
                {Object.values(team.members).map((member) => (
                    <li key={member.id}>{member.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default TeamInfo;
