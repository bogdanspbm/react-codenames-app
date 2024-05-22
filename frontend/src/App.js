import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenu from './pages/mainMenu/MainMenu';
import GameList from './pages/gameList/GameList';
import CreateGame from './pages/createGame/CreateGame';
import GameBoard from './pages/gameBoard/GameBoard';
import './App.css';
import Cookies from "js-cookie";


function App() {
    const [username, setUsername] = useState(Cookies.get("username"));

    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainMenu username={username} setUsername={setUsername} />} />
                <Route path="/games" element={<GameList />} />
                <Route path="/create" element={<CreateGame />} />
                <Route path="/game/:id" element={<GameBoard username={username}/>} />
            </Routes>
        </Router>
    );
}

export default App;
