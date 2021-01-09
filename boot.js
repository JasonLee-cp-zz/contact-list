const CONTACT_INFO = "contactInfo";

class Contact{}

let contact = new Contact();



//UI Class
class UI{
    static deleteInput(){
        document.querySelector("#filter-input").value="";
    }

    static addName(first,name){
        if(contact[first]===undefined) contact[first]=[];
        contact[first].push(name);
        contact[first].sort();
        let nameList = contact[first];
        const targetList = document.querySelector(`.${first}-contact`);
        targetList.innerHTML=""; //reset <ul>

        const defaultItem = document.createElement("li"); //header
        defaultItem.className = "list-group-item bg-primary mt-2 default";
        defaultItem.innerHTML = first.toUpperCase();
        targetList.append(defaultItem);

        nameList.forEach((name)=>{
            const newList = document.createElement("li");
            newList.className=`list-group-item bg-light ml-3 mt-1 borderless text-dark`;
            newList.innerHTML=`<a href="#"; class="text-dark" style="border-bottom:0;">${name}</a> <button type="button" class="btn btn-danger btn-sm del-btn" style="position: absolute; right:10px; top:5px;">X</button>`;
            targetList.append(newList);
        })
        Store.setStorage(contact);
    }

    static displayItems(name){
        const allItems = document.querySelectorAll(".list-group-item");
    
        allItems.forEach((item)=>{
            if(name==''){
                item.style.display='';
                return;
            }
            if(!item.classList.contains('default')){
                const itemContent = item.innerText.toUpperCase();
                if(!itemContent.includes(name.toUpperCase())){
                    item.style.display='none';
                }else{
                    item.style.display='';
                }
            }
        })
    }

    static deleteName(evt){
        const target = evt.target;
        
        if(target.classList.contains('del-btn')){
            const delName = target.previousElementSibling.innerText;
            contact[delName[0].toLowerCase()] = contact[delName[0].toLowerCase()].filter((item) => item!=delName);
            contact[delName[0].toLowerCase()].sort();
            target.parentElement.remove();
            Store.setStorage(contact);
            UI.popAlert("Deleted Successfully!","success");
        }
        
    }

    static popAlert(message, colorName){
        const header = document.querySelector(".header");
        const popMsg = document.createElement("div");
        popMsg.className = `alert alert-${colorName}`;
        popMsg.innerText = message;
        header.insertAdjacentElement("afterend",popMsg);
        setTimeout(()=>{popMsg.remove()},1000);
    }
}

//Store Class
class Store{
    static setStorage(contact){
        for(var letter in contact){
            if(contact[letter].length==0){
                delete contact[letter];
            }
        }
        if(Object.keys(contact).length === 0){
            Store.removeStorageByKey(CONTACT_INFO);
            return;
        }
        localStorage.setItem(CONTACT_INFO, JSON.stringify(contact));
    }

    static removeStorageByKey(key){
        localStorage.removeItem(key);
    }

    static initData(data){
        console.log(data);
        
        for(let key in data){
           data[key].forEach((val)=>{
               UI.addName(key,val);
           })
        }
    }

}

//handle Submit 
const submitBtn = document.querySelector("#submit-button");
submitBtn.addEventListener("click",handleSubmit);

function handleSubmit(){
    //When submitted, display all items
    UI.displayItems('');
    //get name
    const submitName = filterInput.value;
    if(submitName==''){
        UI.popAlert("Please fill the input!","danger");
        return;
    }

    //get first letter
    const firstLetter = submitName[0].toLowerCase();
    UI.deleteInput(); //clear input fields
    UI.addName(firstLetter,submitName);
    UI.popAlert("Added Successfully!","success");
}

//handle Filter
const filterInput = document.querySelector("#filter-input");
filterInput.addEventListener("keyup", handleInput);
function handleInput(){
    const inputVal = filterInput.value;
    UI.displayItems(inputVal);
}

//handle Delete Name
const container = document.querySelector(".container");
container.addEventListener("click",UI.deleteName);


//When opened, get data from the storage
function init(){
    const contactData = localStorage.getItem(CONTACT_INFO);
    if(contactData === null){
        UI.popAlert("Welcome!","warning");
    }else{
        Store.initData(JSON.parse(contactData));
    }
}

init();