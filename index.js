const form = document.querySelector("form")
const todoCol = document.querySelector("#todo-col")
const toInProgressBtn = document.querySelector("#to-in-progress")
const inProgressCol = document.querySelector("#in-progress-col")
const toDoneBtn = document.querySelector("#to-done")
const doneCol = document.querySelector("#done-col")

const inProgressClass = "inProgress"
const doneClass = "done"

function createTask(id, title, description) {
        const task = document.createElement("div")
        task.id = id
        task.classList.add("task")

        const _title = document.createElement("h3")
        _title.innerHTML = title

        const _description = document.createElement("p")
        _description.innerHTML = description

        task.appendChild(_title)
        task.appendChild(_description)
        task.addEventListener("click", (event) => {
                event.target.closest(".task").classList.toggle("selected")
        })

        return task
}

form.addEventListener("submit", (event) => {
        event.preventDefault()

        fetch("http://localhost:3000/tasks", {
                "method": "POST",
                "headers": {
                        "Content-Type": "application/json"
                },
                "body": JSON.stringify({
                        "title": event.target.querySelector("input").value,
                        "description": event.target.querySelector(
                                        "textarea"
                                ).value,
                        "isInProgress": false,
                        "completed": false,
                })
        }).then((response) => response.json()).then((newTask) => {
                const _newTask = createTask(
                        newTask.id,
                        form.querySelector("input").value,
                        form.querySelector("textarea").value
                )

                todoCol.appendChild(_newTask)
        })
})
 
fetch("http://localhost:3000/tasks").then((response) => 
        response.json()).then((tasks) => {
                tasks.forEach(task => {
                        const newTask = createTask(
                                task.id,
                                task.title,
                                task.description
                        )

                        if (task.isInProgress) {
                                inProgressCol.appendChild(newTask)
                                newTask.classList.add(inProgressClass)
                        } else if (task.completed) {
                                newTask.classList.add(doneClass)
                                doneCol.appendChild(newTask)
                        } else {
                                todoCol.appendChild(newTask)
                        }
                })           
        })

toInProgressBtn.addEventListener("click", _ => {
        todoCol.querySelectorAll(".selected").forEach((task) => {
                const id = task.getAttribute("id")
                const title = task.querySelector("h3").innerHTML
                const description = task.querySelector("p").innerHTML

                fetch(`http://localhost:3000/tasks/${id}`, {
                        "method": "PUT",
                        "headers": {
                                "Content-Type": "application/json"
                        },
                        "body": JSON.stringify({
                                "id": id,
                                "title": title,
                                "description": description,
                                "isInProgress": true,
                                "completed": false
                        })
                }).then(() => {
                        todoCol.removeChild(task)
                        inProgressCol.appendChild(task)
                        task.classList.remove("selected")
                        task.classList.add(inProgressClass)
                })
        })
})

toDoneBtn.addEventListener("click", _ => {
        inProgressCol.querySelectorAll(".selected").forEach((task) => {
                const id = task.getAttribute("id")
                const title = task.querySelector("h3").innerHTML
                const description = task.querySelector("p").innerHTML

                fetch(`http://localhost:3000/tasks/${id}`, {
                        "method": "PUT",
                        "headers": {
                                "Content-Type": "application/json"
                        },
                        "body": JSON.stringify({
                                "id": id,
                                "title": title,
                                "description": description,
                                "isInProgress": false,
                                "completed": true
                        })
                }).then(() => {
                        inProgressCol.removeChild(task)
                        doneCol.appendChild(task)
                        task.classList.remove("selected")
                        task.classList.remove(inProgressClass)
                        task.classList.add(doneClass)
                })
        })
})
