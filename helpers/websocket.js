const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

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
    const sendNotificationToAll = () => {
      io.sockets.sockets.forEach((socket) => {
        const haveData = Object.keys(socket.data).length > 0;

        if (notifications.length > 0) {
          notifications.forEach((notification, i) => {
            const includes = notification.usersListened.includes(socket.id);

            if (!includes) {
              if (
                (haveData && notification.username !== socket.data.username) ||
                !haveData
              ) {
                socket.emit("notification", {
                  message: notification.message,
                  date: notification.date.toISOString(),
                });

                notification.usersListened.push(socket.id);
              }
            }

            verifyAllUsersSended(notification, i);
          });
        }
      });
    };

    const verifyAllUsersSended = (notification, indexNotification) => {
      const notSended = [];

      io.sockets.sockets.forEach((socket) => {
        if (!notification.usersListened.includes(socket.id)) {
          notSended.push(socket);
        }
      });

      if (notSended.length == 0) {
        notifications.splice(indexNotification, 1);
      }
    };

    const verifyPerPeriod = setInterval(function verify() {
      sendNotificationToAll();
    }, 5000);

    socket.on("disconnect", () => {
      clearInterval(verifyPerPeriod);
    });
  });
};

const addNotificationInList = (notification) => {
  notifications.push(notification);
};

module.exports = {
  startSocket,
  addNotificationInList,
};
