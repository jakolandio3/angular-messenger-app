module.exports = {
  connect: function (io, PORT) {
    const admin = io.of("/admin");
    admin.use((socket, next) => {
      console.log(socket.handshake.auth);
      // write or connect middleware function here!
      // remember to check authorization/authentication
      // remember to write them to a message bank in fs.Database to track messages
      // remember to allow room switching and leaving chat etc.
      next();
    });
    admin.on("connection", (socket) => {
      console.log(`user connected to ${socket.id}`);
      admin.emit("message", { message: "testing connection to observables" });
      setTimeout(() => {
        admin.emit("connected", {
          message: "Hello You are connected and authorized",
        });
      }, 10000);

      socket.on("message", (message) => {
        console.log("before");
        admin.emit("message", {
          message,
          userID: socket.handshake.auth.userID,
        });
        console.log(message);
      });

      socket.on("end", () => {
        socket.emit("end", { message: "Socket is disconnecting" });
        socket.disconnect(true);
      });
    });
  },
};
