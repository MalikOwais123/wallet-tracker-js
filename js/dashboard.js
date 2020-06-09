var firestore = firebase.firestore();
var auth = firebase.auth();
var nameDiv = document.querySelector(".name h3");
// console.log(nameDiv.textContent);

// fetch uid from url
var uid = location.hash.substring(1 ,location.hash.length)
// console.log(data.createdAt.toDate().toISOString().split("T")[0]);

var fetchUserInfo = async (uid) => {
    try {
        var userInfo = await firestore.collection("users").doc(uid).get();
        // console.log(userInfo.data());
        return userInfo.data();
        
    } catch (error) {
        console.log(error.message);
    }
}



// firebase auth listener (user sign in or sign out and when page reload at first time)

auth.onAuthStateChanged( async (user) => {
    if(user) {
        var {uid} = user;
        var userInfo = await fetchUserInfo(uid);
        // console.log(userInfo);

        // setting user info
        nameDiv.textContent = userInfo.fullName;
    } else {
        console.log("user logged out");
    }
})

