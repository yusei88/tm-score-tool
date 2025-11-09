import { Server as HttpServer } from "http";
import { Server as IOServer, Socket } from "socket.io";

let io: IOServer | null = null;

export function attachSocket(server: HttpServer): IOServer {
    if (io) return io;

    io = new IOServer(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket: Socket) => {
        // Basic connection logging and placeholder handlers
        // eslint-disable-next-line no-console
        console.log(`socket connected: ${socket.id}`);

        socket.on("join_session", (payload: { sessionId: string; playerId?: string }) => {
            const { sessionId } = payload || {};
            if (sessionId) {
                socket.join(sessionId);
            }
        });

        socket.on("disconnect", () => {
            // eslint-disable-next-line no-console
            console.log(`socket disconnected: ${socket.id}`);
        });
    });

    return io;
}

export function getIo(): IOServer | null {
    return io;
}
