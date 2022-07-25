import { DynamicModule, Module } from "@nestjs/common";
import type { RedisAdapterOptions } from "@socket.io/redis-adapter";
import type { EmitterOptions } from "@socket.io/redis-emitter";
import { RedisCoreModule } from "./redis-core.module";
import type {
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} from "./redis-core.module-definition";
import {
  createRedisEmitterProvider,
  createRedisAdapterConstructorProvider,
} from "./redis.providers";

@Module({})
export class RedisModule {
  static forRoot(options: typeof OPTIONS_TYPE) {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE) {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRootAsync(options)],
    };
  }

  static forAdapterConstructor(
    name?: string,
    adapterOptions?: RedisAdapterOptions
  ): DynamicModule {
    const redisAdapterConstructorProvider =
      createRedisAdapterConstructorProvider(adapterOptions, name);
    return {
      module: RedisModule,
      providers: [redisAdapterConstructorProvider],
      exports: [redisAdapterConstructorProvider],
    };
  }

  static forEmitter(
    name?: string,
    emitterOptions?: EmitterOptions,
    nsp?: string
  ): DynamicModule {
    const redisEmitterProvider = createRedisEmitterProvider(
      emitterOptions,
      nsp,
      name
    );
    return {
      module: RedisModule,
      providers: [redisEmitterProvider],
      exports: [redisEmitterProvider],
    };
  }
}
