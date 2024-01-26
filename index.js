import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://endorsements-project-156b7-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements")

const inputFieldEl = document.getElementById("input-field")
const publishBtn = document.getElementById("publish-btn")
const endorsementListEl = document.getElementById("endorsement-list")
const fromEl = document.getElementById("from-input")
const toEl = document.getElementById("to-input")

publishBtn.addEventListener("click", function(){
    let inputValue = inputFieldEl.value
    
    let samurai = {
        input: inputFieldEl.value,
        from: fromEl.value,
        to: toEl.value
    }
    
    push(endorsementsInDB, samurai)
    
    clearInputField()
})

onValue(endorsementsInDB, function(snapshot){
    if (snapshot.exists()){
        let arrayItems = Object.entries(snapshot.val())
        
        clearEndorsementField()
        
        for(let i = 0; i < arrayItems.length; i++){
            let currentItem = arrayItems[i]
            let currentItemID = arrayItems[0]
            let currentItemValue = arrayItems[1]
            
            renderEndorsements(currentItem)
        }
        
    } else {
        endorsementListEl.innerHTML = `
            <p class="no-items">
                No items here yet...
            </p>
        `
    }
})

function renderEndorsements(item){
    let itemID = item[0]
    let itemValue = item[1]

    let newDiv = document.createElement("div")
    newDiv.classList.toggle("endorsement")
    
    newDiv.innerHTML = `
        <div class="endorsement">
            <h3 class="to-heading">To: ${itemValue.to}</h3>
            ${itemValue.input}
            <h3 class="from-heading">From: ${itemValue.from}</h3>
        </div> 
    
    `
    
    newDiv.addEventListener("click", function(){
        let exactLocationOfItemInDB = ref(database, `endorsements/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    endorsementListEl.append(newDiv)
}

function clearInputField(i){
    inputFieldEl.value = ""
    fromEl.value = ""
    toEl.value = ""
}

function clearEndorsementField(){
    endorsementListEl.innerHTML = ""
}