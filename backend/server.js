require("dotenv").config();
const express = require("express");
const boardRoutes = require("./routes/boards");
const groupRoutes = require("./routes/groups");
const userRoutes = require("./routes/userRoutes");
const mongoose = require("mongoose");
const path = require("path");

const cors = require("cors");

//express app
const app = express();

// socket
const socketIo = require("socket.io");

//middleware

app.use(express.json());
app.use((req, res, next) => {
  console.log("Path: ", req.path, " Method: ", req.method);
  next();
});

//routes
app.use("/api/boards", boardRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/users", userRoutes);

//Connect to DB
mongoose.connect(process.env.MONGO_URI);

const port = process.env.PORT;
// const port = 4000;

const server = app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});

console.log("Environment: ", process.env.NODE_ENV);

// server Front end
app.use(express.static(path.join(__dirname, "../build")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

const io = socketIo(server);

// const io = socketIo(server, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// }); // Front end is on 3000

app.use(cors);
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("join", function (room) {
    socket.join(room);
    console.log("Room", room);
  });

  socket.on("send-push", ({ room, message }) => {
    console.log({ room, message });
    socket.to(room).emit("receive-push", { message });
  });
});
