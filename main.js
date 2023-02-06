const express = require('express');

const server = express()
 .use((req, res) => res.sendFile('/index.html', { root: __dirname }))
 .listen(3000, () => console.log(`Listening on ${3000}`));

const { Server } = require('ws');

const sockserver = new Server({ port: 443 });
const connections = new Set();

let serverItemStatus = ['Off', 'Off', 'Off', 'Off'];

sockserver.on('connection', (ws) => {
    console.log('New client connected!');
    connections.add(ws)
    connections.forEach((client) => {
        const data = {'type': 'status', 'status': serverItemStatus};
        client.send(JSON.stringify(data));
    })


    ws.on('message', (data) => {
        const message = JSON.parse(data);
        serverItemStatus = message.status;
        // console.log(serverItemStatus);
        // console.log(message.status);
        connections.forEach((client) => {
            client.send(JSON.stringify(message));
        })
    });

    ws.on('close', () => {
        connections.delete(ws);
        console.log('Client has disconnected!');
    });
});

// setInterval(() => {
//     sockserver.clients.forEach((client) => {
//         const data = JSON.stringify({'type': 'status', 'time': new Date().toTimeString()});
//         client.send(data);
//     });
// }, 1000);

//  setInterval(() => {
//     sockserver.clients.forEach((client) => {
//         const messages = ['Hello', 'What do you ponder?', 'Thank you for your time', 'Be Mindful', 'Thank You'];
//         const random = Math.floor(Math.random() * messages.length);
//         let position = {x: Math.floor(Math.random() * 200), y: Math.floor(Math.random() * 150)}
//         const data = JSON.stringify({'type': 'message', 'message': messages[random], 'position': position});
//         client.send(data);
//     });
//  }, 8000);