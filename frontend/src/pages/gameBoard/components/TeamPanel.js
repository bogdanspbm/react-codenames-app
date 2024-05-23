import React from 'react';
import TeamInfo from "./TeamInfo";
import '../styles/Teams.css';

const TeamPanel = ({room, started = false, colorMap, borderColorMap, teams, spectators, onJoinTeam }) => {


    const getWordsToFindByTeam = (index) => {
        let counter = 0;
        for(let lIndex in room.words){
            const word = room.words[lIndex];
            if(word.teamIndex === index && !room.selectedWords[word.word]){
               counter += 1;
            }
        }

        return counter;
    }

    return (
        <div className="teams-panel">
            {teams.map(team => (
                <TeamInfo wordsToFind={getWordsToFindByTeam(team.id)}  colorMap={colorMap} borderColorMap={borderColorMap} started={started} key={team.id} inTeam={team} onJoinTeam={onJoinTeam} />
            ))}
        </div>
    );
};

export default TeamPanel;
