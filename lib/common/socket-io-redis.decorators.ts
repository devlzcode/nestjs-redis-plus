import { Inject } from "@nestjs/common";

import { getEmitterToken } from "./socket-io-redis.utils";

export const InjectRedisEmitter = (clientName?: string) =>
  Inject(getEmitterToken(clientName));
