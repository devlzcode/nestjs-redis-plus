import type {
  ClassProvider,
  FactoryProvider,
  InjectionToken,
  ValueProvider,
} from "@nestjs/common";
import { Logger } from "@nestjs/common";
import Redis from "ioredis";

import type { RedisModuleOptions } from "./types/redis-module-options.types";
import {
  REDIS_NAME_TOKEN,
  REDIS_MODULE_OPTIONS_TOKEN,
} from "./redis.constants";
import { parseRedisUrl } from "./common/redis.utils";
import { RedisService } from "./redis.service";

export const createRedisNameProvider = (
  token: InjectionToken,
): ValueProvider => ({
  provide: REDIS_NAME_TOKEN,
  useValue: token,
});

export const createRedisProvider = (
  token: InjectionToken,
): FactoryProvider => ({
  provide: token,
  useFactory: async (options: RedisModuleOptions) => {
    const logger = new Logger(`RedisModule:${String(token)}`);
    if (options.url) options = { ...parseRedisUrl(options.url), ...options };
    const miniUrl = `${options.tls ? "rediss" : "redis"}://${options.host}:${
      options.port
    }`;
    const client = new Redis(options);
    client.once("ready", () =>
      logger.log(`Established connection to ${miniUrl}`),
    );
    client.on("error", (err) =>
      logger.error(`An error occured: ${err.message}`),
    );
    logger.log(`Establishing connection to ${miniUrl} ...`);
    if (client.status !== "connecting") await client.connect();
    return client;
  },
  inject: [REDIS_MODULE_OPTIONS_TOKEN],
});

export const createRedisServiceProvider = (
  token: InjectionToken,
): ClassProvider => ({
  provide: token,
  useClass: RedisService,
});
