import { Test } from "@nestjs/testing";
import { describe, it, expect } from "vitest";

import { getRedisToken, getServiceToken } from "../../lib";
import { getAdapterToken, getEmitterToken } from "../../lib/socket-io";
import { AppModule } from "../src/app.module";

describe("App", async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  it("Should create for default", () => {
    const redis = app.get(getRedisToken());
    expect(redis).toBeDefined();
    const redisService = app.get(getServiceToken());
    expect(redisService).toBeDefined();
    expect(redisService.client === redis).toBeTruthy();
    expect(app.get(getAdapterToken())).toBeDefined();
  });

  it("Should create for named", () => {
    expect(app.get(getRedisToken("Dogs"))).toBeDefined();
    expect(app.get(getRedisToken("Cats"))).toBeDefined();
    expect(app.get(getServiceToken("Dogs"))).toBeDefined();
    expect(app.get(getServiceToken("Cats"))).toBeDefined();
    expect(app.get(getEmitterToken("Dogs"))).toBeDefined();
    expect(app.get(getEmitterToken("Cats"))).toBeDefined();
  });
});
