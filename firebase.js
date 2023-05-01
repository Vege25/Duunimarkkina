'use strict';
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getDatabase, set, get, ref, update, onValue } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
import { getFirestore, doc, collection, addDoc, getDoc, setDoc, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const db = getFirestore();

//register and login buttons
const registerButton = document.querySelector('#registerButton');
const loginButton = document.querySelector('#loginButton');
const changePasswordButton = document.querySelector('#changePasswordButton');
const readMoreButton = document.querySelector('#readMoreButton');
const jobRequestButton = document.querySelector('#jobRequestButton');
const logOutButton = document.querySelector('#logOutButton');
const sendRatingButton = document.querySelector('#sendRatingButton');
//check if logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const myUID = user.uid;
        showProfile(myUID);
    } else {
        // user logged out
        document.querySelector('#profileAvatar').src="images/avatarplaceholder_leaktest.jpg"; // default kuva kun ei ole kirjautunut
    }
})

//tarkista onko käyttäjä kirjautunut sisään. jos on mene profiiliin. jos ei mene login ruutuun
if(profileButton != null){
    profileButton.addEventListener('click', function(){
        let user = auth.currentUser;
        console.log(user);
        if (user) {
            window.location.href = 'profile.html'
        }
        else {
            window.location.href = 'login.html';
        }
    });
}
/*
function showRatings(starAmount, description, raterName){
    const ratings = document.querySelector('#ratings');

    const rating = document.createElement('div');
    rating.className = 'rating';

    const h3 = document.createElement('h3');
    h3.innerHTML = raterName;
    h3.className = 'raterNameText';

    const stars = document.createElement('div');
    stars.className = 'stars';
    //luo tähtiä starAmount verran
    for(let i = 1; i < starAmount + 1; i++){
        const star = document.createElement('img');
        star.src = 'images/star.png';
        star.alt = 'Star' + i.toString();
        star.className = 'star';
        stars.appendChild(star);
    }
    const p = document.createElement('p');
    p.className = 'ratingDescription';
    p.innerText = description;

    //lisää rating tagiin yllä luodut child elementit
    rating.appendChild(h3);
    rating.appendChild(stars);
    rating.appendChild(p);

    //lopuksi lisää rating sivulle näkyväksi ratings childiksi
    if(ratings != null){
        ratings.appendChild(rating);
    }
}*/

// when user is registering
if(registerButton != null){  //antaa errorin kun ei löydä register tai login nappia niin tehään nullcheck
    registerButton.addEventListener('click', function(){
        let username = document.querySelector('#username').value;
        let password = document.querySelector('#password').value;
        let email = document.querySelector('#email').value;
        let birthday = document.querySelector('#birthday').value;
        let totalRatings = 0;
        //validate input fields
        if(validate_email(email) == false || validate_password(password) == false){
            alert('Email tai salasana ei täytä vaatimuksia');
            return
        }//TODO?? TARKISTA ETTÄ ONKO ESIM MIN 3 TAGIA VALITTUNA
        if(validate_field(username) == false){
            alert('Syötä käyttäjänimesi');
            return
        }
        if(validate_birthday(birthday) == false){
            alert('Tarkista ikäsi');
            return
        }
        
        //move on with Auth
        createUserWithEmailAndPassword(auth, email, password, birthday, totalRatings)
        .then((userCredential) => {
            const user = userCredential.user;
            set(ref(database, 'users/' + user.uid),{
                username : username,
                email : email,
                birthday : birthday,
                totalRatings : totalRatings,
            });
            alert('Käyttäjä luotu onnistuneesti!');
        })
        .catch((error) => {
            //firebase käyttää tätä heidän erroreihin
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    });
}

//aseta rekisteröinnin yhteydessä minimi ikä tähän päivään - minAge (vain visuaalisesti)
let birthday = document.querySelector('#birthday');
const minAge = 15;

if(birthday != null){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    //jos päivä tai kuukausi on esim 9, 5 4 vaihda ne muotoon 09, 05, 04
    if (dd < 10) {
    dd = '0' + dd;
    }

    if (mm < 10) {
    mm = '0' + mm;
    }
    
    today = yyyy - minAge + '-' + mm + '-' + dd;
    birthday.setAttribute("max", today);
}

//send rating
if(sendRatingButton != null){
    sendRatingButton.addEventListener('click', function(){
        let desc = document.querySelector('#ratingInputDescription').value;
        let uid = "TxSx3iFPxedg99ix8dHTweFN5H73"/*user.uid*/;
        let nameRef = ref(database, 'users/' + uid + '/username');
            onValue(nameRef, (snapshot) => {
                let data = snapshot.val();
                document.getElementsByName('rate')
                .forEach(radio => {
                    if(radio.checked){
                        //TODO vaihda tämä uid arvosteltavan uid jolloin mene oikeeseen osoitteeseen
                        ratings(uid, radio.value, desc, data/*nimi*/);
                    }
                });
            });
    });
}

function ratings(userId, starAmount, description, raterName){
    let totalratingsRef = ref(database, 'users/' + userId + '/totalRatings');
    let ratingsRef = ref(database, 'users/' + userId + '/ratings');
        onValue(totalratingsRef, (snapshot) => {
        let data = snapshot.val();
        let id = 'rate'/*data + 1*/;
        set(ref(database, 'users/' + userId + '/ratings/' + id), {
            raterName: raterName,
            description: description,
            starAmount : starAmount
        });
        
    });
}

// When user is logging in
if(loginButton != null){  //antaa errorin kun ei löydä register tai login nappia niin tehään nullcheck
    loginButton.addEventListener('click', function(){
        let password = document.querySelector('#password').value;
        let email = document.querySelector('#email').value;

        // validate input fields
        if(validate_email(email) == false || validate_password(password) == false){
            alert('Tarkista email tai salasanasi!');
            return
        }
    
        //move on with auth
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
    
            update(ref(database, 'users/' + user.uid),{
                // mitä muuttuu kun käyttäjä kirjautuu sisään
            });
            window.location.href = 'profile.html';
            alert('Kirjauduttu sisään!');
        })
        .catch((error) => {
            //firebase käyttää tätä heidän erroreihin
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    });
}

if(changePasswordButton != null){
    changePasswordButton.addEventListener('click', function(){
        let email = document.querySelector('#email').value;

        // validate email and passwords
        if(validate_email(email) == false){
            alert('Tarkista email');
            return
        }
        sendPasswordResetEmail(auth, email)
        .then(() => {
            alert('Salasanan vaihto sähköposti lähetetty!')
            })
        .catch((error) => {
            //firebase käyttää tätä heidän erroreihin
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    });
}

if(logOutButton != null){
    logOutButton.addEventListener('click', function(){
        signOut(auth)
        .then(() => {
            window.location.href = 'index.html';
            alert('Kirjauduttu ulos!');
        })
        .catch((error) => {
            //firebase käyttää tätä heidän erroreihin
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
          
    });
}

function showProfile(myUID){
    let params = window.location.search;
    const data = new URLSearchParams(params);
    const profileUID = data.get("UID");

    document.querySelector('#profileAvatar').src = "images/avatar_placeholder.png"
    let profileName = document.querySelector('#profileName');
    let profileAge = document.querySelector('#profileAge');
    let profileEmail = document.querySelector('#profileEmail');

    // Jos käyttäjä haluaa nähdä oman profiilinsa
    if(profileUID == null){
        if(profileName != null){
            const usernameRef = ref(database, 'users/' + myUID + '/username');
            onValue(usernameRef, (snapshot) => {
            const data = snapshot.val();
            profileName.innerHTML = data;
            });
        }
        if(profileAge != null){
            const ageRef = ref(database, 'users/' + myUID + '/birthday');
            onValue(ageRef, (snapshot) => {
            // saa hänen syntymävuosi
            const data = snapshot.val();
            let newDate = new Date(data);
            let onlyYear = newDate.getFullYear(); 
            //muuta syntymävuosi iäksi
            let today = new Date();
            let thisYear = today.getFullYear();
    
            let age = thisYear - onlyYear; // tämä vuosi(2022) - käyttäjän syntymävuosi (esim 2007) = ikä(15)
    
            profileAge.innerHTML = '(' + age + ')';
            });
        }
        if(profileEmail != null){
            const emailRef = ref(database, 'users/' + myUID + '/email');
            onValue(emailRef, (snapshot) => {
            const data = snapshot.val();
            profileEmail.innerHTML = 'Your Email: ' + data;
            });
        }
    }
    else{// Klikannut jonkun profiilin nimen kohdalta
        if(profileName != null){
            const usernameRef = ref(database, 'users/' + profileUID + '/username');
            onValue(usernameRef, (snapshot) => {
            const data = snapshot.val();
            profileName.innerHTML = data;
            });
        }
        if(profileAge != null){
            const ageRef = ref(database, 'users/' + profileUID + '/birthday');
            onValue(ageRef, (snapshot) => {
            // saa hänen syntymävuosi
            const data = snapshot.val();
            let newDate = new Date(data);
            let onlyYear = newDate.getFullYear(); 
            //muuta syntymävuosi iäksi
            let today = new Date();
            let thisYear = today.getFullYear();
    
            let age = thisYear - onlyYear; // tämä vuosi(2022) - käyttäjän syntymävuosi (esim 2007) = ikä(15)
    
            profileAge.innerHTML = '(' + age + ')';
            });
        }
        if(profileEmail != null){
            const emailRef = ref(database, 'users/' + profileUID + '/email');
            onValue(emailRef, (snapshot) => {
            const data = snapshot.val();
            profileEmail.innerHTML = 'Your Email: ' + data;
            });
        }
    }
    
}

//validate functions
function validate_email(email){
    let expression = /^[^@]+@\w+(\.\w+)+\w$/
    if(expression.test(email) == true){
        //email ok
        return true
    }
    else{
        //email not ok
        return false
    }
}

function validate_password(password){
    // make sure that password lenght > 6
    if(password < 6){
        return false
    }
    else{
        return true
    }
}

function validate_field(field){
    if(field == null){
        return false
    }
    if(field.length <= 0){
        return false
    }else{
        return true
    }
}

function validate_birthday(birthday){
    //saa käyttäjän laittama vuosi
    let newDate = new Date(birthday);
    let onlyYear = newDate.getFullYear(); // get year of new date 
    // saa tämä vuosi
    let today = new Date();
    let thisYear = today.getFullYear();
    // saa käyttäjän ikä selville vähentämällä tämä vuosi käyttäjän antamasta vuodesta
    let age = thisYear - onlyYear;
    //tarkista käyttäjän ikä
    if(age >= 15){
        return true
    }
    else{
        return false
    }
}

setTimeout(() => {
    scroll();
}, 2500);


function scroll() {
    let params = window.location.search;
    let data = new URLSearchParams(params);
    let postiin = data.get("scroll");

    if (postiin !== null) {
        window.location.hash = postiin;
        console.log("try scroll");
    } else {
        console.log("scroll ei löydy");
    }
}