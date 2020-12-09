const localStorageAppData = JSON.parse(localStorage.getItem("appData"));
let appData = localStorageAppData ? localStorageAppData : [];

//function to check if user logged in
const isUserLoggedIn = () => {
  let currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    document.getElementById("userLogin").style.display = "none";
    document.getElementById("groceryList").style.display = "block";
    document.getElementById("userName").innerHTML = `USERNAME : ${currentUser}`;
    document.getElementById("remainingItem").innerHTML = `5 item can be added`;
    let userData = getUserData();
    userData.groceryItems.map((groceryItem) => appendGroceryItem(groceryItem));
  } else {
    document.getElementById("groceryList").style.display = "none";
    document.getElementById("userLogin").style.display = "block";
  }
};

//login user and set current user
const loginUser = (event) => {
  event.preventDefault();
  const userName = document.getElementById("userNameField").value;
  localStorage.setItem("currentUser", userName);
  if (!getUserData()) {
    appData.length > 2 && appData.pop();
    appData.unshift({ userName: userName, groceryItems: [] });
  }
  localStorage.setItem("appData", JSON.stringify(appData));
  isUserLoggedIn();
  document.getElementById("userNameField").value = "";
};

//logout user and remove current user from local storage
const logoutUser = () => {
  localStorage.removeItem("currentUser");
  deleteAllGroceryItem();
  document.getElementById("remainingItem").innerHTML = "";
  document.getElementById("error").innerHTML = "";
  isUserLoggedIn();
};

//add grocery item in local storage and dom
const addGroceryItem = (event) => {
  event.preventDefault();
  const groceryItem = document.getElementById("groceryItem").value;
  let userData = getUserData();
  if (groceryItem === "" || groceryItem === " ") {
    document.getElementById("error").innerHTML = "*Required";
    return;
  } else {
    if (userData.groceryItems.indexOf(groceryItem) === -1) {
      if (userData.groceryItems.length < 5) {
        appendGroceryItem(groceryItem);
        userData.groceryItems.push(groceryItem);
        setUserData(userData);
      } else {
        alert("Only Five Item can be added");
      }
      document.getElementById("groceryItem").value = "";
    } else {
      document.getElementById("error").innerHTML = "Already present";
    }
  }
};

// delete all the grocery item from dom 
const deleteAllGroceryItem = () => {
  const groceryListContainer = document.getElementById("groceryListContainer");
  let i = 0;
  while (i < groceryListContainer.childElementCount) {
    groceryListContainer.removeChild(groceryListContainer.childNodes[0]);
  }
};

//delete single grocery item from local storage
const deleteGroceryItem = (groceryItem) => {
  let userData = getUserData();
  userData.groceryItems = userData.groceryItems.filter((item) => item !== groceryItem);
  setUserData(userData);
  refreshList();
};

//Append grocery item in dom
const appendGroceryItem = (groceryItem) => {
  const groceryListContainer = document.getElementById("groceryListContainer");

  const groceryItemLi = document.createElement("li");

  groceryItemLi.classList.add("groceryItem");
  groceryItemLi.innerHTML = `<h3>${groceryItem}</h3>`;

  const editButton = document.createElement("button");
  editButton.classList.add("button");
  editButton.classList.add("buttonBlue");
  editButton.innerHTML = "Edit";
  editButton.addEventListener("click", () => editGroceryItem(groceryItem));

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("button");
  deleteButton.classList.add("buttonRed");
  deleteButton.innerHTML = "delete";
  deleteButton.addEventListener("click", () => deleteGroceryItem(groceryItem));

  groceryItemLi.appendChild(deleteButton);
  groceryItemLi.appendChild(editButton);

  groceryListContainer.appendChild(groceryItemLi);
  updateNumberOfGroceryItemLeft()
};

//get user data from localStorage
const getUserData = () => {
  const currentUser = localStorage.getItem("currentUser");
  return appData.filter((item) => item.userName === currentUser)[0];
};

//update user data in localStorage
const setUserData = (data) => {
  const tempData = appData.map((item) => (item.userName === data.userName ? data : item));
  localStorage.setItem("appData", JSON.stringify(tempData));
};

//refresh the grocery list dom
const refreshList = () => {
  deleteAllGroceryItem();
  const userData = getUserData();
  userData.groceryItems.map((groceryItem) => appendGroceryItem(groceryItem));
  updateNumberOfGroceryItemLeft();
};

//update the number of grocery item left
const updateNumberOfGroceryItemLeft = () => {
  const groceryListContainer = document.getElementById("groceryListContainer");
  const numberOfChild = groceryListContainer.childElementCount;
  document.getElementById("remainingItem").innerHTML = `${5 - numberOfChild} item can be added`;
}

//set value in dialog edit dialog box and toggle edit dialog
const editGroceryItem = (groceryItem) => {
  document.getElementById("editGroceryItem").value = groceryItem;
  document.getElementById("editGroceryItemBackup").value = groceryItem;
  toggleDialog();
};

//update grocery item
const updateGroceryItem = (event) => {
  event.preventDefault();
  const oldGroceryItem = document.getElementById("editGroceryItemBackup").value;
  const updatedGroceryItem = document.getElementById("editGroceryItem").value;

  if (updatedGroceryItem.trim() === "" || updatedGroceryItem === " ") {
    document.getElementById("updateError").innerHTML = "*Required";
  } else {
    let userData = getUserData();
    userData.groceryItems = userData.groceryItems.map((item) => (item === oldGroceryItem ? updatedGroceryItem : item));
    setUserData(userData);
    refreshList();
    toggleDialog();
    document.getElementById("updateError").innerHTML = "";
  }
};

// toggle for edit dialog
const toggleDialog = () => {
  const display = document.getElementById("editDialog").style.display;
  display === "block"
    ? (document.getElementById("editDialog").style.display = "none")
    : (document.getElementById("editDialog").style.display = "block");
};
