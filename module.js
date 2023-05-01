import { getFirestore, collection, query, getDocs } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getDatabase, set, get, ref, update, onValue } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";

const firebaseConfig = {
  databaseURL: 'duunimarkkinat-database-default-rtdb.firebaseio.com',
  apiKey: "AIzaSyDN1lh1_B96aCr-zvQH5mZaBVkf7BVGP44",
  authDomain: "duunimarkkinat-database.firebaseapp.com",
  projectId: "duunimarkkinat-database",
  storageBucket: "duunimarkkinat-database.appspot.com",
  messagingSenderId: "945690467907",
  appId: "1:945690467907:web:af4ade37b10752a767fef6",
  measurementId: "G-5MF0FDQMXN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const database = getDatabase(app);
console.log("yhteydet avattu");

const db = getFirestore(); // db muuttuja firestoresta
const q = query(collection(db, "posts")); // kannasta haetaan postaukset
const querySnapshot  = await getDocs(q); // odotetaan vastausta
const paikat = []; // alustetaan taulu tietoja varten
window.idt = [];  // alustetaan taulu id:itä varten

const postaukset = querySnapshot._snapshot.docChanges; // postaukset arrayhin
for (let i = 0; i<postaukset.length;i++) { // loopataan array
window.idt.push(querySnapshot._snapshot.docChanges[i].doc.key.path.segments[6]); // logataan arraysta post id:t
}

querySnapshot.forEach((doc) => { // jokaista postia kohden otetaan: header, lokaatio, ja kuvaus
  let tiedot = doc.data();
  paikat.push([tiedot.postHeader, tiedot.jobLocation, tiedot.postText, tiedot.jobReward, tiedot.postTags]);
  console.log("tietoja lisätty!");
});

window.globaali = paikat; // tarpeelliset tiedot laitetaan globaaliin muuttujaan map.js varten
