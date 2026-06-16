const ws = new WebSocket("ws://localhost:3000");
let myName = ''; 

ws.onopen = () => {
  console.log("Savienojums izveidots");
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    if (data.type === 'name') {
        myName = data.name;
        console.log('Mans vārds:', myName);
    }
    
    if (data.type === 'message') {
        console.log(data);
        
        const isMyMessage = (data.username === myName);
        const messageClass = isMyMessage ? 'message my-message' : 'message other-message';
        
        const messageBlock = document.getElementById('message-block');
        messageBlock.innerHTML += `
            <div class="${messageClass}">
                <h1>${data.username}</h1>
                <p>${data.text}</p>
            </div>
        `;
        
        messageBlock.scrollTop = messageBlock.scrollHeight;
    }
};

function sendMessage(text) {
    if (text.trim() === '') return;
    ws.send(JSON.stringify({ 
        type: 'message', 
        text: text 
    }));
    document.getElementById('messageInput').value = '';
}