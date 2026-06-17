const switchToMap = document.getElementById("switchToMap")

switchToMap.addEventListener("click", ()=>{
  
  
      location.href = "https://coltseaver2026.github.io/NemesisLockdownApp/map.html";
})



const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", () => {

  localStorage.removeItem("protocolData");
  location.reload();

});

/* TASKS */

const signalTask =
  document.getElementById("signal-task");

const knowledgeTask =
  document.getElementById("knowledge-task");

const kapselTask =
  document.getElementById("kapsel-task");

const isolationTask =
  document.getElementById("isolation-task");

const escapeTask =
  document.getElementById("escape-task");

const contaminationTask =
  document.getElementById("contamination-task");

/* HINTS */

const kapselHint =
  document.getElementById("kapsel-hint");

const isolationHint =
  document.getElementById("isolation-hint");

const bunkerHint =
  document.getElementById("bunker-hint");

/* BUTTONS */

const rescueButton =
  document.querySelector(".rescue-btn");

/* EVENTS */

const xenoEvent =
  document.getElementById("xeno-event");

const deathEvent =
  document.getElementById("death-event");

const alarmEvent =
  document.getElementById("alarm-event");

const selfdestructEvent =
  document.getElementById("selfdestruct-event");

const contaminationEvent =
  document.getElementById("contamination-event");

/* MODAL */

const modal =
  document.getElementById("event-modal");

const modalTitle =
  document.getElementById("modal-title");

const modalText =
  document.getElementById("modal-text");

const closeModal =
  document.getElementById("close-modal");


/* BUTTON AKTIVIERUNG */

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


/* SIGNAL */

function checkSignal(){

  const activeCount =
    document.querySelectorAll(".signal-btn.active").length;

  if(activeCount === 2){

    signalTask.classList.add("hidden");

  }else{

    signalTask.classList.remove("hidden");

  }

}


/* KNOWLEDGE */

function checkKnowledge(){

  const activeCount =
    document.querySelectorAll(".knowledge-btn.active").length;

  if(activeCount === 2){

    knowledgeTask.classList.add("hidden");

  }else{

    knowledgeTask.classList.remove("hidden");

  }

}


/* KAPSEL */

function checkKapsel(){

  const kapselButton =
    document.querySelector(".kapsel-btn");

  if(kapselButton.classList.contains("active")){

    kapselTask.classList.add("hidden");

    kapselHint.classList.remove("hidden");

  }else{

    kapselTask.classList.remove("hidden");

    kapselHint.classList.add("hidden");

  }

}


/* ISOLATION */

function checkIsolation(){

  const isolationButton =
    document.querySelector(".isolation-btn");

  if(isolationButton.classList.contains("active")){

    isolationTask.classList.add("hidden");
    
    if(!selfdestructEvent.classList.contains("active")){

    isolationHint.classList.remove("hidden");
      
    }

  }else{
    
    if(!selfdestructEvent.classList.contains("active")){

    isolationTask.classList.remove("hidden");
    }

    isolationHint.classList.add("hidden");

  }

}


/* RESCUE */

function checkRescue(){

  const tasks =
    document.querySelectorAll(".task-tile");

  if(rescueButton.classList.contains("active")){

    tasks.forEach(task => {

      if(task.style.display !== "none"){

        if(
          !task.innerHTML.includes(
            "⚠️"
          )
        ){

          task.innerHTML +=
            ' <span class="danger">⚠️</span>';

        }

      }

    });

  }else{

    tasks.forEach(task => {

      task.innerHTML =
        task.innerHTML.replace(
          ' <span class="danger">⚠️</span>',
          ''
        );

    });

  }

}


/* TASKS KLICKBAR */

signalTask.addEventListener("click", () => {

  signalTask.classList.toggle("completed");
  saveGame();


});

knowledgeTask.addEventListener("click", () => {

  knowledgeTask.classList.toggle("completed");
  saveGame();


});


/* MODAL */

function openModal(title, text){

  modalTitle.textContent = title;

  modalText.innerHTML = text;

  modal.classList.remove("hidden");

}

closeModal.addEventListener("click", () => {

  modal.classList.add("hidden");

});


/* XENO */

xenoEvent.addEventListener("click", () => {

  if(xenoEvent.classList.contains("active")){

    openModal(
      "Erste Begegnung",
      "Entscheide dich für eines deiner beiden Ziele."
    );

  }

});


/* TOD */

deathEvent.addEventListener("click", () => {

  if(deathEvent.classList.contains("active")){

    openModal(
      "Tod des ersten Charakters",
      `
      Entscheide dich für eines deiner beiden Ziele.
      <br><br>
      Das Haupttor zum Bunker wurde geöffnet.
      `
    );
  }


});


/* ALARM */

alarmEvent.addEventListener("click", () => {

  if(alarmEvent.classList.contains("active")){

    openModal(
      "Alarm ausgelöst",
      "Isolationsraum kann nun genutzt werden."
    );

  }

});


/* SELBSTZERSTÖRUNG */

selfdestructEvent.addEventListener("click", () => {
  

  if(selfdestructEvent.classList.contains("active")){

    openModal(
      "Selbstzerstörung aktiviert",
      `
      Das Haupttor zum Bunker öffnet sich,
      sobald das Zeitplättchen vorrückt und dadurch
      die gelbe Seite des Selbstzerstörungsplättchens sichtbar wird.
      `
    );
    
    
    
    isolationTask.classList.add("hidden");    

    escapeTask.classList.remove("hidden");
    
    isolationHint.classList.add("hidden");

    if(
      !escapeTask.innerHTML.includes(
        "Evakuierung dringend"
      )
    ){

      escapeTask.innerHTML +=
        ' <span class="escape-warning">(⚠️Selbstzerstörungsqequenz ist aktiv⚠️)</span>';

    }

  }else{
    
    
     const isolationButton =
    document.querySelector(".isolation-btn");
    
    if(!isolationButton.classList.contains("active")){
    isolationTask.classList.remove("hidden");    
    }


    escapeTask.innerHTML =
      escapeTask.innerHTML.replace(
        ' <span class="escape-warning">(⚠️Selbstzerstörungsqequenz ist aktiv⚠️)</span>',
        ''
      );

    escapeTask.classList.add("hidden");

  }

});


/* KONTAMINATION */

contaminationEvent.addEventListener("click", () => {

  if(contaminationEvent.classList.contains("active")){

    contaminationTask.classList.remove("hidden");

  }else{

    contaminationTask.classList.add("hidden");

  }

});



function saveGame() {

  const activeButtons = [];

  document.querySelectorAll(".mission-tile.active").forEach(button => {
    activeButtons.push(button.textContent.trim());
  });

  const completedTasks = [];

  document.querySelectorAll(".task-tile.completed").forEach(task => {
    completedTasks.push(task.id);
  });

  const gameData = {
    activeButtons,
    completedTasks
  };

  localStorage.setItem(
    "protocolData",
    JSON.stringify(gameData)
  );
}


function loadGame() {

  const savedData =
    localStorage.getItem("protocolData");

  if (!savedData) return;

  const gameData =
    JSON.parse(savedData);

  document.querySelectorAll(".mission-tile").forEach(button => {

    if (
      gameData.activeButtons.includes(
        button.textContent.trim()
      )
    ) {
      button.classList.add("active");
    }

  });

  gameData.completedTasks.forEach(id => {

    const task = document.getElementById(id);

    if (task) {
      task.classList.add("completed");
    }

  });

  checkSignal();
  checkKnowledge();
  checkKapsel();
  checkIsolation();
  checkRescue();
}



loadGame();
