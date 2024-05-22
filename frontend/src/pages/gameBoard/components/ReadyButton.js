import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ReadyButton = ({ room = {}}) => {
    const [isReady, setIsReady] = useState(false);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get(`/api/v1/private/rooms/${room.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const readyUsers = Object.values(response.data.readyStatus).filter(status => status).length;
            } catch (error) {
                console.error('Error fetching room:', error);
            }
        };

        fetchRoom();
    }, [room.id, token, isReady]);

    const handleReadyClick = () => {
        axios.post(`/api/v1/private/rooms/${room.id}/ready`, {}, {
            params: { ready: !isReady },
            headers: { Authorization: `Bearer ${token}` },
        }).then(response => {
            const room = response.data;
            setIsReady(!isReady);
        }).catch(error => {
            console.error('Error setting ready status:', error);
        });
    };

    const calcReadyCount = () => {
        const membersList = [];


        for(let teamIndex in room.teams){

            const team = room.teams[teamIndex];

            for(let memberIndex in team.members){
                const member = team.members[memberIndex];
                membersList.push(member.username);
            }
        }

        let counter = 0;

        for(let memberIndex in membersList){
            const member = membersList[memberIndex];
            if(!room.readyStatus[member]){
                continue;
            }

            counter += 1;
        }

        return `${counter}/${membersList.length}`;
    };

    return (
        <div className="ready-button">
            <button onClick={handleReadyClick}>
                {isReady ? 'Cancel Ready' : 'Ready'}
            </button>
            <p>{calcReadyCount()} players ready</p>
        </div>
    );
};

export default ReadyButton;
