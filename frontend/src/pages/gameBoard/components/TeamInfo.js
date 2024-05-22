import React from 'react';

const TeamInfo = ({ started = false, inTeam = null, onJoinTeam = () => {} }) => {

    if(inTeam === null){
        return <div></div>
    }

    return (
        <div className={`team-info team-${inTeam.id}`}>
            <h2>{inTeam.name}</h2>
            <ul>
                {Object.values(inTeam.members).map((member) => (
                    <li key={member.username}>{inTeam.owner.username === member.username ? `Owner ${member.username}` : member.username} </li>
                ))}
            </ul>
            { !started ? <button className="team-button" onClick={() => onJoinTeam(inTeam.id)}>Join Team</button> : null}
        </div>
    );
};

export default TeamInfo;
