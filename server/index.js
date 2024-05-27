import dotenv from "dotenv"
import express from "express"
import { createServer } from "node:http"
import { Server } from "socket.io"
import { WORDS } from "./constants.js"

dotenv.config()

const port = process.env.PORT ?? 8080

const app = express()
const server = createServer(app)
const io = new Server(server)

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/view/index.html")
})

app.get("/room/:id", (req, res) => {
  res.sendFile(process.cwd() + "/view/room.html")
})

app.use(express.static("client"))

io.on("connection", (socket) => {
  const socketCode = socket.handshake.query.code
  socket.join(socketCode)

  socket.on("disconnect", () => {
    console.log("user disconnected");
    const clients = io.sockets.adapter.rooms.get(socketCode)
    io.to(socketCode).emit("new player", clients ? clients.size : 0)
  })

  socket.on("new word", (code) => {
    const clients = io.sockets.adapter.rooms.get(code)
    const word = getRandomWord()
    const imposter = getImposter(clients.values())
    io.to(code).except(imposter).emit("new word", word)
    io.to(imposter).emit("new word", false)
  })

  io.to(socketCode).emit("new player", io.sockets.adapter.rooms.get(socketCode).size)
})  


server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})

const getRandomWord = () => {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)]
  return word
}

const getImposter = (clientsSet) => {
  const clients = Array.from(clientsSet)
  const imposter = clients[Math.floor(Math.random() * clients.length)]
  return imposter
}