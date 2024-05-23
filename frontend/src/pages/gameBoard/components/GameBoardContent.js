import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import GameGrid from './GameGrid';
import Header from './Header';
import Footer from "./Footer";
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

    const colorMap = {
        default: "#fafafa",
        0: "#73d13d",
        1: "#ff4d4f",
        2: "#4096ff",
        3: "#ffec3d",
        4: "#9254de",
        5: "#262626"
    }

    const borderColorMap = {
        default: "#d9d9d9",
        0: "#52c41a",
        1: "#f5222d",
        2: "#1677ff",
        3: "#fadb14",
        4: "#722ed1",
        5: "#141414"
    }

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
            <Header colorMap={colorMap} borderColorMap={borderColorMap} room={room} turnType={turnType} countdown={countdown} handleJoinTeam={handleJoinTeam}></Header>
            <GameGrid started={room.started} colorMap={colorMap} borderColorMap={borderColorMap} votesMap={room.voteCounts} selectedWords={room.selectedWords} words={room.words} isOwnerTurn={room.ownerTurn && turnType === 'owner'} isOwner={room.teams.some(team => team.owner && team.owner.username === Cookies.get('username'))} onVote={turnType === 'member' ? handleVote : null} />
            <Footer id={id} room={room} ></Footer>
        </div>
    );
};

export default GameBoardContent;
