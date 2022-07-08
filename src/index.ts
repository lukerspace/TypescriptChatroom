// server
import devServer from "./server/dev";
import prodServer from "./server/prod";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import { name } from "@/utils";
import { UserService } from "@/service/UserService";
import moment from "moment";

const port = 3000;
const app = express();
// 透過http包去create個可以符合websocket.io的監聽server並把app放進去
const server = http.createServer(app);
const io = new Server(server);
const userService = new UserService();

// 2. 監測連接
// 如果建立連結發訊息到join頻道 可以發很多訊息 這邊是welcome
// 傳送客戶的獨一id給客戶端進行主格與受格的聊天畫面介面呈現
io.on("connection", (socket) => {
  socket.emit("userID", socket.id);

  socket.on(
    "join",
    ({ userName, roomName }: { userName: string; roomName: string }) => {
      const userData = userService.userDataInfo(socket.id, userName, roomName);

      socket.join(userData.roomName);
      userService.addUser(userData);
      // io.emit("join", `${userName}加入${roomName}聊天室`);

      socket.broadcast
        .to(userData.roomName)
        .emit("join", `${userName}加入${roomName}聊天室`);
    }
  );
  // lisening chat channel from client-server
  socket.on("client send", (msg) => {
    // Setting time UTC as we recv the message
    const time = moment.utc();
    console.log("server recv: ", msg);
    const userData = userService.getUser(socket.id);
    if (userData) {
      io.to(userData.roomName).emit("chat", { msg, userData, time });
    }
    // send the msg back
    // io.emit("chat", msg);
  });

  socket.on("disconnect", () => {
    const userData = userService.getUser(socket.id);
    const userName = userData?.userName;
    if (userName) {
      socket.broadcast
        .to(userData.roomName)
        .emit("leave", `${userData.userName}離開${userData.roomName}聊天室`);
    }
  });
});

// 執行npm run dev本地開發 or 執行npm run start部署後啟動線上伺服器
if (process.env.NODE_ENV === "development") {
  devServer(app);
} else {
  prodServer(app);
}

console.log("server side", name);

server.listen(port, () => {
  console.log(`The application is running on port ${port}.`);
});
