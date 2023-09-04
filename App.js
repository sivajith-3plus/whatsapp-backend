const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

//db
const connectDB = require("./DataBase/connection");

//api
const Auth = require("./DataBase/Api/Auth");
const Users = require("./DataBase/Api/User");
const Messages = require("./DataBase/Api/Message");

const app = express();
const port = 5000;
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//for application routes
app.use("/auth", Auth);
app.use("/users", Users);
app.use("/messages", Messages);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io", socket.id);
  socket.on("send_message", (data) => {
    console.log(data);
    io.emit("receive_message", data);
  });
  socket.on('onChat', () => {
    console.log('socket onchat');
    socket.emit('msgSeen');
  })
  socket.on('delete chat',()=>{
    io.emit('chat deleted')
  })
});

server.listen(port, () => {
  connectDB()
    .then(() => console.log("server started at port", port, 'and DB connected'))
    .catch((err) => console.log("DB connection failed", err));
});
       