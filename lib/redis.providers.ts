import type { FactoryProvider, ValueProvider } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import IORedis from "ioredis";
import type { EmitterOptions } from "@socket.io/redis-emitter";
import { Emitter } from "@socket.io/redis-emitter";
import type { RedisAdapterOptions } from "@socket.io/redis-adapter";
import { createAdapter } from "@socket.io/redis-adapter";
import { getRedisClientName } from "./common/redis.utils";
import type { RedisModuleOptions } from "./types/redis-module-options.types";
import { MODULE_OPTIONS_TOKEN } from "./redis-core.module-definition";
import {
  REDIS_CLIENT_NAME_TOKEN,
  REDIS_ADAPTER_CONSTRUCTOR_TOKEN,
  REDIS_EMITTER_TOKEN,
} from "./redis.constants";

const logger = new Logger("RedisModule");

export const createRedisNameProvider = (name?: string): ValueProvider => ({
  provide: REDIS_CLIENT_NAME_TOKEN,
  useValue: getRedisClientName(name),
});

export const createRedisProvider = (name?: string): FactoryProvider => ({
  provide: getRedisClientName(name),
  useFactory: async (options: RedisModuleOptions) => {
    const client = new IORedis(options);
    if (client.options.lazyConnect) {
      logger.debug("`LazyConnect` is enabled, initiating connection...");
      await client.connect();
    }
    return client;
  },
  inject: [MODULE_OPTIONS_TOKEN],
});

export const createRedisAdapterConstructorProvider = (
  adapterOptions?: RedisAdapterOptions,
  name?: string
): FactoryProvider => ({
  provide: REDIS_ADAPTER_CONSTRUCTOR_TOKEN,
  useFactory: async (client: IORedis) => {
    const pubClient = client.duplicate();
    const subClient = client.duplicate();
    if (client.options.lazyConnect)
      await Promise.all([pubClient.connect(), subClient.connect()]);
    const adapterConstructor = createAdapter(
      pubClient,
      subClient,
      adapterOptions
    );
    return adapterConstructor;
  },
  inject: [getRedisClientName(name)],
});

export const createRedisEmitterProvider = (
  emitterOptions?: EmitterOptions,
  nsp?: string,
  name?: string
): FactoryProvider => ({
  provide: REDIS_EMITTER_TOKEN,
  useFactory: (client: IORedis) => {
    const emitter = new Emitter(client, emitterOptions, nsp);
    return emitter;
  },
  inject: [getRedisClientName(name)],
});
