import React from 'react';
import { ReactComponent as UsersIcon } from "../icons/ic_users_16x16.svg"
import { ReactComponent as WordIcon } from "../icons/ic_words_16x16.svg"
import Cookies from "js-cookie";


const TeamInfo = ({  wordsToFind = 0, started, inTeam, onJoinTeam, colorMap, borderColorMap}) => {

    const isInTeam = () => {
        const name = Cookies.get("username");

        if(!name){
            return false;
        }

        for(let i in inTeam.members){
            if(i === name){
                return true;
            }
        }

        return false;
    }

    return (
        <div className="team-container">
            <div className="team-info">
                <h2 style={{margin: "0px", color: colorMap[inTeam.id]}}>{inTeam.name}</h2>
                <UsersIcon fill={"#4c4c4c"} style={{marginLeft: "auto"}}></UsersIcon>
                <div className={"team-info-text"}>{Object.keys(inTeam.members).length}</div>
                <WordIcon fill={"#4c4c4c"}></WordIcon>
                <div className={"team-info-text"}>{wordsToFind}</div>
            </div>
            {(!started && !isInTeam()) ? <div onClick={() => onJoinTeam(inTeam.id)} style={{"--fill-color": colorMap[inTeam.id]}} className={"join-team-button"}>Join Team</div> : null}
        </div>

    );
};

export default TeamInfo;
