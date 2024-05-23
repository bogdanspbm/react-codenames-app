import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/Chat.css';

const Chat = ({ roomId, inMessages = [], isOwnerTurn, isOwner }) => {
    const [messages, setMessages] = useState(inMessages);
    const [input, setInput] = useState('');
    const [number, setNumber] = useState('');
    const [client, setClient] = useState(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Connected to WebSocket server');
                stompClient.subscribe(`/topic/room/${roomId}`, (message) => {
                    const room = JSON.parse(message.body);
                    setMessages(room.chatHistory);
                });
                stompClient.subscribe('/topic/messages', (message) => {
                    const chatMessage = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, chatMessage]);
                });
                const token = Cookies.get('token');
                if (token) {
                    stompClient.publish({
                        destination: `/app/connect`,
                        body: JSON.stringify({ roomId }),
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
        setClient(stompClient);

        return () => {
            if (stompClient.connected) {
                const token = Cookies.get('token');
                if (token) {
                    stompClient.publish({
                        destination: `/app/disconnect`,
                        body: JSON.stringify({ roomId }),
                        headers: { Authorization: `Bearer ${token}` },
                    });
                }
            }
            stompClient.deactivate();
        };
    }, [roomId]);

    const handleSend = () => {
        const token = Cookies.get('token');
        if (isOwner && isOwnerTurn) {
            if (input.trim() && number && token) {
                const message = {
                    teamIndex: roomId,
                    username: Cookies.get('username'),
                    word: input,
                    number: parseInt(number, 10)
                };
                axios.post(`/api/v1/private/rooms/${roomId}/owner-message`, message, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                    .then(() => {
                        setInput('');
                        setNumber('');
                    })
                    .catch(error => {
                        console.error('Error sending owner message:', error);
                    });
            } else {
                console.error('Cannot send message. Either input or number is empty, or token is missing.');
            }
        } else {
            if (input.trim() && token && client && client.connected) {
                const message = { content: input, roomId: roomId };
                client.publish({
                    destination: '/app/chat',
                    body: JSON.stringify(message),
                    headers: { Authorization: `Bearer ${token}` },
                });
                setInput('');
            } else {
                console.error('Cannot send message. Either input is empty, token is missing, or client is not connected.');
            }
        }
    };

    return (
        <div className="chat">
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <strong>{msg.sender}:</strong> {msg.content}
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                />
                {isOwner && isOwnerTurn && (
                    <input
                        type="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="Number"
                    />
                )}
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
