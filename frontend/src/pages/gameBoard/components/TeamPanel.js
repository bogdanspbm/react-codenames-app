import React from 'react';
import TeamInfo from "./TeamInfo";

const TeamPanel = ({started = false, teams, spectators, onJoinTeam}) => {

    console.log(started);

    return <div className="teams-panel">
        {
            teams.map(team => (<TeamInfo started={started} key={team.id} inTeam={team} onJoinTeam={onJoinTeam}/>))
        }
        <div key="spectators" className="team-info">
            <h2>Spectators</h2>
            <ul>
                {Object.values(spectators).map((spectator) => (
                    <li key={spectator.id}>{spectator.username}</li>
                ))}
            </ul>

            { !started ? <button className="team-button" onClick={() => onJoinTeam(-1)}>Join Spectators</button> : null}
        </div>
    </div>
};

export default TeamPanel;
