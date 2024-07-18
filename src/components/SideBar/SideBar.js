import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import {Avatar, IconButton} from '@mui/material'
import {useStateValue} from '../ContextAPI/Stateprovider'
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SideBarChat from '../SideBarChat/SideBarChat';
import axios from 'axios';
import Pusher from 'pusher-js';
const SideBar = () => {
       const [{user}]=useStateValue();

       const [Rooms,setRooms]=useState(null);
       useEffect(()=>{
       axios.get("http://localhost:5001/all/rooms").then((response)=>{
              setRooms(response.data);
       })
       },[])
       // console.log(Rooms);
useEffect(()=>{
       const pusher = new Pusher('a2a220521cdcd39b2a2e', {
              cluster: 'ap2'
            });

       const channel = pusher.subscribe('room');
       const handleInserted = (data) => {
              setRooms((prevRooms) => [...prevRooms, data]);
            };
        
            channel.bind('inserted', handleInserted);
        
            // Cleanup function to unsubscribe from the channel on component unmount
            return () => {
              channel.unbind('inserted', handleInserted);
              pusher.unsubscribe('room');
            };
},[])

  return (
    <div className='sidebar'>
       <div className='sidebar__header'>
              <Avatar
              src={user.photoURL}
              />
              <div className='sidebar__headerRight'>
                     <IconButton>
                            <DonutLargeIcon/>
                     </IconButton>

                     <IconButton>
                            <ChatIcon/>
                     </IconButton>

                     <IconButton>
                            <MoreVertIcon/>
                     </IconButton>
              </div>
       </div>
       <div className='sidebar__search'>
              <div className="sidebar__searchContainer">
                     <SearchOutlinedIcon/>
                     <input placeholder='Search or start a new chat'/>
              </div>
       </div>
       <div className="sidebar__chats">
              <SideBarChat addnewChat/>
              {
                    Rooms && Rooms.map((Room)=>(<SideBarChat key={Room._id} id={Room._id} name={Room.name}/>))
              }
       </div>
    </div>
  )
}

export default SideBar