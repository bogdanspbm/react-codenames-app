import React from 'react';
import TeamInfo from './TeamInfo';

function TeamsPanel() {
    return (
        <div className="teams-panel">
            <TeamInfo teamName="Team A" leaderName="Leader Zakhar" color="red" />
            <TeamInfo teamName="Team B" leaderName="Leader Bogdan" color="green" />
            <TeamInfo teamName="Team C" leaderName="Leader Unknown" color="blue" />
        </div>
    );
}

export default TeamsPanel;
