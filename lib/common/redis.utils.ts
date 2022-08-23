import type { ConnectionOptions } from "tls";
import type { RedisOptions } from "ioredis";

export const getRedisToken = (name = "Default") => `${name}Redis`;

export const getServiceToken = (name = "Default") =>
  `${getRedisToken(name)}/Service`;

export const parseRedisUrl = (
  redisUrl: string,
  connectionOptions?: ConnectionOptions,
) => {
  const parsedUrl = new URL(redisUrl);
  const options: RedisOptions = {
    host: parsedUrl.hostname,
    port: parseInt(parsedUrl.port, 10),
  };
  if (parsedUrl.username) options.username = parsedUrl.username;
  if (parsedUrl.password) options.password = parsedUrl.password;
  if (parsedUrl.pathname)
    options.db = parseInt(parsedUrl.pathname.slice(1), 10);
  if (parsedUrl.protocol === "rediss:") options.tls = connectionOptions || {};
  return options;
};
