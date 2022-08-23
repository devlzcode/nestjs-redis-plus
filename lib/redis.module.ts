import type { DynamicModule } from "@nestjs/common";
import { Module } from "@nestjs/common";

import type {
  ASYNC_OPTIONS_TYPE,
  OPTIONS_TYPE,
} from "./redis-core.module-definition";
import { RedisCoreModule } from "./redis-core.module";

@Module({})
export class RedisModule {
  static forRoot(url?: string): DynamicModule;
  static forRoot(options?: typeof OPTIONS_TYPE): DynamicModule;
  static forRoot(
    optionsOrUrl: string | typeof OPTIONS_TYPE = "redis://localhost:6379",
  ): DynamicModule {
    const options =
      typeof optionsOrUrl === "string" ? { url: optionsOrUrl } : optionsOrUrl;
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(options: typeof ASYNC_OPTIONS_TYPE): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRootAsync(options)],
    };
  }
}
