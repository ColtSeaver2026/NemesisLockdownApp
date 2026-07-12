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




const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", () => {
  resetModal.classList.remove("hidden"); 
});


const eventSidebar = document.getElementById("event-sidebar");

const showEvents = document.getElementById("show-events");


/* TASKS */
const signalTask = document.getElementById("signal-task");
const knowledgeTask = document.getElementById("knowledge-task");
const kapselTask = document.getElementById("kapsel-task");
const isolationTask = document.getElementById("isolation-task");
const escapeTask = document.getElementById("escape-task");
const contaminationTask = document.getElementById("contamination-task");

/* BUTTONS */
const rescueButton = document.querySelector(".rescue-btn");

const acceptResetModal = document.getElementById("accept-reset-modal")
const closeResetModal = document.getElementById("close-reset-modal")

const navHome = document.getElementById("nav-home");
const navMap = document.getElementById("nav-map");
const navOption = document.getElementById("nav-option");

const closeOptionModal = document.getElementById("close-option-modal")

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

const resetModal = document.getElementById("reset-modal")

const optionModal = document.getElementById("option-modal")



/* room-info */
const roomInfo = document.getElementById("room-info");



/* -------------------- */
/* Initialisierung */
/* -------------------- */

const roomId = localStorage.getItem("NemesisRoomId");
const role = localStorage.getItem(`${roomId}-NemesisRole`);

let nemesisEventStatus;

/* -------------------- */
/* Die Seite wird aufgerufen und die für das Spiel relevanten Informationen werden abgerufen.*/
/* -------------------- */
init(); 


function init() { 
      
  //Hier wird geschaut, ob der Teilnehmer host in diesem Spielraum ist. Wenn nicht, werden die Ereignisse nicht angezeigt. 
  if(role!=="host"){
    eventSidebar.classList.add("hidden");
    
  }
  
  
  //Aus der Firebase Datenbank werden einmalig die Informationen des jeweils relevanten Spielraums aufgerufen. 
  db.ref(`rooms/${roomId}`).once("value").then((snapshot) => {

    //Es wird überprüft, ob der Spielraum überhaupt existiert. Wenn ja, wird die ID ganze unten auf der Seit im Element roomInfo dargestellt. Wenn nicht, wird der Zusatz hinzugefügt, dass der Raum nicht mehr existiert. 
    if (snapshot.exists()) {
         roomInfo.innerText=`${roomId}`
    } else {
         roomInfo.innerText=`${roomId} (nicht mehr vorhanden)`
    }
    
    
    
    //setNemesisEventStatus greift auf den localStorage zu. Dort wird versucht den gespeicherten Event Status abzurufen. Wenn dieser vorhanden ist, wenn die im localStorage gespeicherten Event Stati in dem Objekt eventStatus gespeichert. Dies ist notwendig, damit man beim sprung auf die Protocol-Seite überprüfen kann, ob sich etwas übeprüfen kann, die EventWerte in firebase neu sind oder bereits in localStorage vorliegen. Wenn Sie vorliegen, soll kein Modal mit Infos zum Event geöffnet werden. 
    nemesisEventStatus = setNemesisEventStatus();
    
    
    //loadGame holt die Informationen zu den Eindämmungsprotokollen aus dem local storage und setzt die active klassen bei den zugehörigen Button. Näheres unten. 
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

function checkEscape(){
  
  if(selfdestructEvent.classList.contains("active")){
  escapeTask.classList.remove("hidden")
  }
  
  else{
      escapeTask.classList.add("hidden")
  }
  
  
}


function checkContamination(){
  
  if(contaminationEvent.classList.contains("active")){
  contaminationTask.classList.remove("hidden")
  }
  
  else{
      contaminationTask.classList.add("hidden")
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



//Der Code hört die ganze Zeit hin, ob sich xenoEvent geändert hat. Auch beim erneuten aufrufen der Seite - z.B. beim Wechsel zwischen Map und Protocol - wird erneut zugehört. 
db.ref(`rooms/${roomId}/xenoEvent`).on("value", (snapshot) => {
  
  //Die Info von xenoEvent wird in Data gespeichert. 
  const data = snapshot.val();
  
  //Wenn xenoEvent nicht vorhanden, endet die Ausführung des Codes. 
  if (data === null) return;
  
  //Es wird überprüft, ob es bezüglich xenoEvent überhaupt eine Abweichung gibt zwischen localStorage und Firebase. Wenn nicht, wird der Code abgebrochen. 
  if(nemesisEventStatus.xenoEvent===data)return;   
  
  //entsprechen sich die beiden Werte in localStorage und Firebase nicht, wird das Objekt nemesisEventStatus im key xenoEvent aktualisiert. 
  nemesisEventStatus.xenoEvent = data; 

  //Das gesamte Objekt nemesisEventStatus mit dem aktualisierten Key xenoEvent wird im localStorage gespeichert. 
  localStorage.setItem(
    `${roomId}-localNemesisEventStatus`,
    JSON.stringify(nemesisEventStatus)
  );
  
  
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
  
  //Es wird überprüft, ob es bezüglich deathEvent überhaupt eine Abweichung gibt zwischen localStorage und Firebase. Wenn nicht, wird der Code abgebrochen. 
  if(nemesisEventStatus.deathEvent===data)return;   
  
  //entsprechen sich die beiden Werte in localStorage und Firebase nicht, wird das Objekt nemesisEventStatus im key deathEvent aktualisiert. 
  nemesisEventStatus.deathEvent = data; 

  //Das gesamte Objekt nemesisEventStatus mit dem aktualisierten Key deathEvent wird im localStorage gespeichert. 
  localStorage.setItem(
    `${roomId}-localNemesisEventStatus`,
    JSON.stringify(nemesisEventStatus)
  );
  
  
  
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
  
  //Es wird überprüft, ob es bezüglich alarmEvent überhaupt eine Abweichung gibt zwischen localStorage und Firebase. Wenn nicht, wird der Code abgebrochen. 
  if(nemesisEventStatus.alarmEvent===data)return;   
  
  //entsprechen sich die beiden Werte in localStorage und Firebase nicht, wird das Objekt nemesisEventStatus im key alarmEvent aktualisiert. 
  nemesisEventStatus.alarmEvent = data; 

  //Das gesamte Objekt nemesisEventStatus mit dem aktualisierten Key alarmEvent wird im localStorage gespeichert. 
  localStorage.setItem(
    `${roomId}-localNemesisEventStatus`,
    JSON.stringify(nemesisEventStatus)
  );
  
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
  
  //Es wird überprüft, ob es bezüglich selfdestructEvent überhaupt eine Abweichung gibt zwischen localStorage und Firebase. Wenn nicht, wird der Code abgebrochen. 
  if(nemesisEventStatus.selfdestructEvent===data)return;   
  
  //entsprechen sich die beiden Werte in localStorage und Firebase nicht, wird das Objekt nemesisEventStatus im key selfdestructEvent aktualisiert. 
  nemesisEventStatus.selfdestructEvent = data; 

  //Das gesamte Objekt nemesisEventStatus mit dem aktualisierten Key selfdestructEvent wird im localStorage gespeichert. 
  localStorage.setItem(
    `${roomId}-localNemesisEventStatus`,
    JSON.stringify(nemesisEventStatus)
  );
 

  if (data) {
    openModal("Selbstzerstörung aktiviert", "Das Haupttor zum Bunker öffnet sich, sobald das Zeitplättchen vorrückt und dadurch die gelbe Seite des Selbstzerstörungsplättchens sichtbar wird.");

 
    selfdestructEvent.classList.add("active");
    
    checkIsolation();
    checkEscape();
  }
  
  if (!data) {
    
   
    selfdestructEvent.classList.remove("active");
 
    checkIsolation(); 
    checkEscape();

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
  checkContamination()
};




acceptResetModal.addEventListener("click", ()=>{
  
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
  
  resetModal.classList.add("hidden")

  location.reload();
  
})


closeResetModal.addEventListener("click", ()=>{
  resetModal.classList.add("hidden")
  
})



const navigatorMenu = document.querySelector(".navigator");

navigatorMenu.querySelector(".nav-main").addEventListener("click", () => {

    navigatorMenu.classList.toggle("open");

});


navHome.addEventListener("click", ()=>{
      window.location.href = "https://coltseaver2026.github.io/NemesisLockdownApp/";

})
                         
 navMap.addEventListener("click", ()=>{
      window.location.href = "https://coltseaver2026.github.io/NemesisLockdownApp/map.html";

})

navOption.addEventListener("click", ()=>{
  
      if(!eventSidebar.classList.contains("hidden")){
           showEvents.checked = true;
      }
  
      optionModal.classList.remove("hidden")
      navigatorMenu.classList.toggle("open");


})



closeOptionModal.addEventListener("click", () => {
  optionModal.classList.add("hidden")
})



showEvents.addEventListener("change", () => {
    if (showEvents.checked) {
        eventSidebar.classList.remove("hidden")
    } else {
        eventSidebar.classList.add("hidden")
    }
});


function setNemesisEventStatus(){
   
  //Die Funktion holt Event Informationen zum aktuellen Raum aus dem localStorage und speichert sie in nemesisEventStatus. Über parse wird der im localStorage hinterlegte String gleich als Objekt ausgegeebn.  
  let nemesisEventStatus = JSON.parse(
    localStorage.getItem(`${roomId}-localNemesisEventStatus`)
  );
  
  //Es wird überprüft, ob nun überaupt Informationen in nemesisEventStatus gespeichert wird. Wenn im local Storage keine Infos zu finden waren, wird null zurückgegeben. Wenn keine Infos, wird nemesisEventStatus als objekt gespeichert, in dem zunächst alle Werte false sind - Ausgangssituation. 
  if(nemesisEventStatus===null){
    
    nemesisEventStatus = {
      xenoEvent: false, 
      deathEvent: false, 
      alarmEvent: false, 
      selfdestructEvent: false, 
    };
  }
  
   localStorage.setItem(
    `${roomId}-localNemesisEventStatus`,
    JSON.stringify(nemesisEventStatus)
  );
  
  return nemesisEventStatus;
}







                  
