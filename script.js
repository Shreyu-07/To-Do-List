
        let addButton = document.getElementById("addTask");
        let taskInput = document.getElementById("taskInput");
        let taskList = document.getElementById("taskList");

        loadTasks(); // Load tasks when the page loads

        function addTask() {
            let task = taskInput.value.trim();

            if (task) {
                createTaskElement(task);
                taskInput.value = "";
                saveTasks(); // Save after adding task
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
                saveTasks(); // Save after deleting task
            });

            taskList.appendChild(listItem);
        }

        function saveTasks() {
            let tasks = [];
            taskList.querySelectorAll('li').forEach(function (item) {
                tasks.push(item.firstChild.textContent.trim()); // Ensures we only save the task text, not the 'Delete' button
            });

            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        function loadTasks() {
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            tasks.forEach(createTaskElement);
        }