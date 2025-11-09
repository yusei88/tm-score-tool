import request from "supertest";
import app from "../../src/index";

describe("healthz", () => {
    it("returns status ok", async () => {
        const res = await request(app).get("/healthz");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "ok" });
    });
});
