import React from 'react';
import TeamInfo from "./TeamInfo";

const TeamPanel = ({teams, spectators, onJoinTeam}) => {
    
    return <div className="teams-panel">
        {
            teams.map(team => (<TeamInfo key={team.id} inTeam={team} onJoinTeam={onJoinTeam}/>))
        }
        <div key="spectators" className="team-info">
            <h2>Spectators</h2>
            <ul>
                {Object.values(spectators).map((spectator) => (
                    <li key={spectator.id}>{spectator.username}</li>
                ))}
            </ul>
            <button className="team-button" onClick={() => onJoinTeam(-1)}>Join Spectators</button>
        </div>
    </div>
};

export default TeamPanel;
