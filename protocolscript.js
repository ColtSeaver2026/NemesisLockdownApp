const switchToMap = document.getElementById("switchToMap");

switchToMap.addEventListener("click", () => {
  location.href = "https://coltseaver2026.github.io/NemesisLockdownApp/map.html";
});

const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", () => {
  localStorage.removeItem("protocolData");

  // optional: sofort visuell resetten (ohne reload wäre noch sauberer)
  document.querySelectorAll(".mission-tile.active")
    .forEach(el => el.classList.remove("active"));

  document.querySelectorAll(".task-tile.completed")
    .forEach(el => el.classList.remove("completed"));

  location.reload();
});

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

    isolationTask.style.display = "none";
    
    if(!selfdestructEvent.classList.contains("active")){
    isolationHint.classList.remove("hidden");
    }

  }else{

    isolationTask.style.display = "block";

    isolationHint.classList.add("hidden");

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
    openModal("Erste Begegnung", "Entscheide dich für eines deiner beiden Ziele.");
  }
});

deathEvent.addEventListener("click", () => {
  if (deathEvent.classList.contains("active")) {
    openModal("Tod des ersten Charakters", "Entscheide dich für eines deiner beiden Ziele. Das Haupttor zum Bunker wurde geöffnet.");
  }
});

alarmEvent.addEventListener("click", () => {
  if (alarmEvent.classList.contains("active")) {
    openModal("Alarm ausgelöst", "Isolationsraum kann genutzt werden.");
  }
});

selfdestructEvent.addEventListener("click", () => {
  if (selfdestructEvent.classList.contains("active")) {
    openModal("Selbstzerstörung aktiviert", "Das Haupttor zum Bunker öffnet sich, sobald das Zeitplättchen vorrückt und dadurch die gelbe Seite des Selbstzerstörungsplättchens sichtbar wird.");

    isolationTask.classList.add("hidden");
    isolationHint.classList.add("hidden");
    escapeTask.classList.remove("hidden");
  } else {
    escapeTask.classList.add("hidden");

    if (!document.querySelector(".isolation-btn").classList.contains("active")) {
      isolationTask.classList.remove("hidden");
    }
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
/* SAVE / LOAD */
/* -------------------- */

function saveGame() {
  const activeButtons = [];
  document.querySelectorAll(".mission-tile.active").forEach(btn => {
    activeButtons.push(btn.textContent.trim());
  });

  const completedTasks = [];
  document.querySelectorAll(".task-tile.completed").forEach(task => {
    completedTasks.push(task.id);
  });

  const gameData = {
    activeButtons,
    completedTasks
  };

  localStorage.setItem("protocolData", JSON.stringify(gameData));
}

function loadGame() {
  const saved = localStorage.getItem("protocolData");
  if (!saved) return;

  const data = JSON.parse(saved);

  document.querySelectorAll(".mission-tile").forEach(btn => {
    if (data.activeButtons.includes(btn.textContent.trim())) {
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
}

loadGame();
