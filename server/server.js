const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: { origin: "http://localhost:4200", methods: ["GET", "POST"] },
});
const PORT = 3000;
const server = require("./listen");
// const socket = require('./sockets/something') to add later

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
server.listen(http, PORT);

//routes to use for auth
// app.post("/api/auth", require("./routes/postLogin"));
// app.post("/api/auth/update", require("./routes/updateUser"));
// app.post("/api/auth/logout", require("./routes/logoutUser"));
app.get("/", (req, res) => {
  console.log("server has been spun up");
  res.send("Hello");
});
// just checking the server is running
