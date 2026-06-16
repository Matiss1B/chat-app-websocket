const crypto = require("crypto");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const names = [
    "ShadowPulse","NeonVortex","FrostByte","NovaPhantom",
    "EclipseRush","CyberRogue","LunarVenom","ZeroGravityX",
    "MysticDrift","ArcticRebel","PixelStorm","NightSpectre",
    "CosmicBlaze","SilentChaos","ThunderNova","VelvetGhost",
    "CrimsonOrbit","DarkVelocity","QuantumWolf","VoidHunter"
];

const usedNames = [];
const roomTokens = Array.from({ length: 5 }, () => crypto.randomUUID());



function getAvailableName() {
    const available = names.filter(name => !usedNames.includes(name));

    if (available.length === 0) {
        let counter = 1;
        let name;

        do {
            name = `User${counter++}`;
        } while (usedNames.includes(name));

        return name;
    }

    return available[Math.floor(Math.random() * available.length)];
}

app.use(express.static("public"));

io.on("connection", (socket) => {

    const username = getAvailableName();
    usedNames.push(username);

    console.log(`${username} pieslēdzās`);
    socket.emit('rooms', roomTokens);

    socket.emit("name", username);

    socket.on("message", (data) => {
    if (!socket.roomToken) return;
        io.to(socket.roomToken).emit("message", {
            username,
            text: data.text
        });
    }); 

   socket.on("join", (token) => {
        if (socket.roomToken) {
            socket.leave(socket.roomToken);
        }

        socket.join(token);
        socket.roomToken = token;
    });

    socket.on("disconnect", () => {

        const index = usedNames.indexOf(username);

        if (index !== -1) {
            usedNames.splice(index, 1);
        }

        console.log(`${username} atvienojās`);
    });

});

server.listen(3000, () => {
    console.log("http://localhost:3000");
});