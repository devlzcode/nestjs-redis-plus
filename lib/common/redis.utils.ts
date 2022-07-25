import {
  REDIS_ADAPTER_CONSTRUCTOR_TOKEN,
  REDIS_CLIENT_TOKEN_SUFFIX,
} from "../redis.constants";

export const getRedisClientName = (name = "Default") =>
  `${name}${REDIS_CLIENT_TOKEN_SUFFIX}`;

export const getAdapterConstructorToken = () => REDIS_ADAPTER_CONSTRUCTOR_TOKEN;
