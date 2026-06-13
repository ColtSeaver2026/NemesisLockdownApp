//Hier wird der Pool an Token angelegt. pools ist ein Objekt, dass mehrere Arrays enthalten soll. Die Arrays entsprechen dabei den unterschiedlichen Typen an Aliens. In den einzelnen Arrays sind dann die Aliens in Form von Objekten enthalten. Jedes Alien hat eine feste ID, sowie Angaben zum type und Angaben zu Überraschungsangriffen bei Licht und bei Dunkelheit. Damit die Liste an Aliens nicht doppelt im Pool auftaucht, wird pools zunächst nur deklariert. Dann wird pools über die Funktinon resetPools befüllt. resetPools wird auch bei jeder Befüllung des Beutels ausgeführt, um den Startzustand wiederherzustellen. 
let pools = {};
resetPools();

//Bag ist ein Array, dass später die Alien-Objekte enthalten soll. 
let bag = [];

//Hier wird ein array mit dem Namen history erstellt. In dem Array sollen Objekte gespeichert werden. Die Objekte sollen die aktuelle Runde und die sich in dieser Runde in Bag befindenen Token enthalten. Damit soll man dann vergangene Runde rekonsturieren können. 
let history=[]

//Hier wird ein Variable definiert, die den aktuellen Zug wiedergibt. Der Count soll immer dann erhöht werden, wenn ein Token aus dem Beutel gezogen wird. Dabei ist egal, ob der Token über den Button gezogen wird, mit dem der Token zurückgelegt wird (Alien-Ausbreitung) oder über den Button, mit dem der Token aus dem Beutel entfernt wird (Alien-Begegnung). Der Count/Zug soll dann auch immer zusammen mit dem gezogenen Token im HTML-Code angegeben werden. Wird der Beutel befüllt, muss der Count auf 0 zurückgesetzt werden. 
let count = 0; 


//Wenn man auf die Button Xeno-Begegnung oder Xeno-Ausbreitung klickt, werden einem Token präsentiert aus denen man eines auswählen soll. Durch Anklicken des Token wird angezeigt, welchen Token man gezogen hat. Dieser gilt als gezogen. Danach soll man das Fenster erst schließen müssen, damit man den nächsten Token ziehen kann. Man soll aber nach dem Zug des ersten Token im geöffneten Fenster auch noch unter die anderen Token schauen können. Diese sollen das Spiel nur nicht mehr beeinflusse. Dafür sorgt die Variable spinActive. spinActive ist zunächst true. Wird ein Token ausgewählt, wird spinActive auf false gesetzt. Mit Schließen des Fensters wird spinActive wieder auf true gesetzt. 
let spinActive = true;

let pressedButton =""
let pickedToken=""
let index=""


//___________________________________Werte aus HTML________________________________________________
const playerInput = document.getElementById("players") 

const modalFill = document.getElementById("modalFill")

const modalSpin =
  document.getElementById("modalSpin");

const tokenGrid =
  document.getElementById("tokenGrid");


//___________________________________BUTTON_________________________________________________________

//Hier wird der Button "Beutel füllen" in JavaScript geholt und mit einem EventListener nutzbar gemacht. 
const fillBtn = document.getElementById("fillBtn")
fillBtn.addEventListener("click", ()=> {
   if(bag.length>0){
    modalFill.classList.remove("hidden")
    return
  }
  
  fillBag(); 
    }
  )

const yesFillBtn=document.getElementById("yesFillBtn")
yesFillBtn.addEventListener("click", ()=>{
  fillBag(); 
  modalFill.classList.add("hidden")
    } 
   )

const noFillBtn=document.getElementById("noFillBtn")
noFillBtn.addEventListener("click", ()=>{
   modalFill.classList.add("hidden")
    } 
   )

const drawBtn = document.getElementById("drawBtn")
drawBtn.addEventListener("click", ()=>{
  
  if(bag.length==0){
    document.getElementById("currentAction").textContent = `Beutel ist leer.`
    return
  }
  
  openReveal(drawBtn)
  
  
})


const returnBtn = document.getElementById("returnBtn")
returnBtn.addEventListener("click", ()=>{
  
  if(bag.length==0){
    document.getElementById("currentAction").textContent = `Beutel ist leer.`
    return
  }
  
  
  openReveal(returnBtn)
   
})

const fillManually = document.getElementById("fillManually")
fillManually.addEventListener("click", openModalManually)

const manullayYesBtn = document.getElementById("manullayYesBtn")
manullayYesBtn.addEventListener ("click", ()=>{
  closeModalManually();
  resetPools();
  bag=[];
  addToken("Leer", document.getElementById("manuallyLeer").value);
  addToken("Larve", document.getElementById("manuallyLarve").value)
  addToken("Kriecher", document.getElementById("manuallyKriecher").value)
  addToken("Jäger", document.getElementById("manuallyJäger").value)
  addToken("Brutbestie", document.getElementById("manuallyBrutbestie").value)
  addToken("Königin", document.getElementById("manuallyKönigin").value)
  
  document.getElementById("currentAction").textContent = `Beutel gefüllt.`
  showBag();

  
})

const manuallyNoBtn = document.getElementById("manuallyNoBtn")
manuallyNoBtn.addEventListener ("click", ()=>{
  closeModalManually();
})


const closeSpinBtn = document.getElementById("closeSpinBtn");
closeSpinBtn.addEventListener("click", () => {

  modalSpin.classList.remove("active");
  spinActive=true

});



//die globalen Variablen currentDrawnToken und currentIndex werden definiert. Diese werden bei der Alien-Ausbreitung befüllt, wenn die Königin gezogen wird. Siehe weiter unten bei der Funktion returnToBag. Sie werden für die Button yesBtn und noBtn benötigt. 
let currentDrawnToken = null
let currentIndex = null

//Bei der Abfrage, ob sich ein Charakter im Nest befindet (Königin wird bei Alien-Ausbreitung gezogen) wird beim Klick auf Ja das Fragefenster geschlossen. Danach wird der Token der Königin in den Pool zurückgelegt. Dann wird die Königin aus dem bag entfernt. 
const yesBtn = document.getElementById("yesBtn"); 
yesBtn.addEventListener("click", ()=>{
      document.getElementById("current-action").innerText = `Die Königin erscheint im Nest.`;
      closeModal()   
      pools["Königin"].push(pickedToken)
      bag.splice(index, 1)
      console.log(bag)
      console.log(pools)
      showBag();
  
  
    })

//Wird die Frage, ob sich ein Charakter im Nest befindet mit Nein beantwortet, wird das Anfragefenster ebenfalls geschlossen. Da die Königin in bag verbleibt, muss nur ein Infotext angezeigt werden. Der HTML-Code wird entsprechend angepasst. 
const noBtn = document.getElementById("noBtn"); 
noBtn.addEventListener("click", ()=>{
      closeModal()   
      document.getElementById("current-action").innerText = `Legt 1 Xeno-Ei auf die Labor-Tafel. Die Königin verbleibt im Beutel.`;

      
      
    })


//Hier wird der Button Rückgängig eingeführt. Er führt die Funktion goBack aus.
const goBackBtn = document.getElementById("goBack")
goBackBtn.addEventListener ("click", ()=>{
  goBack()
  
})


const playerNumberBtn = document.querySelectorAll(".player");

playerNumberBtn.forEach(bag => {
    bag.addEventListener("click", (e) => {
       playerInput.value=e.currentTarget.textContent;
      
      playerNumberBtn.forEach(bag=> {
        bag.classList.remove("active")
      });
      
      e.currentTarget.classList.add("active");
      
    });
});



//___________________________________FUNKTIONEN_____________________________________________________

//__________________________
//Die ***FUNKTION fillBag*** füllt den Beutel mit den entsprechenden Aliens bei Spielbeginn. Es stellt somit die Ausgangszusammenstellung dar. fillBag ruft für die einzelnen Typen an Aliens die Funktion addToken auf. Nachdem bag befüllt worden ist, wird die Funktion showBag aufgerufen. Sie erstellt eine Liste aus dem Beutelinhalt und fügt die Liste dem HTML-Code hinzu, sodass der Inhalt für den User sichtbar wird. 

function fillBag(){  
  
  resetPools();
  bag=[];
  count = 0; 
  document.getElementById("current-turn").innerText = `Zug -`;
  document.getElementById("current-action").innerText = `-`;
  document.getElementById("current-token").innerHTML = `<img>`;
  document.getElementById("light-input").innerText = `-`;
  document.getElementById("dark-input").innerText = `-`;
  addToken("Leer", 1);
  addToken("Larve", 4)
  addToken("Kriecher", 1)
  const playerCount = Number(playerInput.value)
  addToken("Jäger", 3+playerCount)
  addToken("Königin", 1)
  
  document.getElementById("currentAction").textContent = `Beutel gefüllt.`
  
  showBag();
  
}


//___________________________
//Die ***FUNKTION addToken*** erhält den Parameter type und eine Anzahl. Dann sucht die Funktion die entsprechende Anzahl an Token von diesem type und fügt sie bag hinzu. Gut wäre, wenn der Token mit der Id, die bag hingefügt wurde, dann auch gleich aus pool gelöscht wird. 
function addToken(type, amount){
 
  //Amount gibt vor, wie viele Token von einem bestimmten type gezogen werden sollen. Damit auch eine entsprechende Zahl an token gezogen wird, wird mit einer for Schleife gearbeitet. 
  for(let counter = 0; counter<amount; counter++){
    
     //Es wird zunächst eine Variable erstellt, die der Menge der Token des konkreten types entspricht. Wird benötigt, um dann einen randomIndex zu generieren. 
  let amountOfType = pools[type].length;
    
  //Ein randomIndex wird generiert. Es soll ja zufällig eine bestimmte Anzahl an Token von einem Typ in bag übertragen werden und nicht immer die gleichen. 
  let randomIndex = Math.floor(Math.random()*amountOfType);
  
  //In token wird nun ein Token aus pools gespeichert. Dieser muss dann noch bag hingefügt werden. 
  let token = pools[type][randomIndex]
  
  //Der ausgewählte token wird bag hinzugefügt. 
  bag.push(token)
    
  //Nachdem der Token in bag abgelegt wurde, wird pools angepasst. Dabei wird auf den entsprechenden type zugegriffen, also das richtige array gesucht. Das array wird dann über splice bearbeitet.  
  pools[type].splice(randomIndex, 1) 
  }  
}



//________________________________
//Die ***FUNKTION drawFromBag*** wird genutzt, um einen Token aus dem Beutel zu ziehen. Der Token wird dann angezeigt, sowie der Light und Dark-Wert. Dann wird der Token aus bag entfernt und wieder dem Vorrat hinzugefügt. 

function drawFromBag(pickedToken){
  
    
  //Bevor aus bag gezogen wird, soll immer eine Kopie des aktuellen Bag und auch pools erstellt werden. Die Kopie von bag und pools wird dann in einem Objekt, dass die entsprechede Rundenzahl angibt gespeichert. So werden Stück für Stück alle Zustände von bag gespeichert und bleiben rekonstruierbar. Diese Funktion wird ebenfalls im Button zurücklegen implementiert, da auch dieser die Zusammenstellung von bag verändert. 
  history.push({
    round: count,
    bag: [...bag],
    pools: {...pools}
  })
  
  //Es wird aus bag gezogen. Die Zuganzahl wird um 1 erhöht. 
  count++;
    
  const index =
  bag.findIndex(token => token.id === pickedToken.id);
  
  
  //Mit der if Abfrage, wird überprüft, ob es sich bei dem gezogenen Token, um den leeren Token handelt. Dieser soll nicht aus bag entfernt werden. Sofern der leere Token der letzte Token im Beutel war, wird ein Jäger dem Beutel hinzugefügt. Ansonsten wird lediglich ein Text angezeigt, was zu tun ist. 
  if(pickedToken.type=="Leer"){
    
    //Hier wird überprüft, ob es sich bei dem leeren Token um den letzten Token im Beutel handelt. Ist das der Fall, wird ein Jäger hinzugefügt. Der Text mit dem gezogenen Token und der Info, dass ein Jäger hinzugefügt wurde, wird im HTML-Code ausgegeben. 
    if(bag.length==1){
      addToken("Jäger", 1)
      refreshCurrent (count, pickedToken, "Es erscheint kein Xeno. Platziere stattdessen einen Geräuschmarker in jedem Korridor, der mit dem Raum verbunden ist, in dem die Begegnung stattfindet. Ein Jäger wurde dem Beutel hinzugefügt.")
          
    
    }
    
    //Wird das leere Token gezogen, aber es befinden sich auch noch andere Token in bag, wird lediglich ein Infotext im HTML-Code ausgegeben. 
    else {
    
    refreshCurrent (count, pickedToken, "Es erscheint kein Xeno. Platziere stattdessen einen Geräuschmarker in jedem Korridor, der mit dem Raum verbunden ist, in dem die Begegnung stattfindet.")
      
    }
    
    
  //Sollte es sich bei dem gezogenen TOken nicht um das leere Token handeln, wird dieser Code ausgeführt. 
  }
  
  else{
    
    
  
  //Das Objekt pools wird angesprochen und zwar wird auf das array zugegriffen, das dem richtigen Type entspricht. In dieses array wird dann das Objekt drawnToken gepusht. Aktuell erfolgt noch keien Einsortierung anhand der ID. Das Objekt wird lediglich im richtigen Array eingefügt. 
  pools[pickedToken.type].push(pickedToken)
  
  bag.splice(index, 1)
    
   //Im HTML-Code wird ausgegeben, welches Token gezogen worden ist. Ferner werden Informationen gegeben, wie viele Handkarten notwendig sind, um einen Überraschungsangriff abzuwehren. Dabei wird zwischen Licht und Dunkelheit unterschieden.  
   refreshCurrent (count, pickedToken, `${pickedToken.type} erscheint`) 
    

  
  showBag();  
}
}




//______________________________
//Die ***FUNKTION returnToBag*** führt die Xeno-Ausbreitung aus. 
function returnToBag(pickedToken){
  
 
  
  
  //Siehe Beschreibung bei Funktion ziehen/drawFromBag
    history.push({
    round: count,
    bag: [...bag],
    pools: {...pools}
  })
  
  //Auch wenn der Token zurückgelegt wird handelt es sich um einen neuen Zug. Count wird daher auch bei dieser Funktion erhöht. 
  count++
  
  index =
  bag.findIndex(token => token.id === pickedToken.id);
  
  
  if(pickedToken.type=="Leer"){
    
    //Wenn das Leer Token gezogen wird, soll ein Jäger dem Beutel hinzugefügt werden. Es kann jedoch sein, dass schon alle Jäger im Beutel und damit keine mehr in pools sind. Über diese Abfrage, wird verhindert, dass es zu einer Fehlermeldung kommt. Es wird zunächst geprüft, ob noch Jäger in pools vorhanden sind. 
    if(pools.Jäger.length==0){
      refreshCurrent(count, pickedToken, `Kein Jäger mehr im Vorrat vorhanden. Dem Beutel kann kein Jäger hinzugefügt werden.`)
      return
    }
   
    
    //Sofern Jäger in pools vorhanden sind, wird dieser Code ausgeführt. Ein Jäger wird dem Beutel hinzugefügt. 
     refreshCurrent(count, pickedToken, `Ein Jäger wurde dem Beutel hinzugefügt.`)
    addToken("Jäger", 1)
    showBag()
    return
  }
  
  if(pickedToken.type=="Larve"){
    
    //Wenn der Token Larve gezogen wird, soll dem Beutel ebenfalls ein Jäger hinzugefügt werden. Es kann jedoch sein, dass keine Jäger mehr in pools sind. Dies muss also zunächst über diese if-Abfrage geklärt werden. 
    if(pools.Jäger.length==0){
      
      refreshCurrent(count, pickedToken, `Kein Jäger mehr im Vorrat vorhanden. Dem Beutel kann kein Jäger hinzugefügt werden.`)
      return
    }
    
    //Ist noch mindestens 1 Jäger in pools, wird dieser dem Beutel hinzugefügt. Die Larve wird aus bag entfernt und pools wieder hinzugefügt. 
    refreshCurrent(count, pickedToken, `Die Larve wurde aus dem Beutel entfernt. Ein Jäger wurde dem Beutel hinzugefügt.`)
    pools[pickedToken.type].push(pickedToken)
    bag.splice(index, 1)
    addToken("Jäger", 1)
    showBag()
    return
  }
  
   if(pickedToken.type=="Kriecher"){
     
     //Wenn keine Brutbestie mehr in pools, kommt dieser Code. S. bereits oben. 
     if(pools.Brutbestie.length==0){
      refreshCurrent(count, pickedToken, `Keine Brutbestie mehr im Vorrat vorhanden. Dem Beutel kann keine Brutbestie hinzugefügt werden.`)
      return
     }
     
     //Wenn noch mindestens 1 Brutbestie in pools, dann wird dieser Code ausgeführt. s. auch oben. 
     refreshCurrent(count, pickedToken, `Der Kriecher wurde aus dem Beutel entfernt. Eine Brutbestie wurde dem Beutel hinzugefügt.`)
    pools[pickedToken.type].push(pickedToken)
    bag.splice(index, 1)
    addToken("Brutbestie", 1)
    showBag()
    return
  }
  
  if(pickedToken.type=="Jäger" || pickedToken.type=="Brutbestie"){
     refreshCurrent(count, pickedToken, `In Reihenfolge führt jeder Charakter, der nicht im Kampf ist, eine Geräuschprobe aus. Der Token verbleibt im Beutel.`)
    showBag()
    return
  }
  
  if(pickedToken.type=="Königin"){
    
    //Wenn die Königin bei der Alien-Ausbreitung gezogen wird, wird zunächst der HTML-Code bei gezogen angepasst. Dann muss jedoch ein Fenster mit einer Abfrage geöffnet werden, da geprüft werden muss, ob sich ein Charakter im Nest befindet. 
    refreshCurrent(count, pickedToken, `-`)
    
    
    
    //Um die Abfrage anzeigen zu lassen, wird die Funktion open Modal gestartet. Sie ändert den Zustand des Abfragefensters. Es ist dann nicht mehr hidden und erscheint. Da alles weitere über die Button läuft und diese nicht auf die Variablen drawnToken und randomBagIndex zugreifen können - die beiden Variablen gibt es nur lokal innerhalb der Funktion - werden die Variablen in den globalen Variablen currentDrawnToken und currentIndex gespeichert. Alles Weitere siehe oben bei den Buttons.
    openModal()
    
    
  }  
}


//___________________________
//Die ***FUNKTION goBack*** setzt bag und pools um eine Runde zurück. 
function goBack(){
  
  if(history.length==0){
  document.getElementById("currentAction").textContent = `Rückgängig nicht möglich. History ist leer.`
    return
  }
  
  count = history[history.length - 1].round
  bag = history[history.length - 1].bag
  pools = history[history.length - 1].pools
  history.pop()
  showBag()
  
  document.getElementById("currentAction").textContent = `Letzte Aktion rückgängig gemacht.`
  document.getElementById("current-turn").innerText = `-`;
  document.getElementById("current-token").innerHTML = `<img>`;
  document.getElementById("current-action").innerText = `-`;
  document.getElementById("light-input").innerText = `-`;
  document.getElementById("dark-input").innerText = `-`;
  

  
  
  
}



//______________________________
//Die ***FUNKTION resetPools*** kann genutzt werden, um pools wieder in die Ausgangslage zu versetzen. Sie wird auch am Anfang des Codes ausgeführt, um pools gleich zu Beginn zu besetzen. 
function resetPools(){
  pools = {
  Leer: [
    { id: 0, symbol:"https://s1.directupload.eu/images/260520/bqxifsei.png", type: "Leer", light: 0, dark: 0 }
  ],

  Larve: [
    { id: 1, symbol:"https://s1.directupload.eu/images/260520/6xyb4ud2.png", type: "Larve", light: 0, dark: 1 },
    { id: 2, symbol:"https://s1.directupload.eu/images/260520/6xyb4ud2.png", type: "Larve", light: 0, dark: 1 },
    { id: 3, symbol:"https://s1.directupload.eu/images/260520/6xyb4ud2.png", type: "Larve", light: 1, dark: 2 },
    { id: 4, symbol:"https://s1.directupload.eu/images/260520/6xyb4ud2.png", type: "Larve", light: 0, dark: 1 },
    { id: 5, symbol:"https://s1.directupload.eu/images/260520/6xyb4ud2.png", type: "Larve", light: 1, dark: 2 },
    { id: 6, symbol:"https://s1.directupload.eu/images/260520/6xyb4ud2.png", type: "Larve", light: 1, dark: 2 },
    { id: 7, symbol:"https://s1.directupload.eu/images/260520/6xyb4ud2.png", type: "Larve", light: 1, dark: 2 },
    { id: 8, symbol:"https://s1.directupload.eu/images/260520/6xyb4ud2.png", type: "Larve", light: 0, dark: 1 }
  ],

  Kriecher: [
    { id: 9, symbol:"https://s1.directupload.eu/images/260520/t7ulbjyx.png", type: "Kriecher", light: 1, dark: 2 },
    { id: 10, symbol:"https://s1.directupload.eu/images/260520/t7ulbjyx.png", type: "Kriecher", light: 1, dark: 2 },
    { id: 11, symbol:"https://s1.directupload.eu/images/260520/t7ulbjyx.png", type: "Kriecher", light: 1, dark: 2 }
  ],

  Jäger: [
    { id: 12, symbol:"https://s1.directupload.eu/images/260520/p292774x.png", type: "Jäger", light: 1, dark: 3 },
    { id: 13, symbol:"https://s1.directupload.eu/images/260520/p292774x.png", type: "Jäger", light: 1, dark: 3 },
    { id: 14, symbol:"https://s1.directupload.eu/images/260520/p292774x.png", type: "Jäger", light: 1, dark: 3 },
    { id: 15, symbol:"https://s1.directupload.eu/images/260520/p292774x.png", type: "Jäger", light: 2, dark: 3 },
    { id: 16, symbol:"https://s1.directupload.eu/images/260520/p292774x.png", type: "Jäger", light: 2, dark: 3 },
    { id: 17, symbol:"https://s1.directupload.eu/images/260520/p292774x.png", type: "Jäger", light: 2, dark: 3 },
    { id: 18, symbol:"https://s1.directupload.eu/images/260520/p292774x.png", type: "Jäger", light: 2, dark: 4 },
    { id: 19, symbol:"https://s1.directupload.eu/images/260520/p292774x.png", type: "Jäger", light: 2, dark: 4 },
    { id: 20, symbol:"https://s1.directupload.eu/images/260520/p292774x.png", type: "Jäger", light: 2, dark: 4 },
    { id: 21, symbol:"https://s1.directupload.eu/images/260520/p292774x.png", type: "Jäger", light: 3, dark: 4 },
    { id: 22, symbol:"https://s1.directupload.eu/images/260520/p292774x.png", type: "Jäger", light: 3, dark: 4 },
    { id: 23, symbol:"https://s1.directupload.eu/images/260520/p292774x.png", type: "Jäger", light: 3, dark: 4 }
  ],

  Brutbestie: [
    { id: 24, symbol:"https://s1.directupload.eu/images/260520/wvsu73zf.png", type: "Brutbestie", light: 2, dark: 4 },
    { id: 25, symbol:"https://s1.directupload.eu/images/260520/wvsu73zf.png", type: "Brutbestie", light: 3, dark: 4 }
  ],

  Königin: [
    { id: 26, symbol:"https://s1.directupload.eu/images/260520/wo53ctmw.png", type: "Königin", light: 4, dark: 4 }
  ]
};
}

//_________________________
//Die ***FUNKTION openReveal*** wird eingeführt

function openReveal(pressedButton){
  
  document.getElementById("currentAction").textContent = `⚠ ${pressedButton.innerText} ⚠`

  modalSpin.classList.add("active");

  tokenGrid.innerHTML = "";

  /*
  ARRAY KOPIEREN UND MISCHEN
  */

  const shuffledTokens =
    [...bag].sort(() => Math.random() - 0.5);

  shuffledTokens.forEach((tokenData) => {

    const token =
      document.createElement("div");

    token.classList.add("token");
    

    token.innerHTML = `

      <div class="token-face token-back">
        ?
      </div>

      <div class="token-face token-front">
        <img src="${tokenData.symbol}">
      </div>

    `;

    /*
    TOKEN KLICK
    */

    token.addEventListener("click", () => {

      /*
      Nur einmal umdrehen
      */

      if(token.classList.contains("flipped"))
        return;

      token.classList.add("flipped");
      
      
      
      if(spinActive==true){
      token.classList.add("flippedFirst");
      spinActive=false
      
       if(pressedButton == drawBtn){
      drawFromBag(tokenData)
       }
      
      
      if(pressedButton == returnBtn){
        returnToBag(tokenData)
      }
      }

      console.log(
        "Aufgedeckt:",
        tokenData.type,
        tokenData.id
      );

    });

    tokenGrid.appendChild(token);

  });

}



//__________________________
//Die ***FUNKTION showBag*** soll den aktuellen Beutelinhalt im HTML-Code einfügen und für den User im Interface sichtbar machen. 
function showBag(){
  
  //Es wird zunächst ein leeres Objekt erstellt, dass nach und nach mit den Informationen gefüllt wird. 
  let bagCount={}
  
  //bag wird mit forEach für jedes enthaltene Element durchlaufen. Für jede "Runde" des Durchlaufs, wird das aktuelle Element in bagObject gespeichert. 
  bag.forEach(bagObject=>{
    
    //Mit if wird überprüft, ob des den type schon im Objekt bagCount gibt. Hierzu passiert Folgendes: bagObject.type gibt den type des aktuell geprüften Elements aus. In bagCount wird dann nach dem type gesucht. Wird der type gefunden, ist die if Bedingung erfüllt. Dann wird im Objekt bagCount der entsprechende type um 1 erhöht. 
    if(bagCount[bagObject.type]){
      bagCount[bagObject.type] = bagCount[bagObject.type] + 1;  
    }
    
    //Wird der type des aktuell überprüften Elements nicht in bagObject gefunden, wird in bagCount ein entsprechender Key mit dem Wert 1 erstellt. 
    else {
      bagCount[bagObject.type]=1
    }
      
  })
  
  //Nun muss noch aus dem "fertigen" Objekt bagCount eine Liste für HTML erstellt werden und dort dann eingefügt werden. 
  let html = "<ul>";

  //Der Inhalt des Objekts bagCount muss nun durchlaufen werden. Allerdings kann forEach nicht auf Objekte angewendet werden. Daher ist es erforderlich, dass bagCount mit der Methode Object.entries(bagCount) in ein Array umgewandelt wird. Auf dieses Array wird dann forEach angewandt. Den Rest verstehe ich selber nicht, aber klappt. 
  Object.entries(bagCount).forEach(([type, count]) => {
    html += `<li>${type}: ${count}x</li>`;
  });

 
  html += "</ul>";
   
  
  //Aus dem HTML-Code wird das Element bag zu JavaScript geholt und der innere HTML-Code mit der zusammengesetzten Variablen html aktualisiert. 
    document.getElementById("bag").innerHTML = html;

}


//_________________________________
//Die ***FUNKTION refreshCurrent*** aktualisiert die Anzeige im Bereich "Gezogen"

function refreshCurrent (zug, token, text){
 document.getElementById("current-turn").innerText = `Zug ${zug}`;
 document.getElementById("current-token").innerHTML = `<img src="${token.symbol}" alt="Token">`;
 document.getElementById("current-action").innerText = `${text}`;
 document.getElementById("light-input").innerText = token.light;
 document.getElementById("dark-input").innerText = token.dark;

  
}

//________________________________
//Hier werden alle span-Elemente aus modalManually mit einem eventListener versehen. 

document.querySelectorAll(".manuallyUp").forEach(button => {
  button.addEventListener("click", () => {

    const input = button.previousElementSibling;

    const value = Number(input.value);
    const max = Number(input.max);

    if (value < max) {
      input.value = value + 1;
    }
  });
});

document.querySelectorAll(".manuallyDown").forEach(button => {
  button.addEventListener("click", () => {

    const input = button.nextElementSibling;

    const value = Number(input.value);
    const min = Number(input.min);

    if (value > min) {
      input.value = value - 1;
    }
  });
});


//_________________________________
// Die ***FUNKTIONEN openModal UND closeModal*** werden eingefügt. Wenn bei der Alien-Ausbreitung (Button zurücklegen) der Token der Königin gezogen wird, muss geprüft werden, ob sich ein Charakter im Nest befindet. Hier ist eine Frage vom User zu beantworten. Die Frage mit Antwortbuttons ist jedoch hidden, bis die gerade beschriebene Situation eintritt. Dann muss das Element sichtbar gemacht werden. 
function openModal() {
  modal.classList.remove("hidden")
}

function closeModal() {
  modal.classList.add("hidden")
}

//________________________
//Die ***FUNTKION openModalManually*** öffnet das Fenster, in dem dann der Beutelinhalt manuell angepasst werden kann. Sofern der Beutel beim Klick auf den Button Beutel anpassen noch leer ist, wird die Maske mit Standardwerten vorbelegt. Ist der Beutel beim Klick auf den Button schon gefüllt, werden die Werte aus dem Beutel übernommen. Dann können die einzelnen Alienarten in Ihrer Anzahl erhöht oder verringert werden. 
function openModalManually() {
  modalManually.classList.remove("hidden")
  if (bag.length>0){
    manuallyLarve.value=bag.filter(token => token.type == "Larve").length
    manuallyKriecher.value=bag.filter(token => token.type == "Kriecher").length
    manuallyJäger.value=bag.filter(token => token.type == "Jäger").length
    manuallyBrutbestie.value=bag.filter(token => token.type == "Brutbestie").length
    manuallyKönigin.value=bag.filter(token => token.type == "Königin").length
   
      }
  
 
  
}

function closeModalManually() {
  modalManually.classList.add("hidden")
}


/*
Was der Code bisher kann:
- Beutel befüllen
- Die Anzahl der Jäger, die in den Beutel gelegt werden, entspricht 3+Spielerzahl
- Den Inhalt des Beutels im HTLM-Code ausgeben. 
- Der Code sollte nun über Sicherheitsabfragen verfügen, die prüfen, ob die Alienart, die in bag gelegt werden soll, überhaupt noch in pools vorhanden ist. 
- Es gibt nun eine Funktion ziehen (mittlerweile mit Namen Xeno-Begegnung)
- Es gibt nun eine Funktion zurücklegen (mittlerweile mit Namen Xeno-Ausbreitung)
- Wir bei der Xeno-Ausbreitung die Königin gezogen, erfolgt eine Abfrage, ob ein Charakter im Nest ist. Die Abfrage erfolgt nun über eine Eingabenmaske und Button im HTML-Code und nicht mehr über eine Fehlermeldung im Browser. 
- Die Anzahl der Aliens im Beutel kann manuell angepasst werden. 
- Es gibt nun einen Button "Rückgängig" mit dem der letzte Schritt rückgängig gemacht werden kann. 



Was noch fehlt: 
- Es müssen ggfs. noch Sicherheitsabfragen erstellt werden
- Es soll noch eine History geben, damit man alle Veränderungen des Beutels nachvollziehen kann. (noch notwendig?)
- HTML und CSS müssen noch angepasst werden, damit das Design besser wird
- Der Code muss noch in eine App umgewandelt werden. 
*/
