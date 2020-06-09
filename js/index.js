// firebase.firestore().settings({ experimentalForceLongPolling: true });
var auth = firebase.auth();
var firestore = firebase.firestore();
// fetch form
var signinForm = document.querySelector(".signinForm");
var signupForm = document.querySelector(".signupForm");
var googleBtn = document.querySelector(".googleBtn");


// sign in with google!
var googleSignIn = async () => {
  try {
    var googleProvider = new firebase.auth.GoogleAuthProvider();

    //If there is only one account the user is signed into
    //via a Google Service no "Account Picker" shows up
    //to overcome this issue we can use this method
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });

    // var loggedUser = await firebase.auth().signInWithPopup(googleProvider);
    // console.log(loggedUser);
    // now destructuring object
    var {
      additionalUserInfo: { isNewUser },
      user: { displayName, uid, email },
    } = await firebase.auth().signInWithPopup(googleProvider);
    // console.log(additionalUserInfo);

    // if user is new (first time sign in) then store info in firebase
    if (isNewUser) {
      // store user data in firestore
      var userInfo = {
          fullName : displayName,
          email ,
          createdAt : new Date()
      }
      await firestore.collection("users").doc(uid).set(userInfo);
      console.log("done");
      // redirect user
      location.assign(`./dashboard.html#${uid}`);
    } else {
        console.log("welcome again!");
      // redirect user
      location.assign(`./dashboard.html#${uid}`);
    }
  } catch (error) {
    console.log(error.message);
  }
};


var signinFormSubmission = async (e) => {
    e.preventDefault();
    try {
        var email = document.querySelector(".signinEmail").value;
        var password = document.querySelector(".signinPassword").value;
    // empty string is always false
    if (email && password) {
        // login user
        var {
            user: { uid },
        } = await auth.signInWithEmailAndPassword(email, password);
        // console.log(userSignIn.user.uid);   this is long syntax for this we use destructuring
        // console.log(uid);
        
        // fetch user Info
        // var userInfo = await firestore.collection("users").doc(uid).get();
        // console.log(userInfo.data());
        
        // redirect user
        location.assign(`./dashboard.html#${uid}`);
    }
} catch (error) {
    console.log(error.message);
}
};


var signupFormSubmission = async (e) => {
    e.preventDefault();
    try {
        var fullName = document.querySelector(".signupFullName").value;
        var email = document.querySelector(".signupEmail").value;
        var password = document.querySelector(".signupPassword").value;
        
        // empty string is always false
        if (fullName && email && password) {
            // create user in auth section
            var {
                user: { uid },
            } = await auth.createUserWithEmailAndPassword(email, password);
            // console.log(uid);
            
            // store user data in firestore
            var userInfo = {
        fullName,
        email,
        createdAt: new Date(),
    };
    // console.log(userInfo);
    await firestore.collection("users").doc(uid).set(userInfo);
    console.log("done");
    
    // redirect user
    location.assign(`./dashboard.html#${uid}`);
}
} catch (error) {
    console.log(error.message);
}
};

// event listener on forms
signinForm.addEventListener("submit", (e) => signinFormSubmission(e));
signupForm.addEventListener("submit", (e) => signupFormSubmission(e));
googleBtn.addEventListener("click", googleSignIn);



// destructuring (new way of array and object)
// array:
// var arr = [1,2,3]
// console.log(arr[0],arr[1],arr[2]);

// var [a1,a2,a3] = [1,2,3];
// console.log(a1,a2,a3);

// object:
// var person = {
//     name : "Ali",
//     age : 12,
//     subjects : {
//         major : "english",
//         minor : "math"
//     }
// }

// console.log(person.name,person.age);
// console.log(person.subjects.major,person.subjects.minor);

// here name matters
// var {name,age,subjects} = person;
// var {name,age,subjects : {major,minor}} = person;

// console.log(name,age);
// console.log(major,minor);
