import type { EmitterOptions as RedisEmitterOptions } from "@socket.io/redis-emitter";
import type { RedisAdapterOptions } from "@socket.io/redis-adapter";

export type SocketIoRedisModuleAdapterOptions = {
  name?: string;
  options?: RedisAdapterOptions;
};

export type SocketIoRedisModuleEmitterOptions = {
  isGlobal?: boolean;
  name?: string;
  nsp?: string;
  options?: RedisEmitterOptions;
};
