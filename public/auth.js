import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { 
  getAuth, 
  signOut, 
  signInAnonymously, 
  setPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, 
  browserLocalPersistence, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import firebaseConfig from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);

const auth = getAuth();

function setAuthListeners(onLogin, onLogout){
  onAuthStateChanged(auth, user => {
    if (user) {
      onLogin();
    } else {
      onLogout();
    }
  });
}

async function signIn(){
  try{
    await setPersistence(auth, browserLocalPersistence);
    const user = await signInAnonymously(auth);
  }catch(e){
    console.error(e);
  }
}

async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out', error);
  }
}

async function login(email, password){
  try{
    await setPersistence(auth, browserLocalPersistence);
    const user = await signInWithEmailAndPassword(auth, email, password);
    return user;
  }catch(e){
    console.error(e);
    return null;
  }
}

async function createUser(email, password){
  return createUserWithEmailAndPassword(auth, email, password);
}

export {auth, setAuthListeners, signIn, login, logout, createUser};