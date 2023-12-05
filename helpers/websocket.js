const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let notifications = [];

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
              const haveDataAndNotIsUser =
                haveData && notification.username !== socket.data.username;

              const haveDataAndIsUser =
                haveData && notification.username == socket.data.username;

              if (haveDataAndIsUser && !notification.socketId) {
                notification.socketId = socket.id;
              }

              if (haveDataAndNotIsUser || !haveData) {
                socket.send({
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
      let notSended = [];

      io.sockets.sockets.forEach((socket) => {
        const hasSocketIdOrNot =
          !notification.socketId ||
          (notification.socketId && notification.socketId != socket.id);

        if (
          !notification.usersListened.includes(socket.id) &&
          hasSocketIdOrNot
        ) {
          notSended.push(socket);
        }
      });

      if (notSended.length > 0) {
        let newArray = notSended.filter((socket) => {
          return (
            Object.keys(socket.data).length === 0 ||
            socket.data.username !== notification.username
          );
        });

        notSended = newArray;
      }

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
