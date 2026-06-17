const switchToProtocolBtn = document.getElementById("switchToProtocol")

const modal = document.getElementById("roomModal");
const cancelBtn = document.getElementById("cancelRoom");

const roomList = document.getElementById("roomList")

const unlockedRooms = document.getElementById("unlockedRooms")
const unlockedRooms1 = document.getElementById("unlockedRooms1")
const unlockedRooms2 = document.getElementById("unlockedRooms2")

const infoModal = document.getElementById("infoModal")
const roomName = document.getElementById("roomName")
const function2 = document.getElementById("function2")
const roomFunctionWrapper1 = document.getElementById("roomFunctionWrapper1")
const roomFunctionWrapper2 = document.getElementById("roomFunctionWrapper2")
const functionDescripton1 = document.getElementById("functionDescripton1")
const functionDescripton2 = document.getElementById("functionDescripton2")
const cancelRoomInfoBtn = document.getElementById("cancelRoomInfo")

const resetRooms = document.getElementById("resetRooms")

const overlay = document.querySelector(".overlay");

let currentHex = null;

const rooms = [
  {category: "I", name: "I", unlocked: false},
  
  {category: "I", name: "Archiv", unlocked: false, cost1: "2", functionHeader1: "Untersuche das Archiv:", function1: "Du kannst diese Aktion nur ausführen, wenn dein Wissensplättchen inaktiv ist. Erhalte 2 Wissen und drehe dein Wissensplättchen auf die aktive Seite. Schaue dir dann verdeckt 1 Eindämmungsprotokollplättchen an (auch außerhalb deiner Sektion)."},
  
  {category: "I", name: "Dekontaminationsraum", unlocked: false, cost1: "2", functionHeader1: "Führe das Dekontaminationsverfahren durch:", function1: "Scanne alle deine Kontaminationskarten auf der Hand. Entferne alle INFIZIERT-Karten. Falls du eine Larve auf deiner Charaktertafel hast, entferne sie. Lege einen Schleimmarker von deiner Charaktertafel ab, falls du einen hast."},
  
  {category: "I", name: "Erste-Hilfe-Station", unlocked: false, cost1: "2", functionHeader1: "Behandle deine Wunden:", function1: "Verbinde alle deine Schweren Wunden ODER heile 1 deiner verbundenen Schweren Wunden ODER heile alle deine Leichten Wunden."},
  
  {category: "I", name: "Frachtversandsystem A", unlocked: false, cost1: "2", functionHeader1: "Steige in FVS-Kapsel A ein:", function1: "Du kannst diese Raumaktion nur ausführen, falls sich das Zeitplättchen auf einem mit einem FVS-Plättchen markierten Feld befindet und das FVS-Kapsel-Feld „A“ frei ist.  Nach dem Einsteigen legst du alle Handkarten ab und passt automatisch. Platziere deinen Charakter auf dem entsprechenden FVS-Kapsel-Feld auf dem Spielplan. In der Ereignisphase hast du die Möglichkeit, mit dieser FVS-Kapsel zu entkommen. Charaktere, die sich auf einem FVS-Kapsel-Feld befinden, können nicht Ziel von Spieleffekten werden, sofern nicht anders angegeben. Falls du es nicht schaffst mit der FVS-Kapsel zu entkommen, erleidest du 1 Schwere Wunde."},
  
  {category: "I", name: "Generatorraum", unlocked: false, cost1: "2",
    functionHeader1: "Stoppe die Selbstzerstörung",
    function1: "Liegt das Selbstzerstörungsplättchen mit der gelben Seite nach oben auf der Zeitleiste, entferne es von der Zeitleiste.",

    functionHeader2: "Schalte den Strom an / aus",
    function2: "Drehe das Stromplättchen in deiner Sektion auf die andere Seite. Dies kann verwendet werden, um mehr Strom zu erhalten, auch wenn die Stromversorgung nicht wiederhergestellt wurde."},
  
  {
    category: "I",
    name: "Höhleneingang",
    unlocked: false,
    cost1: "2",
    functionHeader1: "Bewege dich durch Wartungskorridore",
    function1: "Bewege deinen Charakter in einen anderen erkundeten Raum mit einem Wartungskorridor-Eingang. Ziehe 1 Angriffskarte und handle sie ab, als würde dich ein Jäger im Dunkeln angreifen."
},
   
{
    category: "I",
    name: "Kommunikationszentrale",
    unlocked: false,
    cost1: "2",

    functionHeader1: "Setze ein Signal ab",
    function1: "Platziere einen Statusmarker auf dem Signalfeld deiner Charaktertafel. Hinweis: Das Absetzen eines Signals ist eine Voraussetzung für einige Ziele sowie für eines der Eindämmungsprotokolle.",

    functionHeader2: "Überprüfe ein Ziel",
    function2: "Wähle 1 beliebigen Charakter mit einem Statusmarker auf dem Signalfeld seiner Charaktertafel. Er muss dir verdeckt sein Ziel zeigen."
},
    
  {
    category: "I",
    name: "Kühlsystem",
    unlocked: false,
    cost1: "2",

    functionHeader1: "Starte die Selbstzerstörung",
    function1: "Nimm das Selbstzerstörungsplättchen und platziere es 3 Felder vor dem Zeitplättchen mit der gelben Seite nach oben auf der Zeitleiste. Zwischen dem Zeitplättchen und dem Selbstzerstörungsplättchen befinden sich dabei 2 freie Felder."
},

  {
    category: "I",
    name: "Labor",
    unlocked: false,
    cost1: "2",

    functionHeader1: "Analysiere 1 Objekt",
    function1: "Du kannst diese Aktion nur ausführen, wenn sich mindestens eines dieser Objekte im Labor befindet (z. B. weil du es bei dir trägst): Leiche, Xeno-Ei oder Xeno-Kadaver. Erhalte 3 Wissen. Lege das Objekt nach der Analyse auf das erste freie Feld der Labor-Tafel und entdecke anschließend die unter dem Objekt liegende Xeno-Schwäche-Karte. Wurde das Objekt bereits zuvor zur Entdeckung einer Schwäche verwendet, lege es stattdessen ab."
},
    
  {
    category: "I",
    name: "Nest",
    unlocked: false,
    cost1: "2",

    functionHeader1: "Nimm ein Ei",
    function1: "Der Charakter, der diesen Raum erkundet, erhält einmalig 1 Wissen. Nimm 1 Ei-Plättchen von der Labor-Tafel und führe anschließend eine Geräuschprobe aus. Die Ei-Plättchen auf der Labor-Tafel stellen die im Nest befindlichen Eier dar. Wenn du ein Ei aus dem Nest nimmst oder zerstörst, entferne es von der Labor-Tafel. Sobald sich keine Eier mehr im Nest befinden, gilt das Nest als zerstört. Platziert einen Schadensmarker auf dem Nest, um dies anzuzeigen. Befindet sich ein Feuermarker in einem Raum mit nicht von Charakteren getragenen Eiern, wird im Schritt 'Feuerschaden auswerten' jeder Ereignisphase eines dieser Eier zerstört."
},
    
    
  {category: "II", name: "II", unlocked: false},
  
  {
    category: "II",
    name: "Abwehrsystem",
    unlocked: false,
    cost1: "2",

    functionHeader1: "Vernichte die Bedrohung",
    function1: "Reduziere den Suchzähler um 1 oder platziere einen Fehlfunktionsmarker in diesem Raum. Wähle anschließend 1 beliebigen Raum ohne Fehlfunktionsmarker, in dem sich mindestens ein Xeno befindet. Platziere dort einen Fehlfunktionsmarker. Alle Xenos in diesem Raum erleiden 1 Schaden und jeder Charakter in diesem Raum erleidet 1 Schwere Wunde."
},
   
   
  {
    category: "II",
    name: "Chirurgie",
    unlocked: false,
    cost1: "2",

    functionHeader1: "Führe einen chirurgischen Eingriff durch",
    function1: "Scanne alle deine Kontaminationskarten (auf der Hand sowie im Aktions- und Ablagestapel) und entferne alle INFIZIERT-Karten. Falls sich eine Larve auf deiner Charaktertafel befindet, entferne sie ebenfalls. Nach dem Scannen erleidest du 1 Leichte Wunde und passt automatisch für diese Runde. Mische anschließend alle deine Karten (auf der Hand sowie im Aktions- und Ablagestapel) zu einem neuen Aktionsstapel."
},
    
  {category: "II", name: "Frachtversandsystem B", unlocked: false, cost1: "2", functionHeader1: "Steige in FVS-Kapsel B ein:", function1: "Du kannst diese Raumaktion nur ausführen, falls sich das Zeitplättchen auf einem mit einem FVS-Plättchen markierten Feld befindet und das FVS-Kapsel-Feld „B“ frei ist.  Nach dem Einsteigen legst du alle Handkarten ab und passt automatisch. Platziere deinen Charakter auf dem entsprechenden FVS-Kapsel-Feld auf dem Spielplan. In der Ereignisphase hast du die Möglichkeit, mit dieser FVS-Kapsel zu entkommen. Charaktere, die sich auf einem FVS-Kapsel-Feld befinden, können nicht Ziel von Spieleffekten werden, sofern nicht anders angegeben. Falls du es nicht schaffst mit der FVS-Kapsel zu entkommen, erleidest du 1 Schwere Wunde."},
   
   
  {category: "II", name: "Frachtversandsystem C", unlocked: false, cost1: "2", functionHeader1: "Steige in FVS-Kapsel C ein:", function1: "Du kannst diese Raumaktion nur ausführen, falls sich das Zeitplättchen auf einem mit einem FVS-Plättchen markierten Feld befindet und das FVS-Kapsel-Feld „C“ frei ist.  Nach dem Einsteigen legst du alle Handkarten ab und passt automatisch. Platziere deinen Charakter auf dem entsprechenden FVS-Kapsel-Feld auf dem Spielplan. In der Ereignisphase hast du die Möglichkeit, mit dieser FVS-Kapsel zu entkommen. Charaktere, die sich auf einem FVS-Kapsel-Feld befinden, können nicht Ziel von Spieleffekten werden, sofern nicht anders angegeben. Falls du es nicht schaffst mit der FVS-Kapsel zu entkommen, erleidest du 1 Schwere Wunde."},
  
  {
    category: "II",
    name: "FVS-Kontrolle",
    unlocked: false,
    cost1: "2",

    functionHeader1: "Programmiere das FVS",
    function1: "Schaue dir verdeckt 1 beliebiges FVS-Plättchen an. Du kannst es auf der Zeitleiste um 1 Feld in eine beliebige Richtung verschieben, auch wenn sich dort kein Feld für FVS-Plättchen befindet. Du kannst kein FVS-Plättchen verschieben, das sich auf demselben Feld wie das Zeitplättchen befindet. Du kannst ein FVS-Plättchen nicht auf ein Feld verschieben, auf dem sich bereits ein anderes FVS-Plättchen befindet."
},
   
  {
    category: "II",
    name: "Kontaminierter Raum",
    unlocked: false,
    cost1: "-",

    functionHeader1: "Erhalte Schleim, wenn du suchst",
    function1: "Sobald du eine Suchen-Aktion in diesem Raum ausführst, erhältst du 1 Schleimmarker."
},
   
  {
    category: "II",
    name: "Lüftungssteuerung",
    unlocked: false,
    cost1: "2",

    functionHeader1: "Leite den Entlüftungsvorgang ein",
    function1: "Wähle 1 beliebigen Raum mit einem Wartungskorridor-Eingang. Kein mit diesem Raum verbundener Korridor darf eine zerstörte Tür beinhalten. Alle Türen in den mit diesem Raum verbundenen Korridoren werden automatisch geschlossen. Entferne einen Feuermarker aus diesem Raum (falls vorhanden) und lege das Entlüftungsplättchen dorthin, um die aktive Notentlüftung anzuzeigen. Wird vor Ende der aktuellen Spielerphase eine Tür in einem verbundenen Korridor geöffnet oder zerstört, wird das Plättchen abgelegt. Befindet sich das Plättchen am Ende der aktuellen Spielerphase noch immer in dem Raum, sterben alle Charaktere und Xenos in diesem Raum. Anschließend wird das Plättchen abgelegt."
},
    
    
  {
    category: "II",
    name: "Testlabor",
    unlocked: false,
    cost1: "2",

    functionHeader1: "Wissen 4: Nimm dir das Gegenmittel",
    function1: "Falls dein Charakter 4 oder mehr Wissen hat, nimm dir den hergestellten Gegenstand 'Gegenmittel'."
},
    
    
  {
    category: "II",
    name: "Wachraum",
    unlocked: false,
    cost1: "2",

    functionHeader1: "Nimm dir Ausrüstung",
    function1: "Reduziere den Suchzähler um 1 und nimm dir den hergestellten Gegenstand 'Taser' oder 'Schutzanzug'."
}
]


/* -------------------------------- */
/* Wechsel zur Eindämmungsprotokoll Übersicht */
/* -------------------------------- */

switchToProtocolBtn.addEventListener("click", () => {
    location.href = "https://coltseaver2026.github.io/NemesisLockdownApp/protocol.html";
});

/* -------------------------------- */
/* Start: Fragezeichen erzeugen */
/* -------------------------------- */

document.querySelectorAll(".hex").forEach(hex => {
  
  if(hex.classList.contains("I")){
  createLabel(hex, "I");
  }
  
  if(hex.classList.contains("II")){
  createLabel(hex, "II");
  }
  

  hex.addEventListener("click", () => {

    currentHex = hex;
    
    if(hex.classList.contains("I", hex)){
      showRooms("I")
  modal.classList.remove("hidden");
  }
    
    if(hex.classList.contains("II")){
      showRooms("II", hex)
      modal.classList.remove("hidden");
  }
    

  });

});

/* -------------------------------- */
/* Funktion Modal-Content zur Raumauswahl erstellen */
/* -------------------------------- */

function showRooms(category, hex){
  
   roomList.innerHTML="" 
  
  
  
   rooms.forEach(bag=>{
     if(bag.category==category){
       const button = document.createElement("button");
       button.classList.add("room-option");
       
       if(bag.unlocked && bag.name !== "I" && bag.name !== "II"){
         button.classList.add("unlocked")
       }
       
       button.textContent = bag.name;
       roomList.appendChild(button)  
       
       button.addEventListener("click",()=>{
         
       const roomName = button.textContent;

       // Altes Label entfernen
       const oldLabel = document.querySelector(
      `.room-label[data-id="${currentHex.dataset.id}"]`
       );

     if (oldLabel) {
      oldLabel.remove();
    }

    // Neues Label setzen
    createLabel(currentHex, roomName);
         
    checkLocked();
    listUnlockedRooms();
    saveGame();

    modal.classList.add("hidden");
       })
       
     }
   })
  
  
  }


/* -------------------------------- */
/* Raum auswählen */
/* -------------------------------- */

document.querySelectorAll(".room-option").forEach(button => {

  button.addEventListener("click", () => {

    const roomName = button.textContent;

    // Altes Label entfernen
    const oldLabel = document.querySelector(
      `.room-label[data-id="${currentHex.dataset.id}"]`
    );

    if (oldLabel) {
      oldLabel.remove();
    }

    // Neues Label setzen
    createLabel(currentHex, roomName);
    
   
    
    modal.classList.add("hidden");

  });

});


/* -------------------------------- */
/* Abbrechen */
/* -------------------------------- */

cancelBtn.addEventListener("click", () => {

  modal.classList.add("hidden");
  currentHex = null;

});



/* -------------------------------- */
/* Klick außerhalb schließt Modal */
/* -------------------------------- */

modal.addEventListener("click", (e) => {

  if (e.target === modal) {
    console.log(e.target)
    modal.classList.add("hidden");
    currentHex = null;
  }
  

});



/* -------------------------------- */
/* Label erzeugen */
/* -------------------------------- */

function createLabel(hex, textContent) {

  const points = hex
    .getAttribute("points")
    .split(" ")
    .map(p => p.split(",").map(Number));

  let centerX = 0;
  let centerY = 0;

  points.forEach(([x, y]) => {
    centerX += x;
    centerY += y;
  });

  centerX /= points.length;
  centerY /= points.length;

  const text = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "text"
  );

  text.setAttribute("x", centerX);
  text.setAttribute("y", centerY);

  text.setAttribute("class", "room-label");
  text.setAttribute("data-id", hex.dataset.id);

  text.textContent = textContent;

  overlay.appendChild(text);

}

/* -------------------------------- */
/* Check locked/unlocked */
/* -------------------------------- */

function checkLocked() {
  const allRooms = document.querySelectorAll(".room-label");
  
  rooms.forEach(room=>{
    room.unlocked=false; 
  })

  allRooms.forEach(label => {
    const unlockedRoom = label.textContent;
    
    

    rooms.forEach(room => {
      if (room.name === unlockedRoom) {
        room.unlocked = true;
      }
    });
  });
}

/* -------------------------------- */
/*  Create list of unlocked Rooms*/
/* -------------------------------- */

function listUnlockedRooms(){
  
  unlockedRooms1.innerText=""
  unlockedRooms2.innerText=""
  
   rooms.forEach(currentRoom=>{
     if(currentRoom.unlocked==true&&currentRoom.name!="I"&&currentRoom.name!="II"){
       const button = document.createElement("button");
       button.classList.add("room-option");
       button.textContent = currentRoom.name;
       
       if(currentRoom.category=="I"){
         unlockedRooms1.appendChild(button) 
         
       }
       
       if(currentRoom.category=="II"){
       
       unlockedRooms2.appendChild(button)}
       
       button.addEventListener("click",()=>{
       showRoomInfo(currentRoom)
       }
       )       
     }
  })
}

function showRoomInfo(clickedRoom){
  infoModal.classList.remove("hidden");
  roomName.innerHTML=`${clickedRoom.name}`;
  roomFunctionWrapper1.innerHTML= `
    <div class="roomCost" id="roomCost1">${clickedRoom.cost1}</div>
    <div class="roomFunctionHeader" id="roomFunctionHeader1">${clickedRoom.functionHeader1}</div> `
  functionDescripton1.innerHTML=clickedRoom.function1
  
  if(clickedRoom.functionHeader2){
    function2.classList.remove("hidden")
    roomFunctionWrapper2.innerHTML= `
    <div class="roomCost" id="roomCost2">${clickedRoom.cost1}</div>
    <div class="roomFunctionHeader" id="roomFunctionHeader2">${clickedRoom.functionHeader2}</div> `
  functionDescripton2.innerHTML=clickedRoom.function2
    
  }
  
}

  cancelRoomInfoBtn.addEventListener("click", () => {
  
  function2.classList.add("hidden");
  infoModal.classList.add("hidden");

});


function saveGame() {
  const labels = [];

  document.querySelectorAll(".room-label").forEach(label => {
    labels.push({
      id: label.dataset.id,
      text: label.textContent
    });
  });

  localStorage.setItem("roomsData", JSON.stringify(rooms));
  localStorage.setItem("labelsData", JSON.stringify(labels));
}

function loadGame() {
  const savedRooms = JSON.parse(localStorage.getItem("roomsData"));
  const savedLabels = JSON.parse(localStorage.getItem("labelsData"));

  if (!savedRooms || !savedLabels) return;

  // Raumdaten wiederherstellen
  rooms.forEach((room, index) => {
    if (savedRooms[index]) {
      room.unlocked = savedRooms[index].unlocked;
    }
  });

  // Alte Labels entfernen
  document.querySelectorAll(".room-label").forEach(label => label.remove());

  // Labels neu erzeugen
  savedLabels.forEach(savedLabel => {
    const hex = document.querySelector(
      `.hex[data-id="${savedLabel.id}"]`
    );

    if (hex) {
      createLabel(hex, savedLabel.text);
    }
  });

  checkLocked();
  listUnlockedRooms();
}


function resetGame() {
  localStorage.removeItem("roomsData");
  localStorage.removeItem("labelsData");
  
}


resetRooms.addEventListener("click", ()=>{
   resetGame()
})


loadGame();
  
  


      
       
       
      
      

 
