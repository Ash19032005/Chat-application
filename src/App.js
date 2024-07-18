import React from 'react'
import Login from './components/login/Login'
import './App.css'
import { useStateValue } from './components/ContextAPI/Stateprovider';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Chat from './components/Chat/Chat';
import SideBar from './components/SideBar/SideBar';
const App = () => {
  const [{user}]=useStateValue();
  return (
    <div className='app'>
     {!user ?  <Login/> : 
     <div className='app__body'>
      <Router>
        <SideBar/>
        <Routes>
          <Route path='/' element={<Chat/>}/>
          {/* for whatsapp groups */}
          <Route path='/rooms/:roomId' element={<Chat/>}/>
        </Routes>
      </Router>
      </div>}
    </div>
  )
}
export default App

