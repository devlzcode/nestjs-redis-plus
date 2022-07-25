import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { describe, it, beforeEach, expect } from "vitest";
import { AppModule } from "../src/app.module";

describe("RedisModule", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("Should instantiate a default connection", () => {
    expect(app.get("DefaultRedis")).toBeDefined();
  });

  it("Should properly instantiate a named connection", () => {
    expect(app.get("DogsRedis")).toBeDefined();
  });
});
