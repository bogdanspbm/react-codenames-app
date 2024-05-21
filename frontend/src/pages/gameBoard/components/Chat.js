import React, { useState } from 'react';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        setMessages([...messages, input]);
        setInput('');
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
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
}

export default Chat;
