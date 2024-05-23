import React from 'react';
import { ReactComponent as UsersIcon } from "../icons/ic_users_16x16.svg"
import { ReactComponent as WordIcon } from "../icons/ic_words_16x16.svg"


const TeamInfo = ({wordsToFind = 0, started, inTeam, onJoinTeam, colorMap, borderColorMap}) => {

    return (
        <div className="team-info">
            <h2 style={{margin: "0px", marginLeft: "2px", color: colorMap[inTeam.id]}}>{inTeam.name}</h2>
            <UsersIcon fill={"#4c4c4c"} style={{marginLeft: "auto"}}></UsersIcon>
            <div className={"team-info-text"}>{Object.keys(inTeam.members).length}</div>
            <WordIcon fill={"#4c4c4c"}></WordIcon>
            <div className={"team-info-text"}>{wordsToFind}</div>
        </div>
    );
};

export default TeamInfo;
