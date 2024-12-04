const DATABASE = require("../../config/index");
const fs = require("fs");
module.exports = {
  connect: async function (io, PORT) {
    const admin = io.of((nsp, query, next) => {
      // created a dynamic namespace
      next(null, true);
    });
    admin.use(async (socket, next) => {
      console.log(socket.handshake.auth);
      const userID = socket.handshake.auth.userID;
      try {
        const data = fs.readFileSync(DATABASE.USERS_DB);
        const userArr = await JSON.parse(data);
        let i = userArr.findIndex((user) => user.UUID === +userID);
        if (i === -1) {
          next(new Error("Authentication error"));
        }
        const usersName = userArr[i].username;
        console.log(usersName);
        socket.userName = usersName;
        next();
      } catch (error) {
        next(new Error("Authentication error"));
      }
    });
    // write or connect middleware function here!
    // remember to check authorization/authentication
    // remember to write them to a message bank in fs.Database to track messages
    // remember to allow room switching and leaving chat etc.

    admin.on("connection", async (socket) => {
      const currentGroup = socket.nsp;
      const ids = await currentGroup.allSockets();
      console.log(ids);
      const numConnected = Array.from(ids).length;
      console.log(numConnected);
      const {
        query: { room, group },
        auth: { userID },
      } = socket.handshake;
      const userName = socket.userName;
      console.log(userName, "Whats this!!!");
      // call emit events with current group to only send to this Namespace
      // call emit events with admin to send to all Namespaces
      // call emit events with socket to only send to the one socket

      currentGroup.emit("message", {
        message: `Welcome to group ${currentGroup.name}`,
      });
      // console.log(socket);
      // console.log(`Namespace for Socket is: ${socket.nsp.name}}`);
      // console.log(`user connected to ${socket.id}`);
      currentGroup.emit("message", {
        message: `A new user: ${userName} has joined the Chat! Total users: ${numConnected}`,
        userID,
      });
      setTimeout(() => {
        socket.emit("connected", {
          message: "Hello You are connected and authorized",
        });
      }, 10000);

      socket.on("message", (message) => {
        console.log("before");
        currentGroup.emit("message", {
          message,
          userID,
        });
        console.log(message);
      });

      socket.on("end", () => {
        currentGroup.emit("end", { message: "Socket is disconnecting" });
        socket.disconnect(true);
      });
    });
  },
};
