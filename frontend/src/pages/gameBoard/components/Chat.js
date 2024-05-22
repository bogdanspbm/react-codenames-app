import React, { useState } from 'react';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const handleSend = () => {
        setMessages([...messages, message]);
        setMessage('');
    };

    return (
        <div className="chat">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}

export default Chat;
