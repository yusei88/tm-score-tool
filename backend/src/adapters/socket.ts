import { Server as HttpServer } from "http";
import { Server as IOServer, Socket } from "socket.io";

let io: IOServer | null = null;

export function attachSocket(server: HttpServer): IOServer {
    if (io) return io;

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    const isDev = process.env.NODE_ENV === "development";

    io = new IOServer(server, {
        cors: {
            // Allow test/no-origin and allow in-development. In production, only allow
            // origins listed in ALLOWED_ORIGINS (comma separated).
            origin: (origin, callback) => {
                // socket.io may call with undefined origin for non-browser clients (e.g. tests)
                if (!origin) return callback(null, true);
                if (isDev) return callback(null, true);
                if (allowedOrigins && allowedOrigins.includes(origin)) return callback(null, true);
                return callback(new Error("Origin not allowed"));
            },
            credentials: true,
        },
    });

    io.on("connection", (socket: Socket) => {
        // Basic connection logging and placeholder handlers
        // eslint-disable-next-line no-console
        console.log(`socket connected: ${socket.id}`);

        socket.on("join_session", (payload: { sessionId: string; playerId?: string }) => {
            const { sessionId } = payload || {};
            // Validate sessionId format (UUID) and avoid joining invalid rooms.
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (sessionId && uuidRegex.test(sessionId)) {
                // TODO: Verify session exists in DB before joining the room
                socket.join(sessionId);
            } else {
                socket.emit("error", { code: "INVALID_SESSION", message: "Invalid session ID" });
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
