import SocketController from "../controllers/socketController.js";

export function socketHandlers(socket, connectedUsers, io) {

    const userId = socket.handshake.query.userId;
    if (!userId) {
        console.log("Usuario no identificado, desconectando...");
        socket.disconnect();
        return;
    }

    connectedUsers.set(userId, socket.id);

    socket.on('get_allRequest', () => SocketController.getAllRequests(userId, socket));
    socket.on('reject-request', ({ request_ID }) => SocketController.rejectRequest(userId, socket, request_ID));
    socket.on('delete-contact', ({ contact_ID }) => SocketController.deleteContact(contact_ID, socket, connectedUsers, io));
    socket.on('acept-request', ({ request_ID }) => SocketController.acceptRequest(userId, socket, request_ID, connectedUsers, io));
    socket.on('getAllContacts', () => SocketController.getAllContacts(userId, socket));
    socket.on('sendRequest', ({ email }) => SocketController.sendRequest(userId, socket, email, connectedUsers, io));
    socket.on('send-message', ({ message, contactId }) => SocketController.addMessage(io, connectedUsers, message, userId, socket, contactId));
    socket.on('getAllMessages', ({ contactId }) => SocketController.getAllMessages(contactId, socket));
    socket.on("disconnect", () => SocketController.handleUserDisconnect(userId, connectedUsers));
}