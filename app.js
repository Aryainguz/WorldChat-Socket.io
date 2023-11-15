const express = require('express')
const http = require('http')
const app = express()
const cors = require('cors')
const {Server} = require('socket.io')
const localStorage = require('local-storage')

app.use(cors({
    origin: '*'
}))     

// In socket.io applications we can not directly use app.listen because socket io need to be wrapped in http server so we use http.createServer(app) to wrap our app in http server and also connect socket io to http server
const server = http.createServer(app)

// Socket.io confgiration with our express server
const io = new Server(server,{
    cors: {
        origin: '*'
    }
})

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')                          

// Socket io connection event
io.on("connection", (socket) => {
    const id = socket.id
    console.log("User connected: ", socket.id)

    // message event
    socket.on("send-message", (data) => {
        console.log(data)
        socket.broadcast.to(data.id).emit("receive-message", data)
    })

    // disconnect event
    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id)
    })
})

app.get('/', (req, res) => { 
    res.render('index')
 })          

server.listen(3000, () => console.log('Server is running...'))