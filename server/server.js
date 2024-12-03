const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: { origin: "http://localhost:4200", methods: ["GET", "POST"] },
});
const PORT = 3000;
const server = require("./listen");
const socket = require("./routes/sockets/socket");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
socket.connect(io, PORT);
server.listen(http, PORT);

//routes to use for auth
// app.post("/api/auth", require("./routes/postLogin"));
// app.post("/api/auth/update", require("./routes/updateUser"));
// app.post("/api/auth/logout", require("./routes/logoutUser"));
app.get("/", (req, res) => {
  console.log("server has been spun up");
  res.send("Hello");
});

app.post("/api/auth/login", require("./routes/api/auth").Login);
app.post("/api/auth/update", require("./routes/api/auth").Update);
app.post("/api/auth/logout", require("./routes/api/auth").Logout);
app.post("/api/auth/register", require("./routes/api/auth").CreateUser);
app.post("/api/auth/delete", require("./routes/api/auth").Delete);
app.post("/api/auth/delete/admin", require("./routes/api/auth").AdminDelete);
app.post(
  "/api/auth/super/admin",
  require("./routes/api/auth").AdminCreateSuper
);
app.post("/api/auth/users", require("./routes/api/auth").GetAllUsers);
// group calls
app.post("/api/groups/all", require("./routes/api/group").getAll);
app.get("/api/groups/id", require("./routes/api/group").getAllID);
app.post(
  "/api/groups/admin/list",
  require("./routes/api/group").getAdminGroupList
);
app.post("/api/groups/getbyid", require("./routes/api/group").getGroupByID);
app.post("/api/groups/assign", require("./routes/api/group").assignUserToGroup);
app.post("/api/groups/create", require("./routes/api/group").createNewGroup);
app.post("/api/groups/delete", require("./routes/api/group").deleteGroupByID);
app.post("/api/groups/leave", require("./routes/api/group").userLeaveGroup);
app.post("/api/groups/request", require("./routes/api/group").userRequestJoin);
app.post(
  "/api/groups/update/user",
  require("./routes/api/group").updateUserGroupRoles
);
app.post(
  "/api/groups/create/channel",
  require("./routes/api/group").createNewChannel
);
app.post(
  "/api/groups/delete/channel",
  require("./routes/api/group").deleteChannelByID
);
app.post(
  "/api/groups/details/channel",
  require("./routes/api/group").getChannelDetails
);
// just checking the server is running
app.post("/api/users/id", require("./routes/api/auth").GetByID);
