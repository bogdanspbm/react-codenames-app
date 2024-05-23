import Chat from "./Chat";
import Cookies from "js-cookie";
import React from "react";
import '../styles/Footer.css';


const Footer = ({id, room, isOwnerTurn  }) => {
    return (<div className={"footer"}>
        <Chat roomId={id} inMessages={room.chatHistory} isOwnerTurn={isOwnerTurn} isOwner={room.teams.some(team => team.owner && team.owner.username === Cookies.get('username'))} />
    </div>)
}

export default Footer;
