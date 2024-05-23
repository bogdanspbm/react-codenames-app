import React from 'react';
import { ReactComponent as UsersIcon } from "../icons/ic_users_16x16.svg"
import { ReactComponent as WordIcon } from "../icons/ic_words_16x16.svg"


const TeamInfo = ({started, inTeam, onJoinTeam, colorMap, borderColorMap}) => {

    return (
        <div className="team-info">
            <h2 style={{margin: "0px", marginLeft: "2px", color: colorMap[inTeam.id] }}>{inTeam.name}</h2>
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
            <UsersIcon fill={"#242424"} style={{marginLeft: "auto"}}></UsersIcon>
            <WordIcon fill={"#242424"}></WordIcon>
        </div>
    );
};

export default TeamInfo;
