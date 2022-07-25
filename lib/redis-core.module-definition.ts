import { ConfigurableModuleBuilder } from "@nestjs/common";
import type { RedisModuleOptions } from "./types/redis-module-options.types";
import {
  createRedisNameProvider,
  createRedisProvider,
} from "./redis.providers";

type RedisCoreModuleOptions = { name?: string };

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<RedisModuleOptions>({
  moduleName: "RedisCore",
})
  .setClassMethodName("forRoot")
  .setFactoryMethodName("createRedisOptions")
  .setExtras<RedisCoreModuleOptions>({}, (definition, { name }) => {
    const nameProvider = createRedisNameProvider(name);
    const clientProvider = createRedisProvider(name);
    const existingProviders = definition.providers || [];
    return {
      ...definition,
      providers: [nameProvider, clientProvider, ...existingProviders],
      exports: [clientProvider],
    };
  })
  .build();
