const socket = io();

let myName = "";

socket.on("connect", () => {
    console.log("Savienots");
});

socket.on("name", (name) => {
    myName = name;
    console.log("Mans vārds:", myName);
});

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

    socket.emit("message", {
        text
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