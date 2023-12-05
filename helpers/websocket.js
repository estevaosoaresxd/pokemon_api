const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const { validateToken } = require("../services/auth_services");

const notifications = [];

const startSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(function (socket, next) {
    if (
      socket.handshake.query &&
      socket.handshake.query.token &&
      socket.handshake.query.token != null &&
      socket.handshake.query.token != "null"
    ) {
      const token = socket.handshake.query.token;

      jwt.verify(token, "#Abcasdfqwr", (err, payload) => {
        if (err) {
          return;
        }

        socket.data = payload.user;
        next();
      });
    }

    next();
  }).on("connection", (socket) => {
    console.log(socket.data);
    socket.on("disconnect", () => {});
  });
};

const sendNotificationToAll = (ownerId) => {
  totalConnect.forEach((socket) => {
    if (socket.id != ownerId) {
      socket.emit("notification");
    }
  });
};

const addNotificationInList = (notification) => {
  notifications.push(notification);
};

module.exports = {
  startSocket,
  sendNotificationToAll,
  addNotificationInList,
};
