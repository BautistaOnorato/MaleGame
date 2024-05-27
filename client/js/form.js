const createBtn = document.querySelector(".create-room")
const joinForm = document.querySelector("form")

const randomId = () => Math.random().toString(36).substring(2, 8)

createBtn.addEventListener("click", () => {
  window.location.href = "/room/" + randomId()
})

joinForm.addEventListener("submit", (e) => {
  e.preventDefault()
  window.location.href = "/room/" + e.target[0].value
})