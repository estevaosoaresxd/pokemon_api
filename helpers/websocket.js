const { Server } = require("socket.io");

const startSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

module.exports = {
  startSocket,
};
