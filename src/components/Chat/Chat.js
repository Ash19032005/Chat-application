import { React,useEffect,useState } from 'react';
import {useStateValue} from '../ContextAPI/Stateprovider';
import { Avatar, IconButton } from '@mui/material'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import {useParams} from 'react-router-dom';
import './Chat.css';
import Pusher from 'pusher-js'
import axios from 'axios';
const Chat = () => {
  const [{user}]=useStateValue();
  const [input, setinput] = useState("");
  const [roomName,setroomName]=useState(null);
  const [updatedAt,setupdatedAt]=useState(null);
  const [message,setMessage]=useState([]);
  const{roomId}=useParams();
  useEffect(()=>{
    const pusher = new Pusher('a2a220521cdcd39b2a2e', {
           cluster: 'ap2'
         });
         const channel = pusher.subscribe('messages');
         const handleInserted = (data) => {
                setMessage((prevMsg) => [...prevMsg, data]);
              };
          
              channel.bind('inserted', handleInserted);
          
              // Cleanup function to unsubscribe from the channel on component unmount
              return () => {
                channel.unbind('inserted', handleInserted);
                pusher.unsubscribe('messages');
              };
    
  },[]);
  useEffect(()=>{
    roomId && axios.get(`http://localhost:5001/rooms/${roomId}`).then((response)=>{
      setroomName(response.data.name);
      setupdatedAt(response.data.updatedAt);

    })
    roomId && axios.get(`http://localhost:5001/messages/${roomId}`).then((response)=>{
      setMessage(response.data);
    })
  },[roomId]);

  const sendMessage=async (e)=>{
    e.preventDefault();
    if(input){
           try{
           await axios.post("http://localhost:5001/message/new",{
                message:input,
                name:user.displayName,
                timestamp:new Date(),
                uid:user.uid,
                roomId:roomId,
           })
           setinput("");
           }
           catch(err){
                  console.log(err)
           }
    }
  }
  return (
   <div className="chat">
    <div className="chat__header">
    <Avatar
         src={`https://api.dicebear.com/8.x/open-peeps/svg`}         
       />
       <div className="chat__headerInfo">
        <h4>{roomName ? roomName:"Welcome to whatsapp"}</h4>
        <p>{
        updatedAt ?`Last updated at ${new Date(updatedAt).toString().slice(0,25)}`:
             "update" }</p>
       </div>
       <div className='chat__headerRight'>
        <IconButton>
        <SearchOutlinedIcon/>
        </IconButton>
        <IconButton>
          <AttachFileIcon/>
        </IconButton>
        <IconButton>
          <MoreVertIcon/>
        </IconButton>
       </div>
    </div>
    <div className="chat__body">
    {
  message && message.map((msg, index) => (
    <p
      className={`chat__message ${msg.uid === user.uid && "chat__receiver"}`}
      key={index}
    >

      <span className='chat__name'>{msg.name}</span>
      {msg.message}
      <span className='chat__timestamp'>{new Date(msg.timestamp).toString().slice(0, 25)}</span>
    </p>
  ))

  // message && (
  //   <p
  //     className={`chat__message ${message[0].uid === user.uid && "chat__receiver"}`}
  //   >
  //     <span className='chat__name'>{message[0].name}</span>
      
  //     <span className='chat__timestamp'>{new Date().toString().slice(0, 25)}</span>
  //   </p>
  // )
}

      
        </div>
    {roomName && <div className="chat__footer">
        <InsertEmoticonIcon/>
        <form>
          <input placeholder='Type a message'
          onChange={e=>setinput(e.target.value)}
          value={input}/>
          <button onClick={sendMessage}>send</button>
        </form>
    </div>}
   </div>
  )
}

export default Chat