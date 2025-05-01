// index.js
import http from "http";
import { Server } from "socket.io";
import app from './app.js';
import { socketHandlers } from './routes/socketRoutes.js';

const port = process.env.PORT ?? 3000;
const server = http.createServer(app);
const io = new Server(server,{
  cors: {
    origin: 'https://chat-xi-ten-65.vercel.app', // URL de tu frontend
    methods: ['GET', 'POST'],
    credentials: true,  // Permite que las cookies se envíen
  }
});

// Registro de usuarios conectados
const connectedUsers = new Map();

// control de las acciones de socket
io.on('connection', socket => socketHandlers(socket, connectedUsers, io));



// Imprimir las variables de entorno antes de iniciar el servidor
console.log('MYSQL_HOST:', process.env.MYSQL_HOST);
console.log('MYSQL_USER:', process.env.MYSQL_USER);
console.log('MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD);
console.log('MYSQL_DB_NAME:', process.env.MYSQL_DB_NAME);
console.log('MYSQL_PORT:', process.env.MYSQL_PORT);


server.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}/`);
});
