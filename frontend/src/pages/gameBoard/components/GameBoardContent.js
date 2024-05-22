import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Chat from './Chat';
import Cookies from 'js-cookie';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const GameBoardContent = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [client, setClient] = useState(null);

    useEffect(() => {
        const fetchRoom = async () => {
            const token = Cookies.get('token');
            if (token) {
                const response = await fetch(`/api/v1/private/rooms/${id}/connect`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setRoom(data);
                } else {
                    console.error('Failed to connect to room');
                }
            }
        };

        fetchRoom();

        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Connected to WebSocket server');
                const token = Cookies.get('token');
                if (token) {
                    stompClient.publish({
                        destination: `/app/connect`,
                        body: JSON.stringify({ roomId: id }),
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }
                stompClient.subscribe(`/topic/room/${id}`, (message) => {
                    const updatedRoom = JSON.parse(message.body);
                    setRoom(updatedRoom);
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            onWebSocketError: (error) => {
                console.error('WebSocket error: ', error);
            }
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            if (stompClient.connected) {
                const token = Cookies.get('token');
                if (token) {
                    stompClient.publish({
                        destination: `/app/disconnect`,
                        body: JSON.stringify({ roomId: id }),
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }
            }
            stompClient.deactivate();
        };
    }, [id]);

    useEffect(() => {
        const interval = setInterval(() => {
            const token = Cookies.get('token');
            if (client && client.connected && token) {
                client.publish({
                    destination: `/app/ping`,
                    body: JSON.stringify({ roomId: id }),
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [client, id]);

    if (!room) return <div>Loading...</div>;

    const handleJoinTeam = async (teamId) => {
        const token = Cookies.get('token');
        if (token) {
            const response = await fetch(`/api/v1/private/rooms/${id}/join?teamId=${teamId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setRoom(data);
            } else {
                console.error('Failed to join team');
            }
        }
    };

    const handleSetReady = async (isReady) => {
        const token = Cookies.get('token');
        if (token) {
            const response = await fetch(`/api/v1/private/rooms/${id}/ready?ready=${isReady}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setRoom(data);
            } else {
                console.error('Failed to set ready status');
            }
        }
    };

    return (
        <div className="game-board">
            <h1>{room.name}</h1>
            <div className="teams-panel">
                {room.teams.map((team) => (
                    <div key={team.id} className="team-info">
                        <h2>{team.name}</h2>
                        <ul>
                            {Object.values(team.members).map((member) => (
                                <li key={member.id}>{member.username}</li>
                            ))}
                        </ul>
                        <button onClick={() => handleJoinTeam(team.id)}>Join Team</button>
                    </div>
                ))}
                <div className="team-info">
                    <h2>Spectators</h2>
                    <ul>
                        {Object.values(room.spectators).map((spectator) => (
                            <li key={spectator.id}>{spectator.username}</li>
                        ))}
                    </ul>
                    <button onClick={() => handleJoinTeam(-1)}>Join Spectators</button>
                </div>
            </div>
            <button onClick={() => handleSetReady(true)}>Ready</button>
            <button onClick={() => handleSetReady(false)}>Not Ready</button>
            <Chat roomId={room.id} inMessages={room.chatHistory} />
        </div>
    );
};

export default GameBoardContent;
