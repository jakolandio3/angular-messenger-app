const DATABASE = require("../../config/index");
const fs = require("fs");
const Message = require("../../models/message");
module.exports = {
  connect: async function (io, PORT) {
    const admin = io.of((nsp, query, next) => {
      // created a dynamic namespace
      next(null, true);
    });
    admin.use(async (socket, next) => {
      // console.log(socket.handshake.query);
      // console.log(socket.handshake.auth);
      const userID = socket.handshake.auth.userID;
      try {
        const usersData = fs.readFileSync(DATABASE.USERS_DB);
        const userArr = await JSON.parse(usersData);
        let i = userArr.findIndex((user) => user.UUID === +userID);
        if (i === -1) {
          next(new Error("Authentication error"));
        }
        const usersName = userArr[i].username;
        console.log(usersName);
        socket.userName = usersName;
        socket.UUID = socket.handshake.auth.userID;
        next();
      } catch (error) {
        next(new Error("Authentication error"));
      }
    });
    // write or connect middleware function here!
    // remember to check authorization/authentication
    // remember to write them to a message bank in fs.Database to track messages
    // remember to allow room switching and leaving chat etc.
    admin.use(async (socket, next) => {
      console.log("reached Here Second Middleware Handler");
      // console.log(socket.handshake.query);
      // console.log(socket.handshake.auth.userID);
      const { group, room } = socket.handshake.query;
      const userID = socket.handshake.auth.userID;
      let isAdmin = false;
      try {
        const groupsData = fs.readFileSync(DATABASE.GROUPS_DB);
        const groupsArr = await JSON.parse(groupsData);
        let i = groupsArr.findIndex((groups) => groups.UUID === +group);
        if (i === -1) {
          console.log("Error on finding Group");
          next(new Error("Group not found error"));
        }
        if (!groupsArr[i].channels.includes(+room)) {
          console.log("Error on finding Room in Group");
          next(new Error("Channel not found on Group!"));
        }
        if (!groupsArr[i].users.includes(userID)) {
          console.log(groupsArr[i].users);
          console.log(userID);
          console.log("Error on finding user in Group");
          next(new Error("Authentication Error: User not in Group"));
        }
        if (groupsArr[i].admins.includes(userID)) {
          isAdmin = true;
          console.log("made an admin");
        }
        const channelData = fs.readFileSync(DATABASE.CHANNELS_DB);
        const channelArr = await JSON.parse(channelData);
        let j = channelArr.findIndex((channel) => channel.UUID === +room);
        if (j === -1) {
          console.log("Error on finding channel in DB");
          next(new Error("Channel not found on server error"));
        }
        if (!channelArr[j].groupUUID === +group) {
          console.log("Error on linking group to Channel");
          next(new Error("This Channel Does not belong to the Group"));
        }
        const prevMessages = channelArr[j].messages;
        let messages;
        if (prevMessages.length === 0) {
          messages = [];
        } else if (prevMessages.length < 5) {
          messages = prevMessages;
        } else {
          messages = prevMessages.slice(Math.max(prevMessages.length - 5, 0));
        }
        console.log(messages);
        socket.messages = messages;
        socket.isAdmin = isAdmin;
        socket.group = groupsArr[i].UUID;
        socket.groupName = groupsArr[i].name;
        socket.room = channelArr[j].UUID;
        socket.roomName = channelArr[j].name;
        next();
      } catch (error) {
        next(new Error("Server Error Occurred"));
      }
    });
    admin.on("connection", async (socket) => {
      const currentGroup = socket.nsp;

      const {
        userName,
        isAdmin,
        group,
        groupName,
        room,
        roomName,
        UUID,
        messages,
      } = socket;
      socket.join(room);
      console.log(socket.rooms);
      const ids = await currentGroup.in(room).allSockets();
      const numConnected = Array.from(ids).length;
      console.log(numConnected);
      console.log(ids);
      console.log(userName, "Whats this!!!");
      // call emit events with current group to only send to this Namespace
      // call emit events with admin to send to all Namespaces
      // call emit events with socket to only send to the one socket

      socket.emit("message", {
        message: `Welcome to group ${currentGroup.name} in room ${roomName}`,
        userID: "SYSTEM",
      });
      // console.log(socket);
      // console.log(`Namespace for Socket is: ${socket.nsp.name}}`);
      // console.log(`user connected to ${socket.id}`);
      currentGroup.to(room).emit("message", {
        message: `A new user: ${userName} has joined the Chat! Total users: ${numConnected}`,
        userID: "SYSTEM",
      });

      socket.emit("connected", {
        message: "Hello You are connected and authorized",
        data: {
          isAdmin,
          groupUUID: group,
          groupName,
          roomUUID: room,
          roomName,
          messages,
          inRoom: numConnected,
        },
      });

      socket.on("message", async (message) => {
        console.log("New messages");
        const messagesData = fs.readFileSync(DATABASE.MESSAGES_DB);
        const messagesArr = await JSON.parse(messagesData);
        let messagesLength = messagesArr.length;
        const curMessage = new Message(
          messagesLength + 1,
          +room,
          +group,
          UUID,
          userName,
          message
        );
        messagesArr.push(curMessage);
        const channelData = fs.readFileSync(DATABASE.CHANNELS_DB);
        const channelArr = await JSON.parse(channelData);
        let i = channelArr.findIndex((ch) => ch.UUID === +room);
        if (i === -1) {
          console.log("oh no channel not found");
          throw new Error("NOOOOO");
        }
        channelArr[i].messages.push({
          UUID: messagesLength + 1,
          createdBy: userName,
          message: message,
        });
        fs.writeFileSync(DATABASE.MESSAGES_DB, JSON.stringify(messagesArr));
        fs.writeFileSync(DATABASE.CHANNELS_DB, JSON.stringify(channelArr));

        currentGroup.to(room).emit("message", {
          message,
          userID: userName,
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
