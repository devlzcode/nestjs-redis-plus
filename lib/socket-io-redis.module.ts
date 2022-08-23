import type { DynamicModule } from "@nestjs/common";
import { Module } from "@nestjs/common";

import type {
  SocketIoRedisModuleAdapterOptions,
  SocketIoRedisModuleEmitterOptions,
} from "./types/socket-io-redis-module-options.type";
import {
  createSocketIoRedisAdapter,
  createSocketIoRedisEmitter,
} from "./socket-io-redis.providers";

@Module({})
export class SocketIoRedisModule {
  static forAdapter(name?: string): DynamicModule;
  static forAdapter(options?: SocketIoRedisModuleAdapterOptions): DynamicModule;
  static forAdapter(
    optionsOrName: string | SocketIoRedisModuleAdapterOptions = {},
  ): DynamicModule {
    const options =
      typeof optionsOrName === "string"
        ? { name: optionsOrName }
        : optionsOrName;
    const adapterProvider = createSocketIoRedisAdapter(
      options.name,
      options.options,
    );
    return {
      module: SocketIoRedisModule,
      providers: [adapterProvider],
      exports: [adapterProvider],
    };
  }

  static forEmitter(name?: string): DynamicModule;
  static forEmitter(options?: SocketIoRedisModuleEmitterOptions): DynamicModule;
  static forEmitter(
    optionsOrName: string | SocketIoRedisModuleEmitterOptions = {},
  ): DynamicModule {
    const options =
      typeof optionsOrName === "string"
        ? { name: optionsOrName }
        : optionsOrName;
    const emitterProvider = createSocketIoRedisEmitter(
      options.name,
      options.options,
      options.nsp,
    );
    return {
      global: options.isGlobal,
      module: SocketIoRedisModule,
      providers: [emitterProvider],
      exports: [emitterProvider],
    };
  }
}
