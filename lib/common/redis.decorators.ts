import { Inject } from "@nestjs/common";
import { REDIS_EMITTER_TOKEN } from "../redis.constants";
import { getRedisClientName } from "./redis.utils";

export const InjectRedisClient = (name?: string) =>
  Inject(getRedisClientName(name));

export const InjectRedisEmitter = () => Inject(REDIS_EMITTER_TOKEN);
