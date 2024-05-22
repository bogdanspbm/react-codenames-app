import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import TeamsPanel from './TeamsPanel';
import Chat from './Chat';
import Card from './Card';

function GameBoardContent() {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('token');
        const userId = parseInt(localStorage.getItem('userId'), 10);
        const username = localStorage.getItem('username');

        if (token) {
            fetch(`/api/v1/private/rooms/${id}/connect`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userId, username }),
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Failed to connect to room');
                    }
                })
                .then(data => setRoom(data))
                .catch(error => console.error('Error:', error));
        }

        return () => {
            if (token) {
                fetch(`/api/v1/private/rooms/${id}/disconnect`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: userId, username }),
                }).catch(error => console.error('Error:', error));
            }
        };
    }, [id]);

    const handleJoinTeam = (teamId) => {
        const token = Cookies.get('token');
        const userId = parseInt(localStorage.getItem('userId'), 10);
        const username = localStorage.getItem('username');

        fetch(`/api/v1/private/rooms/${id}/join?teamId=${teamId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: userId, username }),
        })
            .then(response => response.json())
            .then(data => setRoom(data))
            .catch(error => console.error('Error:', error));
    };

    const handleReady = (ready) => {
        const token = Cookies.get('token');
        fetch(`/api/v1/private/rooms/${id}/ready?ready=${ready}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => setRoom(data))
            .catch(error => console.error('Error:', error));
    };

    if (!room) return <div>Loading...</div>;

    return (
        <>
            <TeamsPanel teams={room.teams} spectators={room.spectators} onJoinTeam={handleJoinTeam} />
            <div className="cards">
                {room.words.map((word, index) => (
                    <Card key={index} word={word.word} teamIndex={word.teamIndex} />
                ))}
            </div>
            <Chat />
            {!room.started && <button onClick={() => handleReady(true)}>Ready</button>}
            <button type="button" onClick={() => navigate(-1)}>Back</button>
        </>
    );
}

export default GameBoardContent;
