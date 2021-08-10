import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import '../styles/globals.css'
import { UserContext } from '../lib/context';
import {useState, useEffect} from 'react'
import {useAuthState} from 'react-firebase-hooks/auth'
import { auth, firestore } from '../lib/firebase';
import { useUserData } from '../lib/hooks';



function MyApp({ Component, pageProps }) {
  const userData = useUserData();
  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}

export default MyApp
