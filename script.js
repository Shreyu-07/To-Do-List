let addButton = document.getElementById("addTask");
let taskInput = document.getElementById("taskInput");
let taskList = document.getElementById("taskList");

// Open (or create) the IndexedDB database
let db;
let request = indexedDB.open("taskDB", 1);

request.onerror = function(event) {
    console.log("Error opening IndexedDB:", event);
};

request.onsuccess = function(event) {
    db = event.target.result;
    loadTasks(); // Load tasks when the page loads
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    let objectStore = db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("task", "task", { unique: false });
};

function addTask() {
    let task = taskInput.value.trim();

    if (task) {
        createTaskElement(task);
        taskInput.value = "";
        saveTask(task); // Save after adding task
    } else {
        alert("Please enter the task....");
    }
}

addButton.addEventListener("click", addTask);

function createTaskElement(task) {
    let listItem = document.createElement("li");
    listItem.textContent = task;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = 'Delete';
    deleteButton.className = "deleteTask";
    listItem.appendChild(deleteButton);

    deleteButton.addEventListener("click", () => {
        taskList.removeChild(listItem);
        deleteTask(task); // Delete from IndexedDB
    });

    taskList.appendChild(listItem);
}

function saveTask(task) {
    let transaction = db.transaction(["tasks"], "readwrite");
    let objectStore = transaction.objectStore("tasks");

    let request = objectStore.add({ task: task });
    request.onerror = function(event) {
        console.log("Error saving task:", event);
    };
    request.onsuccess = function(event) {
        console.log("Task saved to IndexedDB");
    };
}

function loadTasks() {
    let transaction = db.transaction(["tasks"], "readonly");
    let objectStore = transaction.objectStore("tasks");

    objectStore.openCursor().onsuccess = function(event) {
        let cursor = event.target.result;
        if (cursor) {
            createTaskElement(cursor.value.task); // Create element for each stored task
            cursor.continue();
        }
    };
}

function deleteTask(task) {
    let transaction = db.transaction(["tasks"], "readwrite");
    let objectStore = transaction.objectStore("tasks");

    let index = objectStore.index("task");
    let request = index.openCursor(IDBKeyRange.only(task));

    request.onsuccess = function(event) {
        let cursor = event.target.result;
        if (cursor) {
            objectStore.delete(cursor.primaryKey); // Delete the task
            console.log("Task deleted from IndexedDB");
        }
    };
}