const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const names = [
    "ShadowPulse",
    "NeonVortex",
    "FrostByte",
    "NovaPhantom",
    "EclipseRush",
    "CyberRogue",
    "LunarVenom",
    "ZeroGravityX",
    "MysticDrift",
    "ArcticRebel",
    "PixelStorm",
    "NightSpectre",
    "CosmicBlaze",
    "SilentChaos",
    "ThunderNova",
    "VelvetGhost",
    "CrimsonOrbit",
    "DarkVelocity",
    "QuantumWolf",
    "VoidHunter"
];

const usedNames = [];

function getAvailableName() {
    const availableNames = names.filter(name => !usedNames.includes(name));
    
    if (availableNames.length === 0) {
        let counter = 1;
        let newName;
        do {
            newName = `User${counter}`;
            counter++;
        } while (usedNames.includes(newName));
        return newName;
    }
    
    const randomIndex = Math.floor(Math.random() * availableNames.length);
    return availableNames[randomIndex];
}

app.use(express.static("public"));

wss.on("connection", (ws) => {
    let name = getAvailableName();
    usedNames.push(name);
    
    console.log(`Jauns lietotājs pieslēdzās: ${name} (Aktīvie: ${usedNames.join(", ")})`);
    ws.send(JSON.stringify({ type: 'name', name: name }));

    ws.on("message", (message) => {
        const text = message.toString();
        try {
            const data = JSON.parse(text);
            data.username = name;
            const broadcastMessage = JSON.stringify(data);
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(broadcastMessage);
                }
            });
        } catch (e) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(`${name}: ${text}`);
                }
            });
        }
    });

    ws.on("close", () => {
        console.log(`Lietotājs atvienojās: ${name}`);
        
        const index = usedNames.indexOf(name);
        if (index !== -1) {
            usedNames.splice(index, 1);
            console.log(`Vārds "${name}" ir brīvs. Aktīvie: ${usedNames.join(", ")}`);
        }
    });
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Serveris darbojas: http://localhost:${PORT}`);
});