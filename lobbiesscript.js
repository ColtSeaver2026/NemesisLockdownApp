const firebaseConfig = {
  apiKey: "AIzaSyCgAbaZ3bmmQG_bAAbnq6_Q6E7yW4_xv_A",
    authDomain: "nemesis-ld.firebaseapp.com",
    projectId: "nemesis-ld",
    storageBucket: "nemesis-ld.firebasestorage.app",
    messagingSenderId: "580839432274",
    appId: "1:580839432274:web:edc1bbdfd724721018ff8b",
    measurementId: "G-WHHS9TP2FW",

    databaseURL: "https://nemesis-ld-default-rtdb.europe-west1.firebasedatabase.app"

};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* -------------------- */
/* Variablen */
/* -------------------- */

let currentRoomId=""


/* -------------------- */
/* Button */
/* -------------------- */

const createRoomBtn = document.getElementById("create-room-btn");
const createBtn = document.getElementById("create-btn");
const cancelBtn = document.getElementById("cancel-btn");
const enterBtn = document.getElementById("enter-btn")
const cancelPasswordBtn = document.getElementById("cancel-password-btn")


/* -------------------- */
/* Input */
/* -------------------- */

const roomName = document.getElementById("room-name");

const modalCreate = document.getElementById("modal-create");
const modalPassword = document.getElementById("ask-password")




createRoomBtn.addEventListener("click", ()=>{
  
  modalCreate.classList.remove("hidden")
  
})


createBtn.addEventListener("click", () => {

    const name = roomName.value.trim();
    const password = roomPassword.value.trim(); 

    if (name.length === 0) {
        console.log("BITTE EINGABE VORNEHMEN.");
        return;
    }
  
    if(password.length === 0){
      console.log("BITTE PASSWORT EINGEBEN")
      return
    }

    const roomId = generateRoomCode();

    db.ref(`rooms/${roomId}`).set({
        name: name,
        password: password,
        xenoEvent: false,
        deathEvent: false,
        alarmEvent: false, 
        selfdestructEvent: false, 
        createdAt: Date.now()
    });
  
  
    localStorage.setItem("NemesisRoomId", roomId);
    localStorage.setItem(`${roomId}-NemesisRole`, "host");

    console.log("Raum erstellt:", roomId);

    modalCreate.classList.add("hidden");
  
    window.location.href = `https://codepen.io/TimoCode/pen/pvRrrmr?room=${roomId}`;

});



cancelBtn.addEventListener("click", ()=>{
  modalCreate.classList.add("hidden");
})




function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}



function renderRoom(roomId, roomData) {

    
    const container = document.getElementById("room-list");

    const roomEl = document.createElement("div");
    roomEl.classList.add("room");

    const title = document.createElement("h3");
    title.textContent = roomData.name || "Unbenannte Lobby";

    const idText = document.createElement("p");
    idText.textContent = `ID: ${roomId}`;

    const joinBtn = document.createElement("button");
    joinBtn.textContent = "Beitreten";

    joinBtn.addEventListener("click", () => {
        
        currentRoomId = roomId;
        
        modalPassword.classList.remove("hidden")
           
    });
  

    roomEl.appendChild(title);
    roomEl.appendChild(idText);
    roomEl.appendChild(joinBtn);

    container.appendChild(roomEl);
}


  enterBtn.addEventListener("click", ()=>{
    
      const enteredPassword = document.getElementById("enter-password").value.trim()
      
      db.ref(`rooms/${currentRoomId}/password`).once("value").then((snapshot) => {
        
          const passwordInDb = snapshot.val();
        
          if(enteredPassword==passwordInDb){
            
            
            localStorage.setItem(`${currentRoomId}-NemesisRole`, currentRoomId);
            joinRoom(currentRoomId)
     
          }
        
        else{
          console.log("FALSCHES PASSWORT")
        }

        
      })


    });
  
    cancelPasswordBtn.addEventListener("click", ()=>{
      modalPassword.classList.add("hidden")
      
    });


function joinRoom(roomId) {

    window.location.href = `https://codepen.io/TimoCode/pen/pvRrrmr?room=${roomId}`;

}





/* -------------------- */
/* Firebase Listener in Javascript */
/* -------------------- */


db.ref("rooms").on("value", (snapshot) => {

    const data = snapshot.val();

    const container = document.getElementById("room-list");
    container.innerHTML = ""; // wichtig: vorher leeren

    if (!data) return;

    Object.entries(data).forEach(([roomId, roomData]) => {
        renderRoom(roomId, roomData);
    });
});







