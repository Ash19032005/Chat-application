import React from 'react'
import {Button} from '@mui/material'
import {auth,provider} from "../../firebase";
import { signInWithPopup } from 'firebase/auth';
import { useStateValue } from '../ContextAPI/Stateprovider';
import { actionTypes } from '../ContextAPI/reducer';
import './Login.css'
const Login = () => {
       const [state,dispatch]=useStateValue();
       console.log(state);
       const signIn=()=>{
              signInWithPopup(auth,provider).then((result)=>{
                     dispatch({
                            type:actionTypes.SET_USER,
                            user:result.user,
                     })
              }).catch((err)=>{
                     alert(err.message)
              })
       } 
  return (
    <div className='login'>
       <div className="login__container">
              <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/2044px-WhatsApp.svg.png' alt='logo'/>
       <div className="login__text">
              <h1>Sign in to Whatsapp</h1>
       </div>
      <Button onClick={signIn}>
       Sign In with Google</Button>
       </div>

    </div>
  )
}

export default Login