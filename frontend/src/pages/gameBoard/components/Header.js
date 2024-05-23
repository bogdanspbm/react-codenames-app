import TeamPanel from "./TeamPanel";
import React from "react";
import ReadyButton from "./ReadyButton";
import '../styles/Header.css';


const Header = ({colorMap, borderColorMap, room, countdown, turnType, handleJoinTeam}) => {
    return (<div className={"header"}>
        <TeamPanel room={room} colorMap={colorMap} borderColorMap={borderColorMap} started={room.started} teams={room.teams}
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
        <div key="spectators" className="team-info">
            <h2>Spectators</h2>
            <ul>
                {Object.values(room.spectators).map((spectator) => (
                    <li key={spectator.id}>{spectator.username}</li>
                ))}
            </ul>
            {!room.started ? <button className="team-button" onClick={() => handleJoinTeam(-1)}>Join Spectators</button> : null}
        </div>
    </div>)
}

export default Header;
