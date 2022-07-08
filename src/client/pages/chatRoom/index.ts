// client
import "./index.css";
import { name } from "@/utils";
import { io } from "socket.io-client";
import { UserService } from "@/service/UserService";
import { string } from "joi";
import { UserData } from "@/service/UserService";
import { Socket } from "socket.io";
console.log("client side chatroom page", name);

// (I) client 端頁面
// 導入模塊就已建立連結 可透過server去發訊息 - 使用者登入後 - 搜索url query string 取得使用者資訊
const url = new URL(location.href);
const userName = url.searchParams.get("user_name");
const roomName = url.searchParams.get("room_name");
const textInput = document.getElementById("textInput") as HTMLInputElement;
const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
const chatBoard = document.getElementById("chatBoard") as HTMLDivElement;
const headerRoomName = document.getElementById(
  "headerRoomName"
) as HTMLParagraphElement;
const backBtn = document.getElementById("backBtn") as HTMLButtonElement;
let userID = "";
type UserMessage = { userData: UserData; msg: string; time: number };
// (II)顯示畫面render 的處理函數  Function
function msgHandler(data: UserMessage) {
  const date = new Date(data.time);
  const time = `${date.getHours()}:${date.getMinutes()}`;
  console.log(data.time);

  const divBox = document.createElement("div");
  divBox.classList.add("flex", "mb-4", "items-end");
  if (data.userData.id === userID) {
    divBox.classList.add("justify-end");
    divBox.innerHTML = ` 
    <p class="text-xs text-gray-700 mr-4">${time}</p>
    <div>
      <p class="text-xs text-white mb-1 text-right">${data.userData.userName}</p>
      <p class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full">
       ${data.msg}
      </p>
    </div>
    `;
  } else {
    divBox.classList.add("justify-start");
    divBox.innerHTML = `
    <div class="flex justify-start mb-4 items-end">
          <div>
            <p class="text-xs text-gray-700 mb-1">${data.userData.userName}</p>
            <p
              class="mx-w-[50%] break-all bg-gray-800 px-4 py-2 rounded-tr-full rounded-br-full rounded-tl-full text-white"
            >
              ${data.msg}
            </p>
          </div>

          <p class="text-xs text-gray-700 ml-4">${time}</p>
        </div>`;
  }

  chatBoard.appendChild(divBox);
  textInput.value = "";
  chatBoard.scrollTop = chatBoard.scrollHeight;
}
function roomMsgHandler(msg: string) {
  // <div class="flex justify-center mb-4 items-center">
  //   <p class="text-gray-700 text-sm">bruce joined the room</p>
  // </div>-->
  const divBox = document.createElement("div");
  divBox.classList.add("flex", "justify-center", "mb-4", "items-center");
  divBox.innerHTML = `<p class="text-gray-700 text-sm">${msg}</p>`;
  chatBoard.append(divBox);
  chatBoard.scrollTop = chatBoard.scrollHeight;
}

// (III) 連線
// 跳轉處理
headerRoomName.innerText = roomName || "-";
if (!userName || !roomName) {
  location.href = "main/main.html";
}
// 透過建立連線 ==>到node sever  ( 透過io 的方法，讓我們確認連線成功 ) 執行io函數
// 建立連結物件
const clientIo = io();
// 接收前端傳過來的獨一id 並且釐清是不是自己 (主格受格)
clientIo.on("userID", (id) => {
  userID = id;
});
// 只要不要被跳轉的話顯示使用者名稱出來
clientIo.emit("join", { userName, roomName });
// `${userName}加入了聊天`
// 使用者發送訊息 & 監聽是否連線server
clientIo.on("join", (msg) => {
  console.log("join message - ", msg);
  roomMsgHandler(msg);
});
// 監聽傳送的訊息(listening chat chennel)
clientIo.on("chat", (data: UserMessage) => {
  console.log("client message: ", data);
  msgHandler(data);
});
clientIo.on("leave", (msg) => {
  roomMsgHandler(msg);
});

// (IV)事件處理函數
// submitbtn - client 發送訊息處理
submitBtn.addEventListener("click", () => {
  const textValue = textInput.value;
  // 將client 輸入的資訊發送SERVER後端(create chat channel)
  clientIo.emit("client send", textValue);
});
// backbtn
backBtn.addEventListener("click", () => {
  location.href = "/main/main.html";
});
