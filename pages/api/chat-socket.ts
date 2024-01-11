import { Server } from 'socket.io'

const SocketHandler = (req: any, res: any) => {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server, { path: '/socket.io' })
        res.socket.server.io = io

        io.on('connect', socket => {
            console.log('connected socket')
            socket.on('join-room', room => {
                socket.join(room);
                console.log("joined room",room);
            });
            // socket.on('chatbot-message', msg => {
            //     console.log("chatbot-message",msg)
            //     socket.emit('receive-chatbot-message',msg)
            // })
            socket.on('chatbot-message', ({ message, sessionId }) => {
                console.log('chatbot-message', message);
                io.to(sessionId).emit('receive-chatbot-message', message);
            });

            // socket.on('slack-message', msg => {
            //     console.log("message",msg)
            //     socket.emit('received-slack-message',msg)
            // })
            socket.on('slack-message', ({ message, sessionId }) => {
                console.log('message', message);
                io.to(sessionId).emit('received-slack-message', message);
            });
        })
    }
    res.end()
}

export default SocketHandler