import { Inject } from "@nestjs/common";

import { getRedisToken, getServiceToken } from "./redis.utils";

export const InjectRedis = (name?: string) => Inject(getRedisToken(name));

export const InjectRedisService = (name?: string) =>
  Inject(getServiceToken(name));
