/*
  ********************
  -fetch specific transaction on the basis id of transaction
  -fill form initiall data with that transaction
  -allow user to edit transaction
  ********************
 */

/* global variables */

var firestore = firebase.firestore();
var auth = firebase.auth();
var transactionTitle = document.querySelector(".title");
var transactionCost = document.querySelector(".cost");
var transactionType = document.querySelector(".transactionType");
var transactionAt = document.querySelector(".transactionAt");
var transactionId = location.hash.substring(1, location.hash.length);
var transactionEditForm = document.querySelector(".transactionEditForm");

var fetchUserTransaction = async (transactionId) => {
  try {
    // fetch transaction
    var transaction = await firestore
      .collection("transactions")
      .doc(transactionId)
      .get();
    return transaction.data();
  } catch (error) {
    console.log(error.message);
  }
};

var settingUpInitiallFormData = ({
  title,
  cost,
  transactionType: transType,
  transactionAt: transAt,
}) => {


  // setting initiall values to form
  transactionTitle.value = title;
  transactionCost.value = cost;
  transactionType.value = transType;
  transactionAt.value = transAt.toDate().toISOString().split("T")[0];
};

// auth listner
auth.onAuthStateChanged(async (user) => {
  try {
    if (user) {
      // form initial value handling
      var transaction = await fetchUserTransaction(transactionId);

      settingUpInitiallFormData(transaction);
    } else {
      location.assign("./index.html");
      // console.log("user logged out");
    }
  } catch (error) {
    console.log(error.message);
  }
});



/* 
update tranasction function
  edit transaction
  make transaction obj  
  update taht transaction in firestore with new data
  redirect to dashboard !
*/

var updateTransaction = async (transactionId) => {
  try {
    var updatedTitle = transactionTitle.value;
    var updatedCost = transactionCost.value;
    var updatedType = transactionType.value;
    var updatedTransactionAt = transactionAt.value;
    // console.log(updatedTitle,updatedCost,updatedType,updatedTransactionAt);
    var updatedTransactionObj = {
      title: updatedTitle,
      cost: parseInt(updatedCost),
      transactionType: updatedType,
      transactionAt: new Date(updatedTransactionAt),
    };

    // sending updated values of transaction in firestore
    await firestore
      .collection("transactions")
      .doc(transactionId)
      .update(updatedTransactionObj);

    // after updated send user to dashboard page
    location.assign("./dashboard.html");
  } catch (error) {
    console.log(error.message);
  }
};

// delete tranasction function which take transaction id of transaction which is required to delete
var deleteTransaction = async (transactionId) => {
  try {
    // delete transaction from firestore
    await firestore.collection("transactions").doc(transactionId).delete();
    // after delete send user to dashboard page:
    location.assign("./dashboard.html");
  } catch (error) {
    console.log(error.message);
  }
};

// back-to button
var backToBtn = () => {
  //send user back to dashboard page
  location.assign("./dashboard.html");
};


// listener
transactionEditForm.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.id.includes("updateBtn")) {
    // listeners
    updateTransaction(transactionId);
  }
  if (e.target.id.includes("deleteBtn")) {
    deleteTransaction(transactionId);
    // console.log("delete btn click");
  }
  if (e.target.id.includes("backToBtn")) {
    backToBtn();
  } else {
    return;
  }
});
