import Chat from "./Chat";
import Cookies from "js-cookie";
import React from "react";
import '../styles/Footer.css';


const Footer = ({id, room, turnType  }) => {
    return (<div className={"footer"}>
        <Chat roomId={id} inMessages={room.chatHistory} isOwnerTurn={room.ownerTurn && turnType === 'owner'} isOwner={room.teams.some(team => team.owner && team.owner.username === Cookies.get('username'))} />
    </div>)
}

export default Footer;
