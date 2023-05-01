// newPost.html scriptit
import { getFirestore, doc, collection, addDoc, getDoc, setDoc, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";

if(true){
    const newPostForm = document.querySelector('.newPostForm');
        
    newPostForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const db = getFirestore();
        const postTitle = newPostForm.elements['postTitle'];
        const postText = newPostForm.elements['postText'];
        const jobReward = newPostForm.elements['jobReward'];
        const postExpDate = newPostForm.elements['postExpDate'];
        const postTags = newPostForm.elements['postTags'];
        let postDate = Timestamp.fromDate(new Date());
        const tagArray = postTags.value.split(",");
        const postFullName = document.querySelector('#postFullName').value;
    
        
        
        await addDoc(collection(db, "posts"), {
            postHeader: postTitle.value,
            postText: postText.value,
            jobReward: jobReward.value,
            postExpDate: postExpDate.value,
            postTags: tagArray,
            postDate: postDate,
            postOwner: postFullName,
        });
        alert('Uusi ilmoitus tehty');
    });/*
    btnSubmit.addEventListener('click', function(){
        
        
        addDoc(collection(db, "posts"), {
            postHeader: postTitle.value,
            postText: postText.value,
            jobReward: jobReward.value,
            postExpDate: postExpDate.value,
            postTags: tagArray,
            postDate: postDate,
            postOwner: postFullName,
        })
        .catch((error) => {
            //firebase käyttää tätä heidän erroreihin
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });
    });*/
}



