'use strict'

import { getFirestore, doc, collection, addDoc, getDoc, setDoc, getDocs, Timestamp, where, query } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";
const db = getFirestore();
//haku scriptit

const searchText = document.querySelector('.searchText');
const searchBtn = document.querySelector('#searchButton');
if(searchBtn != null){
    searchBtn.addEventListener('click', (event) => {
        event.preventDefault();
        let searchTags = searchText.value;
        sessionStorage.setItem("searchTags", searchTags);
        window.location.href = 'search.html';
    });
}

const createNewPostButton = document.querySelector('#createNewPostButton');
if(createNewPostButton != null){
  createNewPostButton.addEventListener('click', (event) =>{
    window.location.href = 'newPost.html';
  })
}




//Tästä alkaa työpostauksiin liittyvä koodi
// Haetaan firestore-tietokanta


//iteroidaan posts-nimisen collectionin läpi ja luodaan datasta postaukset sivulle
const querySnapshot = await getDocs(collection(db, "posts"));

let i = 0; // muuttuja post id looppia varten

querySnapshot.forEach((doc) => {
  
  let data = doc.data();
  let interestedUsers = data.interestedUsers; //työhön tarjoutuneet array
  //let jobLocation = data.jobLocation; //työn sijainti geopointtina
  let jobReward = data.jobReward; //palkkio
  let postOwner = data.postOwner; //postauksen tekijä
  let postDate = data.postDate; //postauspäivä ja aika
  let postExpDate = data.postExpDate; //postauksen vanhenemisaika
  let postHeader = data.postHeader; //postauksen otsikko
  let postText = data.postText; //postauksen leipäteksti
  let tags = data.postTags/*tags*/; //tagit

  let postID = querySnapshot._snapshot.docChanges[i].doc.key.path.segments[6]; // otetaan arraysta post id:t

  let article = document.createElement('article');

  //rakennetaan postauksen employmentTop-osa ja appendataan se employment-diviin
  let employment = document.createElement('div');
  employment.id = postID;
  employment.className = 'employment';
  let employmentTop = document.createElement('div');
  employmentTop.className = 'employmentTop';
  let employerProfileButton = document.createElement('button');
  employerProfileButton.className = 'employerProfileButton';
  let avatar = document.createElement('img');
  avatar.src = 'images/avatar_placeholder.png';
  avatar.alt = 'avatar';
  let profileName = document.createElement('a');
  profileName.href = `profile.html?UID=${postOwner}`;
  profileName.className = 'profileName';
  profileName.innerHTML = postOwner;
  let jobRequestButton = document.createElement('button');
  jobRequestButton.className = 'jobRequestButton';
  jobRequestButton.innerHTML = `<a href="map.html?ID=${postID}">Katso kartalta</a>`;


//rakennetaan dates-osa, jossa postauspäivä ja vanhenemisaika ja appendataan se employmentToppiin
  /*let dates = document.createElement('div');
  dates.className = 'dates';
  let postDates = document.createElement('p');
  postDates.className = 'postDates';
  postDates.innerHTML = 'Ilmoitus jätetty: ' + postDate.toDate() + ' Ilmoitus vanhenee: ' + postExpDate.toDate();
  dates.appendChild(postDates);*/
  
  
  //rakennetaan palkkio ja appendataan employmentToppiin
  let reward = document.createElement('div');
  reward.className = 'jobReward';
  let postReward = document.createElement('p');
  postReward.className = 'reward';
  postReward.innerHTML = 'Palkkio: ' + jobReward + '€';
  reward.appendChild(postReward);

  //rakennetaan postauksen alempi osa employmentBottom
  let employmentBottom = document.createElement('div');
  employmentBottom.className = 'employmentBottom';
  let header = document.createElement('p');
  header.className = 'postHeader';
  header.innerHTML = postHeader;
  let postTags = document.createElement('div');
  postTags.className = 'postTags';
  let jobTags = document.createElement('p');
  jobTags.className = 'postTags';
  jobTags.innerHTML = 'Tagit: ' + tags;
  postTags.appendChild(jobTags);
  let text = document.createElement('p');
  text.class = 'postText';
  text.innerHTML = postText;
  let bids = document.createElement('div');
  bids.class = 'userbids';
  let bidList = document.createElement('ul');
  bids.appendChild(bidList);


    //tehdään interestedUsers-arraysta HTML-lista postaukseen
  /*for (let i = 0; i < interestedUsers.length; i++) {
      let list = document.createElement('li');
      list.innerHTML = interestedUsers[i];
      bidList.appendChild(list);
  }*/

  /*let location = document.createElement('div');
  location.className = 'jobLocation';
  location.innerHTML = jobLocation;*/


  //Rakennetaan postauksen yläosa EmploymentTop
  employerProfileButton.appendChild(avatar);
  employerProfileButton.appendChild(profileName);
  employmentTop.appendChild(employerProfileButton);
  employmentTop.appendChild(reward);
  employment.appendChild(employmentTop); //appendataan employment-diviin
  
  //Rakennetaan postauksen alaosa employmentBottom
  employmentBottom.appendChild(header);
  employmentBottom.appendChild(text);
  employmentBottom.appendChild(postTags);
  employmentBottom.appendChild(jobRequestButton);
  //employmentBottom.appendChild(location);
  employment.appendChild(employmentBottom); // appendataan employment-diviin
  
  article.appendChild(employment); //appendataan article-diviin, joka edustaa yhtä postausta
  let indexMain = document.getElementById('indexMain');
  indexMain.appendChild(article);
  i++;
});


