/* 
  *********************
  - auth related stuff
  - signup with custom email
  - signin with custom email
  - signin with google
  *********************
*/

// firebase.firestore().settings({ experimentalForceLongPolling: true });

/* global variables */
var auth = firebase.auth();
var firestore = firebase.firestore();
var signinForm = document.querySelector(".signinForm");
var signupForm = document.querySelector(".signupForm");
var googleBtn = document.querySelector(".googleBtn");

/* global functions */

// signup function
// collect form values
// create user on firebase auth
// id returned by firebase auth is used to make user collection and store user info
// format user data in object
// store data in firestore
// redirect to dashboard page with user id

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

      // initiallize object that will hold user info
      var userInfo = {
        fullName,
        email,
        createdAt: new Date(),
      };
      // store user data in firestore
      await firestore.collection("users").doc(uid).set(userInfo);
    }
  } catch (error) {
    alert(error.message);
  }
};

// signin function
// collect email and password
// logged already exist user
// redirect to dashboard page with user id

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
    }
  } catch (error) {
    alert(error.message);
  }
};

// sign in with google!
// use google provider to authenticate user with popup
// if new user
// fetch user info from google
// format user data in object
// store that user data in firestore

// if old user
// redirect to dashboard page with user id

var googleSignIn = async () => {
  try {
    var googleProvider = new firebase.auth.GoogleAuthProvider();

    //If there is only one account the user is signed into
    //via a Google Service no "Account Picker" shows up
    //to overcome this issue we can use this method
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });

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
        fullName: displayName,
        email,
        createdAt: new Date(),
      };
      await firestore.collection("users").doc(uid).set(userInfo);
      // redirect user
      location.assign(`./dashboard.html#${uid}`);
    } else {
      // redirect user
      location.assign(`./dashboard.html#${uid}`);
    }
  } catch (error) {
    alert(error.message);
  }
};

// event listener on forms

signinForm.addEventListener("submit", (e) => signinFormSubmission(e));
signupForm.addEventListener("submit", (e) => signupFormSubmission(e));
googleBtn.addEventListener("click", googleSignIn);

// firebase is like facebook means it will never make user signout untill unless
// user press the signout button

// firebase auth listener
// thid listener will trigger on the follwing conditions
// initiall page load
// on auth state changed
auth.onAuthStateChanged(async (user) => {
  if (user) {
    var { uid } = user;
    // redirect user
    location.assign(`./dashboard.html#${uid}`);
  }
});

/* ****************************************************************** */
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
