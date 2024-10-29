const main = document.querySelector("main")

const createForm = document.querySelector(".form-create")
const createFormInput = document.querySelector(".form-create input")

const todosHtml = document.querySelector(".to-dos")

const alertCheckedHtml = document.querySelector(".alert-checked")
const alertDeleteHtml = document.querySelector(".alert-delete")

const todos = JSON.parse(localStorage.getItem("to-dos")) || []

document.onload = reloadTodos({ vibrate: false })

createForm.onsubmit = (e) => {
  e.preventDefault()

  if (!createFormInput.value) return

  todos.push({
    checked: false,
    title: createFormInput.value
  })

  createFormInput.value = ""
  updateLocalStorage()
  reloadTodos({ vibrate: false })
}

function checkTodo({ index }) {
  const todo = todos[index]
  todos.splice(index, 1)
  todos.unshift({
    title: todo.title,
    checked: !todo.checked
  })

  if (!todo.checked) toggleAlert({ close: false, alert: 'checked' })
  if (todo.checked) toggleAlert({ close: true, alert: 'checked' })
  toggleAlert({ close: true, alert: 'delete' })

  updateLocalStorage()
  reloadTodos({ vibrate: true })
}

function deleteTodo({ index }) {
  try {
    document.getElementById(`todo-${index}-button`).classList.add("rotate-45deg")
  } catch { } finally {
    setTimeout(() => {
      todos.splice(index, 1)
      updateLocalStorage()
      reloadTodos({ vibrate: true })
      toggleAlert({ close: false, alert: 'delete' })
      toggleAlert({ close: true, alert: 'checked' })
    }, 250)
  }
}

function toggleAlert({ close, alert }) {
  if (alert === "delete") {
    if (close) return alertDeleteHtml.classList.add("alert-hidden")

    if (alertDeleteHtml.classList.contains("alert-hidden")) {
      alertDeleteHtml.classList.remove("alert-hidden")
    }

    if (alertDeleteHtml.classList.contains("alert-vibrate")) {
      alertDeleteHtml.classList.remove("alert-vibrate")
    }

    setTimeout(() => {
      alertDeleteHtml.classList.add("alert-vibrate")
    }, 50)
  } else {
    if (close) return alertCheckedHtml.classList.add("alert-hidden")

    if (alertCheckedHtml.classList.contains("alert-hidden")) {
      alertCheckedHtml.classList.remove("alert-hidden")
    }

    if (alertCheckedHtml.classList.contains("alert-vibrate")) {
      alertCheckedHtml.classList.remove("alert-vibrate")
    }

    setTimeout(() => {
      alertCheckedHtml.classList.add("alert-vibrate")
    }, 50)
  }
}

function reloadTodos({ vibrate }) {
  todosHtml.innerHTML = ""
  todos?.map((todo, index) => {
    todosHtml.innerHTML += `
      <fieldset ${!!vibrate && todo.checked  && 'class="alert-vibrate"'} id="todo-${index}">
        <input type="checkbox" onchange={checkTodo({index:${index}})} ${todo.checked && "checked"}/>
        <p>${todo.title}</p>
        <button id="todo-${index}-button" onclick={deleteTodo({index:${index}})}><img src="./assets/images/trash.svg" alt="Lixeira"/></button>
      </fieldset>
    `
  })
}

const updateLocalStorage = () => localStorage.setItem("to-dos", JSON.stringify(todos))