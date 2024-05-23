import React from 'react';
import TeamInfo from "./TeamInfo";
import '../styles/Teams.css';

const TeamPanel = ({ started = false, colorMap, borderColorMap, teams, spectators, onJoinTeam }) => {
    return (
        <div className="teams-panel">
            {teams.map(team => (
                <TeamInfo  colorMap={colorMap} borderColorMap={borderColorMap} started={started} key={team.id} inTeam={team} onJoinTeam={onJoinTeam} />
            ))}
        </div>
    );
};

export default TeamPanel;
