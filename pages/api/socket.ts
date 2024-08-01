import { Server as IOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import type { NextApiRequest } from 'next';

export default function handler(req: NextApiRequest, res: any) {
  if (!res?.socket?.server?.io) {
    const httpServer: HTTPServer = res?.socket?.server as any;
    const io = new IOServer(httpServer, {
      path: '/api/socket',
    });

    io.on('connection', (socket) => {
      console.log('Client connected');

      socket.on('joinRoom', (roomId: string) => {
        console.log(`Client joining room: ${roomId}`);
        socket.join(roomId);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
