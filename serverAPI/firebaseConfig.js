import firebase from 'firebase'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyANFEnnTVMmE6dLkSbRM1OHVE2s2rlzZwc",
    authDomain: "chatbot-f3b3f.firebaseapp.com",
    databaseURL: "https://chatbot-f3b3f.firebaseio.com",
    projectId: "chatbot-f3b3f",
    storageBucket: "chatbot-f3b3f.appspot.com",
    messagingSenderId: "581718172198",
    appId: "1:581718172198:web:05467f945d3aafee"
};

firebase.initializeApp(firebaseConfig)

export const firestore = firebase.firestore()
export default firebase