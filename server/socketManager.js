const io = require("./server.js").io;
const { userFromJWT } = require("./app/filters/jwt.user");
const {
  signalNotificationForUser
} = require("./app/services/dotnet-interop.service.js");

let userIdToSockets = {};
module.exports = function(socket) {
  console.log("Socket Id:" + socket.id);

  function getJwtFromSocket(socket) {
    const headers = socket.request.headers;
    const cookie = headers.cookie;
    if (!cookie) {
      return null;
    }
    const match = /(^| )authentication=(.+?)(;|$)/.exec(cookie);
    if (!match) {
      return null;
    }
    return userFromJWT(match[2]);
  }

  const user = getJwtFromSocket(socket);
  if (!user) {
    return;
  }

  socket.user = user;
  addUser(socket);
  io.emit("USER_CONNECTED", userIdToSockets);
  console.log("Connected Users: ", userIdToSockets);

  socket.on("TYPING", function(data) {
    for (let i = 0; i < data.recipientSocketId.length; i++) {
      io.to(`${data.recipientSocketId[i]}`).emit("USER_IS_TYPING", data);
    }
  });

  socket.on("SEND_MESSAGE", function(data) {
    if (data.recipientSocketId) {
      for (let i = 0; i < data.recipientSocketId.length; i++) {
        io.to(`${data.recipientSocketId[i]}`).emit("RECEIVE_MESSAGE", data);
      }
    } else {
      signalNotificationForUser(data.recipientUserId);
    }
    for (
      let i = 0;
      i < userIdToSockets[data.senderUserId]["socketId"].length;
      i++
    ) {
      io.to(`${userIdToSockets[data.senderUserId]["socketId"][i]}`).emit(
        "RECEIVE_MESSAGE",
        data
      );
    }
    //sendNotif(socket.user.id);
  });

  socket.on("disconnect", () => {
    if ("user" in socket) {
      removeUser(socket);

      io.emit("USER_DISCONNECTED", userIdToSockets);
      console.log("Current Users After Disconnect: ", userIdToSockets);
    }
  });

  socket.on("LOGOUT", () => {
    if ("user" in socket) {
      userIdToSockets = removeUser(userIdToSockets, socket.user);

      io.emit("USER_DISCONNECTED", userIdToSockets);
      console.log("Current Users After Disconnect: ", userIdToSockets);
    }
  });
};

function addUser(socket) {
  const thisUser = userIdToSockets[socket.user.id];
  if (thisUser) {
    thisUser["socketId"].push(socket.id);
  } else {
    userIdToSockets[socket.user.id] = {
      socketId: [socket.id],
      name: socket.user.name
    };
  }
}

function removeUser(socket) {
  const thisUser = userIdToSockets[socket.user.id];
  thisUser["socketId"].splice(thisUser["socketId"].indexOf(socket.id), 1);
  if (thisUser["socketId"].length == 0) {
    delete userIdToSockets[socket.user.id];
  }
}

function sendNotif(userId) {
  const socketIds = userIdToSockets[userId]["socketId"];
  for (let i = 0; i < socketIds.length; i++) {
    io.to(`${socketIds[i]}`).emit(
      "Notification",
      "Here is the Notification!!!"
    );
  }
}
