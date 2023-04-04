const dom = {
    new: document.getElementById('new'),
    add: document.getElementById('add'),
    tasks: document.getElementById('tasks')
}

let allTodo = document.querySelector('.todo')

//Array of tasks

let tasks = [];

//local storage check

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
    taskRender(tasks)
}

//Input focus
dom.new.focus()


//Add event listener to add new task
dom.new.addEventListener("keyup", function (event) {
    if (event.code == 'Enter') {
        const newTask = dom.new.value;
        if (newTask && checkTask(newTask, tasks)) {
            addTask(newTask, tasks);
            dom.new.value = '';
            taskRender(tasks);
            localStorage.setItem('tasks', JSON.stringify(tasks))
        }
    }
})

// Stop default selection

dom.add.onmousedown = function () {
    return false
}

//Onclick

dom.add.onclick = () => {
    const newTask = dom.new.value;
    if (newTask && checkTask(newTask, tasks)) {
        addTask(newTask, tasks);
        dom.new.value = '';
        taskRender(tasks);
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }
};

//Function which add new task
function addTask(text, list) {
    const timestamp = Date.now();
    const task = {
        id: timestamp,
        text,
        isCompleted: false
    };
    list.push(task)

}

// Check if the task already exists
function checkTask(text, list) {
    let isNotExist = true;

    list.forEach((task) => {
        if (task.text === text) {
            showMessage('Справа вже є у списку!')
            isNotExist = false
        }
    })

    return isNotExist;
}

//Function showMessage
function showMessage(text) {
    let elem = document.createElement('div')
    elem.classList.add('alert')
    elem.innerHTML = `<strong>${text}</strong>`
    document.querySelector('.todo').prepend(elem)
    setTimeout(() => {
        elem.remove()
    }, 2000)
}

// Function view a new todo
function taskRender(list) {
    let htmlList = '';

    list.forEach((task) => {
        const cls = task.isCompleted ? 'todo_task todo_task_complete' : 'todo_task';

        const checked = task.isCompleted ? 'checked' : ''

        const taskHtml = `
        <div id='${task.id}' class="${cls}">
        <label class="todo_checkbox">
            <input type="checkbox" ${checked}>
            <div class="todo_checkbox-div"></div>
        </label>
        <div class="todo_task-text">${task.text}</div>
        <div class="todo_task-del">-</div>
    </div>
        `

        htmlList += taskHtml;
    })

    dom.tasks.innerHTML = htmlList
}

//Look for click on checkbox

dom.tasks.onclick = (event) => {
    const target = event.target
    const isCheckBoxEl = target.classList.contains('todo_checkbox-div')
    const isDeleteEl = target.classList.contains('todo_task-del')
    if (isCheckBoxEl) {
        const task = target.parentElement.parentElement
        const taskId = task.getAttribute('id')
        changeTaskStatus(taskId, tasks)
        localStorage.setItem('tasks', JSON.stringify(tasks))
        taskRender(tasks);
    }
    if (isDeleteEl) {
        const task = target.parentElement
        const taskId = task.getAttribute('id')
        deleteTask(taskId, tasks)
        taskRender(tasks)
    }
}

//Function change status of task
function changeTaskStatus(id, list) {
    list.forEach((task) => {
        if (task.id == id) {
            task.isCompleted = !task.isCompleted
        }
    })
}

// Delete task
function deleteTask(id, list) {
    list.forEach((task, index) => {
        if (task.id == id) {
            list.splice(index, 1)
            localStorage.setItem('tasks', JSON.stringify(list))
        }
    })
}



