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
    const [countdown, setCountdown] = useState(null);
    const [turnType, setTurnType] = useState(null);
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
                console.log('Connected to WebSocket server');
                stompClient.subscribe(`/topic/room/${id}`, (message) => {
                    const updatedRoom = JSON.parse(message.body);
                    console.log(updatedRoom);
                    setRoom(updatedRoom);
                });
                stompClient.subscribe(`/topic/countdown/${id}`, (message) => {
                    const countdownValue = JSON.parse(message.body);
                    setCountdown(countdownValue);
                });
                stompClient.subscribe(`/topic/turn/${id}`, (message) => {
                    const turnType = message.body;
                    setTurnType(turnType);
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
            setRoom(response.data);}).catch(error => {
            console.error('Error voting for word:', error);
        });
    };

    const handleVote = (word) => {
        axios.post(`/api/v1/private/rooms/${id}/vote`, {}, {
            params: { word },
            headers: { Authorization: `Bearer ${token}` },
        }).catch(error => {
            console.error('Error voting for word:', error);
        });
    };

    if (!room) {
        return <div>Loading...</div>;
    }

    return (
        <div className="game-board">
            <TeamPanel started={room.started} teams={room.teams} spectators={room.spectators} onJoinTeam={handleJoinTeam} />
            <GameGrid votesMap={room.voteCounts} words={room.words} isOwnerTurn={room.ownerTurn && turnType === 'owner'} isOwner={room.teams.some(team => team.owner && team.owner.username === Cookies.get('username'))} onVote={turnType === 'member' ? handleVote : null} />
            <ReadyButton room={room} />
            <Chat roomId={id} inMessages={room.chatHistory} isOwnerTurn={room.ownerTurn && turnType === 'owner'} isOwner={room.teams.some(team => team.owner && team.owner.username === Cookies.get('username'))} />
            {room.started ? (
                <div className="game-status">Game Started</div>
            ) : (
                countdown !== null && <div className="countdown">Game starts in: {countdown}</div>
            )}
            {turnType && (
                <div className="turn-status">
                    {turnType === 'owner' ? 'Owner turn in progress' : 'Member turn in progress'}
                </div>
            )}
            {countdown !== null && turnType && (
                <div className="turn-countdown">Turn ends in: {countdown}</div>
            )}
        </div>
    );
};

export default GameBoardContent;
