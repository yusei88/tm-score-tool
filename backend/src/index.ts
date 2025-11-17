import express from "express";
import http from "http";

const app = express();
app.use(express.json());

app.get("/healthz", (_req, res) => {
    res.json({ status: "ok" });
});

const port = process.env.PORT || 3000;

// Create HTTP server but do not start listening when imported (tests import app)
const server = http.createServer(app);

if (require.main === module) {
    // Attach socket adapters lazily when running as the main module to avoid side-effects during tests
    // Importing here to avoid loading socket.io in unit tests unless running the server
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const { attachSocket } = require("./adapters/socket");
    attachSocket(server);

    server.listen(Number(port), () => {
        // eslint-disable-next-line no-console
        console.log(`Server listening on port ${port}`);
    });
}

export default app;
export { server };
