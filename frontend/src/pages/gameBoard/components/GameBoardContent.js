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
        fetch(`/api/v1/private/rooms/${id}`, {
            headers: {
                'Authorization': `Bearer ${Cookies.get('token')}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Failed to fetch room');
                }
            })
            .then(data => setRoom(data))
            .catch(error => console.error('Error:', error));
    }, [id]);

    if (!room) return <div>Loading...</div>;

    return (
        <>
            <TeamsPanel teams={room.teams} />
            <div className="cards">
                {room.words.map((word, index) => (
                    <Card key={index} word={word.word} teamIndex={word.teamIndex} />
                ))}
            </div>
            <Chat />
            <button type="button" onClick={() => navigate(-1)}>Back</button>
        </>
    );
}

export default GameBoardContent;
