import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenu from './pages/mainMenu/MainMenu';
import GameList from './pages/gameList/GameList';
import CreateGame from './pages/createGame/CreateGame';
import GameBoard from './pages/gameBoard/GameBoard';
import './App.css';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainMenu />} />
                <Route path="/games" element={<GameList />} />
                <Route path="/create" element={<CreateGame />} />
                <Route path="/game/:id" element={<GameBoard />} />
            </Routes>
        </Router>
    );
}

export default App;
