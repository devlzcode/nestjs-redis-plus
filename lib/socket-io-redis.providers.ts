import type { FactoryProvider } from "@nestjs/common";
import type { EmitterOptions as RedisEmitterOptions } from "@socket.io/redis-emitter";
import { Emitter as RedisEmitter } from "@socket.io/redis-emitter";
import type { RedisAdapterOptions } from "@socket.io/redis-adapter";
import { createAdapter as createRedisAdapter } from "@socket.io/redis-adapter";
import type { Redis } from "ioredis";

import { getRedisToken } from "./common/redis.utils";
import {
  getEmitterToken,
  getAdapterToken,
} from "./common/socket-io-redis.utils";

export const createSocketIoRedisAdapter = (
  clientName?: string,
  adapterOptions?: RedisAdapterOptions,
): FactoryProvider => ({
  provide: getAdapterToken(clientName),
  useFactory: async (client: Redis) => {
    const pubClient = client.duplicate();
    const subClient = client.duplicate();
    if (pubClient.status !== "connecting") await pubClient.connect();
    if (subClient.status !== "connecting") await subClient.connect();
    const adapterConstructor = createRedisAdapter(
      pubClient,
      subClient,
      adapterOptions,
    );
    return adapterConstructor;
  },
  inject: [getRedisToken(clientName)],
});

export const createSocketIoRedisEmitter = (
  clientName?: string,
  emitterOptions?: RedisEmitterOptions,
  nsp?: string,
): FactoryProvider => ({
  provide: getEmitterToken(clientName),
  useFactory: (client: Redis) => {
    const emitter = new RedisEmitter(client, emitterOptions, nsp);
    return emitter;
  },
  inject: [getRedisToken(clientName)],
});
