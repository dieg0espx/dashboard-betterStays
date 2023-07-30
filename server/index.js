const { initializeApp } = require("firebase/app");
const firebaseConfig = {
  apiKey: "AIzaSyBxItFltQlcaFl5OqDlSyQbX1BuEXieVnY",
  authDomain: "betterstay-33577.firebaseapp.com",
  projectId: "betterstay-33577",
  storageBucket: "betterstay-33577.appspot.com",
  messagingSenderId: "132048561469",
  appId: "1:132048561469:web:46b87f20cabbcf61751154"
};

const appFirebase = initializeApp(firebaseConfig);
const {doc, getDoc, getFirestore, updateDoc } = require("firebase/firestore");


const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const PORT = 3002;


app.use(express.json()); // This will parse JSON bodies
app.use(express.urlencoded({ extended: true })); // This will parse URL-encoded bodies


async function getToken(){
  let token;
  const db = getFirestore(appFirebase);
  const tokenRef = doc(db, "token", "token");
  const docSnap = await getDoc(tokenRef);
  if (docSnap.exists()) {
      token = docSnap.data().token;
  } else {
    console.log("TOKEN NOT FOUND IN FIREBASE");
  }
  return token
}

// ======= PUTTING ALL ID'S INTO A STRING ======= //
let propertiesID = [
{name: "The Pool House",     id:"638a965985cf74003f7b34e6"},
{name: "Mariogold",          id:"627c1ef89d63b2003223d578"},
{name: "Golfers Retreat",    id:"63670920fe8aa4007565c9d2"},
{name: "The Lake House",     id:"63f03e1ce78efd003ec4d7de"},
{name: "Sentinel",           id:"62a297f98d4ca500310bf165"},
{name: "Oak Park Game Room", id:"643596e34613d0003620b962"},
{name: "Landstrom",          id:"627c1f19b8ff0000368578ce"},
{name: "Tuneberg",           id:"627c1f09c01e3a00346b803b"},
{name: "Mario's Pad",        id:"6435af6b4613d0003623178c"},
]
let allIDs = '';
for (let i = 0; i < propertiesID.length; i++) {
  i > 0 ? allIDs += "," + propertiesID[i].id : allIDs = propertiesID[i].id
}




app.get("/api/multipleCalendar", async (req,res)=>{
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Bearer ' + await getToken()
    }
  };
  const { start, end } = req.query;
  fetch('https://open-api.guesty.com/v1/availability-pricing/api/calendar/listings?listingIds=' + allIDs + '&startDate=' + start + '&endDate=' + end, options)
  .then(response => response.json())
  .then(response => {
    return res.status(200).json(response);
  })
  .catch(err => console.error(err));
});


app.get("/api/getAllCustomers", async (req,res)=>{
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Bearer ' + await getToken()
    }
  };
  fetch('https://open-api.guesty.com/v1/guests-crud?columns=fullName%20guestEmail%20guestPhone', options)
  .then(response => response.json())
  .then(response => {
    return res.status(200).json(response);
  })
  .catch(err => console.error(err));
});



app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})