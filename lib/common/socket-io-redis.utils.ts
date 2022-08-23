import { getRedisToken } from "./redis.utils";

export const getEmitterToken = (clientName?: string) =>
  `${getRedisToken(clientName)}/Emitter`;

export const getAdapterToken = (clientName?: string) =>
  `${getRedisToken(clientName)}/AdapterConstructor`;
