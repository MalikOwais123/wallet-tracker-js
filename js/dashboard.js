var firestore = firebase.firestore();
var auth = firebase.auth();
var nameDiv = document.querySelector(".name h3");
var signoutBtn = document.querySelector(".signoutBtn");
var transactionForm = document.querySelector(".transactionForm");
var uid = null;
var transactionList = document.querySelector(".transactionList");

// console.log(nameDiv.textContent);
// fetch uid from url
// var uid = location.hash.substring(1 ,location.hash.length)
// console.log(data.createdAt.toDate().toISOString().split("T")[0]);

var renderTransactions = (transactionArr) => {
  transactionArr.forEach((transaction, index) => {
    var { title, cost, transactionAt } = transaction;
    transactionList.insertAdjacentHTML(
      "beforeend",
      `<div class="transactionListItem">
            <div class="renderIndex listItem">
                <h3>${++index}</h3>
            </div>
            <div class="renderTitle listItem">
                <h3>${title}</h3>
            </div>
            <div class="renderCost listItem">
                <h3>${cost}RS</h3>
            </div>
            <div class="rendertransactionAt listItem">
                <h3>${transactionAt}</h3>
            </div>
        </div>`
    );
  });
};

var userSignout = async () => {
  await auth.signOut();
};

var transactionFormSubmission = async (e) => {
  e.preventDefault();
  try {
    var title = document.querySelector(".title").value;
    var cost = document.querySelector(".cost").value;
    var transactionType = document.querySelector(".transactionType").value;
    var transactionAt = document.querySelector(".transactionAt").value;
    // console.log(cost, title, transactionAt, transactionType);

    if (title && cost && transactionAt && transactionType) {
      var transactionObj = {
          title,
          cost,
          transactionType,
          transactionAt: new Date(transactionAt),
          transactionBy: uid,
        };
        await firestore.collection("transactions").add(transactionObj);
    } else {
        console.log("not submitted!");
    }
} catch (error) {
    console.log(error.message);
}
};

var fetchTransactions = async (uid) => {
    try {
        var transactions = [];
        var query = await firestore.collection("transactions").where("transactionBy","==",uid).get();
        // function here we use is actually provided by firebase
        query.forEach((doc) => {
            console.log(doc.data());
        })
    } catch (error) {
        console.log(error.message);
    }
}




var fetchUserInfo = async (uid) => {
  try {
    var userInfo = await firestore.collection("users").doc(uid).get();
    // console.log(userInfo.data());
    return userInfo.data();
  } catch (error) {
    console.log(error.message);
  }
};

// firebase auth listener
// (user sign in or sign out and when page reload at first time)
// when page is reload it will check state
// whenever state is change this event will occur
auth.onAuthStateChanged(async (user) => {
  if (user) {
    // var {uid} = user;
    uid = user.uid;
    var userInfo = await fetchUserInfo(uid);
    // console.log(userInfo);

    // setting user info
    nameDiv.textContent = userInfo.fullName;
    // render transaction steps
    // 1) fetch transaction from firebase
    await fetchTransactions(uid);
    // 2) render transaction in html through js
    
    // renderTransactions(transArr);
  } else {
    location.assign("./index.html");
    // console.log("user logged out");
  }
});


signoutBtn.addEventListener("click", userSignout);
transactionForm.addEventListener("submit", (e) => transactionFormSubmission(e));
