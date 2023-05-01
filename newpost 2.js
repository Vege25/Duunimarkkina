// newPost.html scriptit

import { getFirestore, doc, collection, addDoc, getDoc, setDoc, getDocs, Timestamp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js";

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

    
    
    await addDoc(collection(db, "posts"), {
        postHeader: postTitle.value,
        postText: postText.value,
        jobReward: jobReward.value,
        postExpDate: postExpDate.value,
        postTags: postTags.value,
        postDate: postDate,
    });
});


