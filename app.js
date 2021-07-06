const listsContainer = document.querySelector("[data-lists]");
const newListForm = document.querySelector("[data-new-list-form]");
const newListInput = document.querySelector("[data-new-list-input]");
const deleteListButton = document.querySelector("[data-delete-list-button]")
const listDisplayContainer = document.querySelector("[data-list-display-container]");
const listTitleElement = document.querySelector("[data-list-title]");
const listCountElement = document.querySelector("[data-list-count]");
const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template"); 
const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskInput = document.querySelector("[data-new-task-input]");
const clearCompleteTaskButton = document.querySelector("[data-clear-complete-tasks-button]");


const LOCAL_STORAGE_LIST_KEY = "task.lists"; // . prevent overriding information that in local storage
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selecledListId";
// localStorage property allow to save key/value pairs in a web browser.
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []; // getItem in localStorage using LOCAL_STORAGE_LIST_KEY if exist parse it if not give me an empty array list
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY);


listsContainer.addEventListener("click", (event) => {
    if(event.target.tagName.toLowerCase() === "li") {
        selectedListId = event.target.dataset.listId;
        saveAndRender();
    }
});

tasksContainer.addEventListener("click", (event) => {
    if(event.target.tagName.toLowerCase() === "input") {
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === event.target.id);
        selectedTask.complete = event.target.checked; 
        save();
        renderTaskCount(selectedList);
    }
});

clearCompleteTaskButton.addEventListener("click", (event) => {
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
    saveAndRender();
});

deleteListButton.addEventListener("click", (event) => {
    lists = lists.filter(list => list.id !== selectedListId); // show new list that meet the condition
    selectedListId = null;
    saveAndRender(); 
})

newListForm.addEventListener("submit", (event) => {
    event.preventDefault(); // prevent submitting/reloading the page
    const listName = newListInput.value; // value that we input
    if(listName == null || listName == "") return;
    const list = createList(listName);
    newListInput.value = null; // clear the input value in html 
    lists.push(list);
    saveAndRender();
});

newTaskForm.addEventListener("submit", (event) => {
    event.preventDefault(); // prevent submitting/reloading the page
    const taskName = newTaskInput.value; // value that we input
    if(taskName == null || taskName == "") return;
    const task = createTask(taskName);
    newTaskInput.value = null; // clear the input value in html 
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks.push(task);
    saveAndRender(); 
});

function createList(name) {
    return {id: Date.now().toString(), name: name, tasks: []};
}

function createTask(name) {
    return {id: Date.now().toString(), name: name, conmplete: false};

}

function saveAndRender() {
    save();
    render();
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists)); // save information in localStorage 
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedListId);
}

function render() {
    clearElement(listsContainer);
    renderLists();

    const selectedList = lists.find(list => list.id === selectedListId);

    if(selectedListId === null){
        listDisplayContainer.style.display = "none";
    }else {
        listDisplayContainer.style.display = "";
        listTitleElement.innerText = selectedList.name;
        renderTaskCount(selectedList);
        clearElement(tasksContainer);
        renderTasks(selectedList);
    }
}

function renderTasks(selectedList) {
    selectedList.tasks.forEach(task => {
        // importNode - https://www.w3schools.com/jsref/met_document_importnode.asp
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkbox = taskElement.querySelector("input");
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        const label = taskElement.querySelector("label");
        label.htmlFor = task.id;
        label.append(task.name);
        tasksContainer.appendChild(taskElement);
    });
}

function renderTaskCount(selectedList) {
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length;
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"; // if === 1 "task" !=== "tasks";
    
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement("li");
        listElement.dataset.listId = list.id; 
        listElement.classList.add("list-name");
        listElement.innerText = list.name;
        if (list.id === selectedListId) {
            listElement.classList.add("active-list");
        }
        listsContainer.appendChild(listElement);
    });
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

render();