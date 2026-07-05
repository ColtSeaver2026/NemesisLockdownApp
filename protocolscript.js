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



const switchToMap = document.getElementById("switchToMap");

switchToMap.addEventListener("click", () => {
  location.href = "https://coltseaver2026.github.io/NemesisLockdownApp/map.html";
});

const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", () => {
  
  localStorage.removeItem(`NemesisGameRoom-${roomId}`)

  // optional: sofort visuell resetten (ohne reload wäre noch sauberer)
  document.querySelectorAll(".mission-tile.active")
    .forEach(el => el.classList.remove("active"));

  document.querySelectorAll(".task-tile.completed")
    .forEach(el => el.classList.remove("completed"));
  
  
  if(role==="host"){
  db.ref(`rooms/${roomId}/xenoEvent`).set(false);
  db.ref(`rooms/${roomId}/deathEvent`).set(false);
  db.ref(`rooms/${roomId}/alarmEvent`).set(false);
  db.ref(`rooms/${roomId}/selfdestructEvent`).set(false);
  }

  location.reload();
});


const eventSidebar = document.getElementById("event-sidebar");

/* TASKS */
const signalTask = document.getElementById("signal-task");
const knowledgeTask = document.getElementById("knowledge-task");
const kapselTask = document.getElementById("kapsel-task");
const isolationTask = document.getElementById("isolation-task");
const escapeTask = document.getElementById("escape-task");
const contaminationTask = document.getElementById("contamination-task");

/* BUTTONS */
const rescueButton = document.querySelector(".rescue-btn");

/* EVENTS */
const xenoEvent = document.getElementById("xeno-event");
const deathEvent = document.getElementById("death-event");
const alarmEvent = document.getElementById("alarm-event");
const selfdestructEvent = document.getElementById("selfdestruct-event");
const contaminationEvent = document.getElementById("contamination-event");

/* Hint */
const kapselHint = document.getElementById("kapsel-hint");
const isolationHint = document.getElementById("isolation-hint")

/* MODAL */
const modal = document.getElementById("event-modal");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const closeModal = document.getElementById("close-modal");


/* room-info */
const roomInfo = document.getElementById("room-info");



/* -------------------- */
/* Initialisierung */
/* -------------------- */

const roomId = localStorage.getItem("NemesisRoomId");
const role = localStorage.getItem(`${roomId}-NemesisRole`);


init(); 


function init() { 
      
  if(role!=="host"){
    eventSidebar.classList.add("hidden");
    
  }
  
  
  db.ref(`rooms/${roomId}`).once("value").then((snapshot) => {

    if (snapshot.exists()) {
         roomInfo.innerText=`${roomId}`
    } else {
         roomInfo.innerText=`${roomId} (nicht mehr vorhanden)`
    }
    
    
    
    initFirebase(roomId);
    loadGame(roomId)
});
 

}



/* -------------------- */
/* BUTTON TOGGLE SYSTEM */
/* -------------------- */

document.querySelectorAll(".mission-tile").forEach(button => {
  button.addEventListener("click", () => {
    button.classList.toggle("active");

    checkSignal();
    checkKnowledge();
    checkKapsel();
    checkIsolation();
    checkRescue();

    saveGame();
  });
});



/* -------------------- */
/* TASK CLICKABLES */
/* -------------------- */

signalTask.addEventListener("click", () => {
  signalTask.classList.toggle("completed");
  saveGame();
});

knowledgeTask.addEventListener("click", () => {
  knowledgeTask.classList.toggle("completed");
  saveGame();
});

/* -------------------- */
/* CHECKS */
/* -------------------- */

function checkSignal() {
  const activeCount = document.querySelectorAll(".signal-btn.active").length;

  if (activeCount === 2) {
    signalTask.classList.add("hidden");
  } else {
    signalTask.classList.remove("hidden");
  }
}

function checkKnowledge() {
  const activeCount = document.querySelectorAll(".knowledge-btn.active").length;

  if (activeCount === 2) {
    knowledgeTask.classList.add("hidden");
  } else {
    knowledgeTask.classList.remove("hidden");
  }
}

function checkKapsel() {
  const kapselButton = document.querySelector(".kapsel-btn");

  if(kapselButton.classList.contains("active")){

    kapselTask.style.display = "none";

    kapselHint.classList.remove("hidden");

  }else{

    kapselTask.style.display = "block";

    kapselHint.classList.add("hidden");

  }
}

function checkIsolation() {
  const isolationButton = document.querySelector(".isolation-btn");

   if(isolationButton.classList.contains("active")){
     
     isolationTask.classList.add("hidden");
     isolationHint.classList.remove("hidden");
     
     
     if(selfdestructEvent.classList.contains("active")){
       
     isolationTask.classList.add("hidden");
     isolationHint.classList.add("hidden");
    
    }

 
    
    }

  else{

    isolationTask.classList.remove("hidden");;

    isolationHint.classList.add("hidden");
    
    
    if(selfdestructEvent.classList.contains("active")){
       
     isolationTask.classList.add("hidden");
     isolationHint.classList.add("hidden");
    
    }

  }
}

function checkRescue() {
  const tasks = document.querySelectorAll(".task-tile");

  if (rescueButton.classList.contains("active")) {
    tasks.forEach(task => {
      if (!task.innerHTML.includes("⚠️")) {
        task.innerHTML += ' <span class="danger">⚠️</span>';
      }
    });
  } else {
    tasks.forEach(task => {
      task.innerHTML = task.innerHTML.replace(
        ' <span class="danger">⚠️</span>',
        ''
      );
    });
  }
}

/* -------------------- */
/* MODAL */
/* -------------------- */

function openModal(title, text) {
  modalTitle.textContent = title;
  modalText.innerHTML = text;
  modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

/* -------------------- */
/* EVENTS */
/* -------------------- */




xenoEvent.addEventListener("click", () => {
  
  
  if (xenoEvent.classList.contains("active")) {
    
    db.ref(`rooms/${roomId}/xenoEvent`).set(true);
  }
  else{
    db.ref(`rooms/${roomId}/xenoEvent`).set(false);
  }

});

deathEvent.addEventListener("click", () => {
  if (deathEvent.classList.contains("active")) {

    db.ref(`rooms/${roomId}/deathEvent`).set(true);

  }
  
  else{
        db.ref(`rooms/${roomId}/deathEvent`).set(false);       

  }
});

alarmEvent.addEventListener("click", () => {
  if (alarmEvent.classList.contains("active")) {
       
    db.ref(`rooms/${roomId}/alarmEvent`).set(true);

  }
  
  else{
        db.ref(`rooms/${roomId}/alarmEvent`).set(false);

  }
});

selfdestructEvent.addEventListener("click", () => {
  if (selfdestructEvent.classList.contains("active")) {
   
        db.ref(`rooms/${roomId}/selfdestructEvent`).set(true);

  } else {
    
    db.ref(`rooms/${roomId}/selfdestructEvent`).set(false);

  }
});


contaminationEvent.addEventListener("click", () => {
  if (contaminationEvent.classList.contains("active")) {
    contaminationTask.classList.remove("hidden");
  } else {
    contaminationTask.classList.add("hidden");
  }
});


/* -------------------- */
/* Firebase Listener in Javascript */
/* -------------------- */




db.ref(`rooms/${roomId}/xenoEvent`).on("value", (snapshot) => {
  
  const data = snapshot.val();
  
  if (data === null) return;
  
  
  if (data) {
    openModal("Erste Begegnung", "Entscheide dich für eines deiner beiden Ziele.");
    xenoEvent.classList.add("active")
  }
  
  if (!data) {
    xenoEvent.classList.remove("active")
  }
  
  
  
                                    }
            )



db.ref(`rooms/${roomId}/deathEvent`).on("value", (snapshot) => {
  
  const data = snapshot.val();
  
  if (data === null) return;
  
  if (data) {
    openModal("Tod des ersten Charakters", "Entscheide dich für eines deiner beiden Ziele. Das Haupttor zum Bunker wurde geöffnet.");             deathEvent.classList.add("active")
  }
  
  if (!data) {
    deathEvent.classList.remove("active")
  }
  
  
  
                                    }
            )


db.ref(`rooms/${roomId}/alarmEvent`).on("value", (snapshot) => {
  
  const data = snapshot.val();
  
  if (data === null) return;
  
   if (data) {
        openModal("Alarm ausgelöst", "Isolationsraum kann genutzt werden.");  
        
        alarmEvent.classList.add("active")
  }
  
  if (!data) {
    alarmEvent.classList.remove("active")
  }
  
  
  
                                    }
            )


db.ref(`rooms/${roomId}/selfdestructEvent`).on("value", (snapshot) => {
  
  const data = snapshot.val();
  
  if (data === null) return;

  if (data) {
    openModal("Selbstzerstörung aktiviert", "Das Haupttor zum Bunker öffnet sich, sobald das Zeitplättchen vorrückt und dadurch die gelbe Seite des Selbstzerstörungsplättchens sichtbar wird.");

    isolationTask.classList.add("hidden");
    isolationHint.classList.add("hidden");
    escapeTask.classList.remove("hidden");
    selfdestructEvent.classList.add("active");
  }
  
  if (!data) {
    
    escapeTask.classList.add("hidden");
    selfdestructEvent.classList.remove("active");
 
    
    if(document.querySelector(".isolation-btn").classList.contains("active")){
      isolationHint.classList.remove("hidden");
    }
    
    else{
          isolationTask.classList.remove("hidden");

    }

  }
  
}
                               )

  

/* -------------------- */
/* SAVE / LOAD */
/* -------------------- */

function saveGame() {
  const activeButtons = [];
  document.querySelectorAll(".mission-tile.active").forEach(btn => {
    activeButtons.push(btn.id);
    
  });

  const completedTasks = [];
  document.querySelectorAll(".task-tile.completed").forEach(task => {
    completedTasks.push(task.id);
  });

  const gameData = {
    activeButtons,
    completedTasks
  };
  

  localStorage.setItem(`NemesisGameRoom-${roomId}`, JSON.stringify(gameData));
}


function loadGame(roomId) {
  const savedRoom = localStorage.getItem(`NemesisGameRoom-${roomId}`);
  if (!savedRoom) return;

  const data = JSON.parse(savedRoom);

  document.querySelectorAll(".mission-tile").forEach(btn => {
    if (data.activeButtons.includes(btn.id)) {
      btn.classList.add("active");
    }
  });

  data.completedTasks.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("completed");
  });

  checkSignal();
  checkKnowledge();
  checkKapsel();
  checkIsolation();
  checkRescue();
};



function initFirebase(roomId){
  
  
  db.ref(`rooms/${roomId}`).once("value", (snapshot) => {
  
  const data = snapshot.val();
  
  if (data === null) return;
    
  if(data.xenoEvent===true){
    
   xenoEvent.classList.add("active");
    
  }
    
    else{
   xenoEvent.classList.remove("active");

    }
    
    
   if(data.deathEvent===true){
      deathEvent.classList.add("active");
   }
    
    else{
       deathEvent.classList.remove("active");
    }
    
    
     if(data.alarmEvent===true){
      alarmEvent.classList.add("active");
   }
    
    else{
       alarmEvent.classList.remove("active");
    }
    
    
    if(data.selfdestructEvent===true){
      selfdestructEvent.classList.add("active");
   }
    
    else{
       selfdestructEvent.classList.remove("active");
    }

  
  
                                    }
            )
  
  
}






                  
