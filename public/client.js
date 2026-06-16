const socket = io();

let myName = "";
let roomToken = null;

socket.on("connect", () => {
    console.log("Savienots");
    
});

socket.on("name", (name) => {
    myName = name;
    console.log("Mans vārds:", myName);
});

socket.on("rooms", (roomTokens) => {
    const list = document.getElementById("rooms-list");
    list.innerHTML = '';
    
    roomTokens.forEach((token, index) => {
        const roomNumber = index + 1;
        const roomDiv = document.createElement('div');
        roomDiv.className = 'room';
        roomDiv.dataset.token = token;
        roomDiv.textContent = `Room ${roomNumber}`;
        roomDiv.onclick = () => joinRoom(token);
        list.appendChild(roomDiv);
    });
});

function joinRoom(token) {
    console.log('Pievienojos istabai:', token);
    roomToken = token;
    socket.emit("join", token);
    document.querySelectorAll(".room").forEach(room => {
        room.classList.remove("active");
    });

    const activeRoom = document.querySelector(`.room[data-token="${token}"]`);
    if (activeRoom) {
        activeRoom.classList.add("active");
    }
    document.getElementById("message-block").innerHTML = "";
}

socket.on("message", (data) => {

    const isMyMessage = data.username === myName;

    const messageClass = isMyMessage
        ? "message my-message"
        : "message other-message";

    const messageBlock = document.getElementById("message-block");

    messageBlock.innerHTML += `
        <div class="${messageClass}">
            <h1>${data.username}</h1>
            <p>${data.text}</p>
        </div>
    `;

    messageBlock.scrollTop = messageBlock.scrollHeight;
});

function sendMessage(text) {
    if (!text.trim()) return;

    if (!roomToken) {
        alert("Vispirms izvēlies room!");
        return;
    }

    socket.emit("message", {
        text,
        token: roomToken
    });

    document.getElementById("messageInput").value = "";
}
document
    .getElementById("messageInput")
    .addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            sendMessage(e.target.value);
        }
    });