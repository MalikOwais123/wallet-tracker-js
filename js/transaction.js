var firestore = firebase.firestore();
var auth = firebase.auth();
var transactionTitle = document.querySelector(".title");
var transactionCost = document.querySelector(".cost");
var transactionType = document.querySelector(".transactionType");
var transactionAt = document.querySelector(".transactionAt");
var transactionId = location.hash.substring(1, location.hash.length);

var updateBtn = document.querySelector(".transactionDetails");

var fetchUserTransaction = async (transactionId) => {
  try {
    // fetch transaction
    var transaction = await firestore
      .collection("transactions")
      .doc(transactionId)
      .get();
    // console.log(transaction.data());
    return transaction.data();
  } catch (error) {
    console.log(error.message);
  }
};

var editFormHandler = async (e, transactionId) => {
  e.preventDefault();

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

  // console.log(updatedTransactionObj);
};

// listeners
updateBtn.addEventListener("submit", (e) => editFormHandler(e, transactionId));

// auth listner
auth.onAuthStateChanged(async (user) => {
  try {
    if (user) {
      // form initial value handling
      var {
        title,
        cost,
        transactionType: transType,
        transactionAt: transAt,
      } = await fetchUserTransaction(transactionId);

      // setting initiall values to form
      transactionTitle.value = title;
      transactionCost.value = cost;
      transactionType.value = transType;
      transactionAt.value = transAt.toDate().toISOString().split("T")[0];
    } else {
      location.assign("./index.html");
      // console.log("user logged out");
    }
  } catch (error) {
    console.log(error.message);
  }
});


