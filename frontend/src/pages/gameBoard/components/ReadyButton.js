import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ReadyButton = ({ roomId }) => {
    const [isReady, setIsReady] = useState(false);
    const [readyCount, setReadyCount] = useState(0);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get(`/api/v1/private/rooms/${roomId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const room = response.data;
                const readyUsers = Object.values(room.readyStatus).filter(status => status).length;
                setReadyCount(readyUsers);
            } catch (error) {
                console.error('Error fetching room:', error);
            }
        };

        fetchRoom();
    }, [roomId, token, isReady]);

    const handleReadyClick = () => {
        axios.post(`/api/v1/private/rooms/${roomId}/ready`, {}, {
            params: { ready: !isReady },
            headers: { Authorization: `Bearer ${token}` },
        }).then(response => {
            setIsReady(!isReady);
            const room = response.data;
            const readyUsers = Object.values(room.readyStatus).filter(status => status).length;
            setReadyCount(readyUsers);
        }).catch(error => {
            console.error('Error setting ready status:', error);
        });
    };

    return (
        <div className="ready-button">
            <button onClick={handleReadyClick}>
                {isReady ? 'Cancel Ready' : 'Ready'}
            </button>
            <p>{readyCount} players ready</p>
        </div>
    );
};

export default ReadyButton;
