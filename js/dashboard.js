/*
  extra info in this page-------
  // console.log(nameDiv.textContent);
  // fetch uid from url
  // var uid = location.hash.substring(1 ,location.hash.length)
  // console.log(data.createdAt.toDate().toISOString().split("T")[0]);
*/




/* 
  *********************
  -render page data
    -render user info
    -render user transaction
  -add transaction via transaction form
  *********************
*/

/* ------global variables----- */

var firestore = firebase.firestore();
var auth = firebase.auth();
var nameDiv = document.querySelector(".name h3");
var signoutBtn = document.querySelector(".signoutBtn");
var transactionForm = document.querySelector(".transactionForm");
var uid = null;
var transactionList = document.querySelector(".transactionList");

// render functions

var fetchUserInfo = async (uid) => {
  try {
    var userInfo = await firestore.collection("users").doc(uid).get();
    // console.log(userInfo.data());
    return userInfo.data();
  } catch (error) {
    console.log(error.message);
  }
};

// render user info
// fetch user info with his/her id
// display user info on navbar

var renderUserInfo = async (uid) => {
  try {
    // uid = user.uid;
    var userInfo = await fetchUserInfo(uid);
    // setting user info
    nameDiv.textContent = userInfo.fullName;
  } catch (error) {
    console.log(error.message);
  }
};

// total cost
var totalCostTransaction = (transArr) => {
  var amountDiv = document.querySelector(".amount h2");
  var totalCost = 0;
  // here loop to each transaction
  transArr.forEach((transaction) => {
    var { cost, transactionType } = transaction;
    if (transactionType === "income") {
      totalCost = totalCost + cost;
    } else {
      totalCost = totalCost - cost;
    }
  });
  amountDiv.textContent = `${totalCost} RS`;
  // console.log(totalCost);
};

var fetchTransactions = async (uid) => {
  try {
    var transactions = [];
    var query = await firestore
      .collection("transactions")
      .where("transactionBy", "==", uid)
      .orderBy("transactionAt", "desc")
      .get();
    // function here we use is actually provided by firebase
    query.forEach((doc) => {
      // here we fetch transactionId having doc.id in it
      // console.log({...doc.data() , transactionId : doc.id});
      transactions.push({ ...doc.data(), transactionId: doc.id });
    });
    // console.log(transactions);
    return transactions;
  } catch (error) {
    console.log(error.message);
  }
};

// render user transaction
// fetch user transaction
// calculate his/her current amount on the bases of fetch transctions
// display current amount on navbar
// display transaction list

var renderTransactions = async (uid) => {
  // fetch user transaction
  var transactionArr = await fetchTransactions(uid);
  // setting total Cost of user
  totalCostTransaction(transactionArr);

  // display all user
  transactionList.innerHTML = " ";
  transactionArr.forEach((transaction, index) => {
    var {
      title,
      cost,
      transactionAt,
      transactionId,
      transactionType,
    } = transaction;
    transactionList.insertAdjacentHTML(
      "beforeend",
      `<div class= transactionListItem >
            <div class="renderIndex listItem">
                <h3>${++index}</h3>
            </div>
            <div class="renderTitle listItem">
                <h3>${title}</h3>
            </div>
            <div class="renderCost listItem">
                <h3>${cost}RS</h3>
            </div>
            <div class='listItem ${
              transactionType === "income" ? "incomeIcon" : "expenseIcon"
            }'>
                <i class="fas fa-money-bill-wave"></i>
            </div>
            <div class="rendertransactionAt listItem">
                <h3>${transactionAt.toDate().toISOString().split("T")[0]}</h3> 
            </div>
            <div class="rendertransactionAt listItem">
              <a href = "./transaction.html#${transactionId}"><button type = "button" class="styleBtn">Edit</button></a>
            </div>
            
        </div>`
    );
  });
};



// add transactions
// collect form data
// make transaction object
// send transaction object to firestore

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
        cost: parseInt(cost),
        transactionType,
        transactionAt: new Date(transactionAt),
        transactionBy: uid,
      };
      await firestore.collection("transactions").add(transactionObj);
      
      // render freash transaction steps
      renderTransactions(uid);
    }
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
    uid = user.uid;
    // renderuser info
    renderUserInfo(uid);

    // rende user transaction
    renderTransactions(uid);
  } else {
    location.assign("./index.html");
  }
});



var userSignout = async () => {
  await auth.signOut();
};

// listener

signoutBtn.addEventListener("click", userSignout);
transactionForm.addEventListener("submit", (e) => transactionFormSubmission(e));
