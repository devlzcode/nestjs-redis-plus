import { ConfigurableModuleBuilder } from "@nestjs/common";

import type { RedisModuleOptions } from "./types/redis-module-options.types";
import { getRedisToken, getServiceToken } from "./common/redis.utils";
import { REDIS_MODULE_OPTIONS_TOKEN } from "./redis.constants";
import {
  createRedisNameProvider,
  createRedisProvider,
  createRedisServiceProvider,
} from "./redis.providers";

type RedisCoreModuleOptions = { name?: string };

export const { ConfigurableModuleClass, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<RedisModuleOptions>({
    optionsInjectionToken: REDIS_MODULE_OPTIONS_TOKEN,
  })
    .setClassMethodName("forRoot")
    .setFactoryMethodName("createRedisOptions")
    .setExtras<RedisCoreModuleOptions>({}, (definition, { name }) => {
      const redisToken = getRedisToken(name);
      const nameProvider = createRedisNameProvider(redisToken);
      const redisProvider = createRedisProvider(redisToken);
      const redisServiceToken = getServiceToken(name);
      const redisServiceProvider =
        createRedisServiceProvider(redisServiceToken);
      const providers = (definition.providers ??= []);
      const exports = (definition.exports ??= []);
      providers.push(redisProvider, nameProvider, redisServiceProvider);
      exports.push(redisToken, redisServiceToken);
      return definition;
    })
    .build();
