import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import GameGrid from './GameGrid';
import Chat from './Chat';
import TeamPanel from './TeamPanel';
import ReadyButton from './ReadyButton';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const GameBoardContent = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await axios.get(`/api/v1/private/rooms/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setRoom(response.data);
            } catch (error) {
                console.error('Error fetching room:', error);
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
                stompClient.subscribe(`/topic/room/${id}`, (message) => {
                    const updatedRoom = JSON.parse(message.body);
                    setRoom(updatedRoom);
                });
                if (token) {
                    stompClient.publish({
                        destination: `/app/connect`,
                        body: JSON.stringify({ roomId: id }),
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }
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

        return () => {
            if (stompClient.connected) {
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
    }, [id, token]);

    const handleJoinTeam = (teamId) => {
        axios.post(`/api/v1/private/rooms/${id}/join`, {}, {
            params: { teamId },
            headers: { Authorization: `Bearer ${token}` },
        }).then(response => {
            setRoom(response.data);
        }).catch(error => {
            console.error('Error joining team:', error);
        });
    };

    if (!room) {
        return <div>Loading...</div>;
    }

    return (
        <div className="game-board">
            <TeamPanel teams={room.teams} spectators={room.spectators} onJoinTeam={handleJoinTeam} />
            <GameGrid words={room.words} />
            <ReadyButton roomId={id} />
            <Chat roomId={id} inMessages={room.chatHistory} />
        </div>
    );
};

export default GameBoardContent;
