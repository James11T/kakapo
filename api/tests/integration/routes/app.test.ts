import app from "../../../src/app";
import request from "supertest";
import { describe, it, expect } from "vitest";

describe("general API requests", () => {
  it("should return 404 for unknown route", async () => {
    const response = await request(app).get("/i-do-not-exist");

    expect(response.status).toBe(404);
  });
});
