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

            socket.on('chatbot-message', ({ message, sessionId }) => {
                console.log('chatbot- message---', message);
                console.log('session Id in chatbot',sessionId);
                io.to(sessionId).emit('received-chatbot-message', {message, sessionId});
            });

            socket.on('slack-message', ({ message, sessionId }) => {
                console.log('message', message);
                io.to(sessionId).emit('received-slack-message', { message, sessionId });
            });

            socket.on('close-socket', ({ sessionId }) => {
                console.log('close socket', sessionId);
                io.to(sessionId).emit('close-socket-connection', { sessionId });
            });
        })
    }
    res.end()
}

export default SocketHandler