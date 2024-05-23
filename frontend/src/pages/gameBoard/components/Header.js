import TeamPanel from "./TeamPanel";
import React from "react";
import ReadyButton from "./ReadyButton";
import { ReactComponent as VisionIcon } from "../icons/ic_vision_24x16.svg"
import '../styles/Header.css';
import Cookies from "js-cookie";


const Header = ({colorMap, borderColorMap, room, countdown, turnType, handleJoinTeam}) => {


    const isInSpectators = () => {
        const name = Cookies.get("username");

        if(!name){
            return false;
        }

        for(let i in room.spectators){
            if(i === name){
                return true;
            }
        }

        return false;
    }

    return (<div className={"header"}>
        <TeamPanel room={room} colorMap={colorMap} borderColorMap={borderColorMap} started={room.started}
                   teams={room.teams}
                   spectators={room.spectators} onJoinTeam={handleJoinTeam}/>
        {room.started ? (
            <div className="game-status">Game Started</div>
        ) : (
            countdown !== null && <div className="countdown">Game starts in: {countdown}</div>
        )}
        {turnType && (
            <div className="turn-status">
                {turnType === 'owner' ? 'Owner turn in progress' : 'Member turn in progress'}
            </div>
        )}
        {countdown !== null && turnType && (
            <div className="turn-countdown">Turn ends in: {countdown}</div>
        )}
        <ReadyButton room={room}/>
        <div className="team-container">
            <div key="spectators" className="team-info">
                <h2 style={{margin: "0px", color: "#4c4c4c"}}>Spectators</h2>
                <VisionIcon fill={"#4c4c4c"} style={{marginLeft: "auto"}}></VisionIcon>
                <div className={"team-info-text"}>{Object.keys(room.spectators).length}</div>
            </div>
            {(!room.started && !isInSpectators()) ? <div onClick={() => handleJoinTeam(-1)} style={{"--fill-color":"#4c4c4c"}} className={"join-team-button"}>Join</div> : null}
        </div>
    </div>)
}

export default Header;
