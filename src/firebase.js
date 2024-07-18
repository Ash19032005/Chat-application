import {initializeApp} from 'firebase/app';
import {getAuth,GoogleAuthProvider} from 'firebase/auth'
const firebaseConfig = {
       apiKey: "AIzaSyDvf9X6od3udenriqgtOAC5tb5eYY0FV1I",
       authDomain: "mern-whatsapp-clone-697f1.firebaseapp.com",
       projectId: "mern-whatsapp-clone-697f1",
       storageBucket: "mern-whatsapp-clone-697f1.appspot.com",
       messagingSenderId: "587130333876",
       appId: "1:587130333876:web:25599fd1a2a41083b285e1"
     };


const app=initializeApp(firebaseConfig);
const auth=getAuth();
const provider=new GoogleAuthProvider();
export {app,auth,provider};