import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js"

const pathname = window.location.pathname

const code = pathname.split("/")[2]

document.querySelector(".code span").textContent = code

const wordContainer = document.querySelector(".word-container")
const word = document.querySelector(".word")
const newWordBtn = document.querySelector(".new-word")
const imposter = document.querySelector(".imposter")
const playersCounter = document.querySelector(".players span")

const socket = io({
  query: { code }
})

newWordBtn.addEventListener("click", () => {
  socket.emit("new word", code)
})

socket.on("new word", (data) => {
  wordContainer.classList.remove("hidden")
  if (!data) {
    word.classList.add("hidden")
    imposter.classList.remove("hidden")
  } else {
    imposter.classList.add("hidden")
    word.classList.remove("hidden")
    word.textContent = data
  }
})

socket.on("new player", (data) => {

  playersCounter.textContent = data
  if (data > 2) {
    newWordBtn.removeAttribute("disabled")
    newWordBtn.textContent = "Nueva palabra"
  } else {
    newWordBtn.setAttribute("disabled", true)
    newWordBtn.textContent = "Minimo tres jugadores"
  }
})

