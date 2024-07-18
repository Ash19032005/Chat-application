import React, { useEffect, useState } from 'react'
import './SideBarChat.css'
import { Avatar } from '@mui/material'
import axios from 'axios';
import {Link} from "react-router-dom";

const SideBarChat = ({addnewChat,key,id,name}) => {
       const [seed,setSeed]=useState("")
       useEffect(()=>{
              setSeed(Math.floor(Math.random()*5000));
       })

const createChat=async()=>{
       const roomName=prompt("please enter name for the group:");
       if(roomName){
              try{
              await axios.post("http://localhost:5001/group/create",{
                     groupName:roomName
              })
              }
              catch(err){
                     console.log(err)
              }
       }
}

  return !addnewChat ?(
    <Link to={`/rooms/${id}`}>
    <div className='SideBarChat'>
       <Avatar
         src={`https://api.dicebear.com/8.x/open-peeps/svg`}
         
       />
       <div className='sidebarChat__info'>
              <h2>{name}</h2>
       </div>
    </div>
    </Link>   
  ): (
       <div className='sidebarChat' onClick={createChat} style={{'cursor':'pointer'}}> 
              <h2>Add new Chat</h2>
       </div>
  );
}
export default SideBarChat

