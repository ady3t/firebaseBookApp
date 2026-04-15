import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore, collection, getDoc, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import firebaseConfig from "./firebaseConfig.js";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


async function getBooks(renderFun){
    let response = await fetch('./books.json');
    let books = await response.json();
    renderFun(books);
}

async function getReviews(isbn, renderFun){
    const reviewsRef = collection(db, 'reviews');
    const querySnapshot = await getDocs(reviewsRef);
    const reviews = [];

    querySnapshot.forEach((docSnap) => {
        
        if (docSnap.data().isbn === isbn) {
            reviews.push({
                id: docSnap.id,
                ...docSnap.data()
            });
        }
    });
    console.log(isbn);
    renderFun(reviews);
}

async function createReview(auth, isbn, text){
    const reviewData = {
        isbn,
        text,
        userId: auth.currentUser.uid,
        reviewer: auth.displayName || "Anonymous User"
    };
    addDoc(collection(db, "reviews"), reviewData)
}

async function deleteReview(authen, reviewId){
    const reviewRef = doc(db, 'reviews', reviewId);
    //console.log(reviewRef);
    const reviewDoc = await getDoc(reviewRef);
    //console.log(reviewDoc);
    // console.log(doc);
    if (reviewDoc.exists() && reviewDoc.data().userId === authen.currentUser.uid) {
        await deleteDoc(reviewRef);
        console.log("Review deleted successfully");
        return true;
    } 
        else{
        M.toast({html: "Review not found"});
        return false;
    }
}

export {getBooks, getReviews, createReview, deleteReview};