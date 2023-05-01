import { getFirestore, doc, collection, addDoc, getDoc, setDoc, getDocs, Timestamp, where, query } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";
const db = getFirestore();

let searchTags = sessionStorage.getItem("searchTags");
const postsRef = collection(db, "posts");
const searchQuery = query(postsRef, where("tags", "array-contains", searchTags));
const querySnapshot = await getDocs(searchQuery);

querySnapshot.forEach((doc) => {
    let data = doc.data();
  let interestedUsers = data.interestedUsers; //työhön tarjoutuneet array
  let jobLocation = data.jobLocation; //työn sijainti geopointtina
  let jobReward = data.jobReward; //palkkio
  let postOwner = data.postOwner; //postauksen tekijä
  let postDate = data.postDate; //postauspäivä ja aika
  let postExpDate = data.postExpDate; //postauksen vanhenemisaika
  let postHeader = data.postHeader; //postauksen otsikko
  let postText = data.postText; //postauksen leipäteksti
  let tags = data.tags; //tagit


  let article = document.createElement('article');

  //rakennetaan postauksen employmentTop-osa ja appendataan se employment-diviin
  let employment = document.createElement('div');
  employment.className = 'employment';
  let employmentTop = document.createElement('div');
  employmentTop.className = 'employmentTop';
  let employerProfileButton = document.createElement('button');
  employerProfileButton.className = 'employerProfileButton';
  let avatar = document.createElement('img');
  avatar.src = 'images/avatar_placeholder.png';
  avatar.alt = 'avatar';
  let profileName = document.createElement('a');
  profileName.href = 'profile.html';
  profileName.className = 'profileName';
  profileName.innerHTML = postOwner;
  let jobRequestButton = document.createElement('button');
  jobRequestButton.className = 'jobRequestButton';
  jobRequestButton.innerHTML = 'Tarjoudu työhön!'
    employerProfileButton.appendChild(avatar);
    employerProfileButton.appendChild(profileName);
    employmentTop.appendChild(employerProfileButton);
    employmentTop.appendChild(jobRequestButton);
    employment.appendChild(employmentTop);


//rakennetaan dates-osa, jossa postauspäivä ja vanhenemisaika ja appendataan se employmentToppiin
  let dates = document.createElement('div');
  dates.className = 'dates';
  let postDates = document.createElement('p');
  postDates.className = 'postDates';
  postDates.innerHTML = 'Ilmoitus jätetty: ' + postDate.toDate() + ' Ilmoitus vanhenee: ' + postExpDate;
  dates.appendChild(postDates);
  employmentTop.appendChild(dates);
  
  //rakennetaan palkkio ja appendataan employmentToppiin
  let reward = document.createElement('div');
  reward.className = 'jobReward';
  let postReward = document.createElement('p');
  postReward.className = 'reward';
  postReward.innerHTML = 'Palkkio: ' + jobReward + '€';
  reward.appendChild(postReward);
  employmentTop.appendChild(reward);

  //rakennetaan postauksen alempi osa employmentBottom
  let employmentBottom = document.createElement('div');
  employmentBottom.className = 'employmentBottom';
  let header = document.createElement('h3');
  header.className = 'postHeader';
  header.innerHTML = postHeader;
  let postTags = document.createElement('div');
  postTags.className = 'postTags';
  let jobTags = document.createElement('p');
  jobTags.className = 'postTags';
  jobTags.innerHTML = tags;
  postTags.appendChild(jobTags);
  let text = document.createElement('p');
  text.class = 'postText';
  text.innerHTML = postText;
  let bids = document.createElement('div');
  bids.class = 'userbids';
  let bidList = document.createElement('ul');


    //tehdään interestedUsers-arraysta HTML-lista postaukseen
  for (let i = 0; i < interestedUsers.length; i++) {
      let list = document.createElement('li');
      list.innerHTML = interestedUsers[i];
      bidList.appendChild(list);
  }

  let location = document.createElement('div');
  location.className = 'jobLocation';
  location.innerHTML = jobLocation;

  bids.appendChild(bidList);
  
  employmentBottom.appendChild(header);
  employmentBottom.appendChild(postTags);
  employmentBottom.appendChild(text);
  employmentBottom.appendChild(bids);
  employmentBottom.appendChild(location);
  employment.appendChild(employmentBottom);
  
  article.appendChild(employment);
  let indexMain = document.getElementById('indexMain');
  indexMain.appendChild(article);
});

const searchText = document.querySelector('.searchText');
const searchBtn = document.querySelector('#searchButton');

if(searchBtn != null){
  searchBtn.addEventListener('click', (event) => {
    event.preventDefault();
    let searchTags = searchText.value;
    sessionStorage.setItem("searchTags", searchTags);
    window.location.href = 'login.html';
  });
}

