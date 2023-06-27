import app from "../../../src/app";
import request from "supertest";
import { describe, it, expect } from "vitest";

describe("API system route", () => {
  it("should return system status", async () => {
    const response = await request(app).get("/api/v1/status");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ONLINE");
  });
});
