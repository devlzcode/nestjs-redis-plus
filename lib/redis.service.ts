import { ModuleRef } from "@nestjs/core";
import type { OnModuleInit } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";
import type { Redis, RedisKey, RedisValue } from "ioredis";

import { REDIS_NAME_TOKEN } from "./redis.constants";

@Injectable()
export class RedisService implements OnModuleInit {
  private redis: Redis;

  constructor(
    @Inject(REDIS_NAME_TOKEN) public readonly clientName: string,
    private readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit() {
    this.redis = this.moduleRef.get(this.clientName);
  }

  get client() {
    return this.redis;
  }

  get keyPrefix() {
    return this.redis.options.keyPrefix;
  }

  // Keys

  toInt(value: string | null, radix = 10) {
    if (!value) return 0;
    const int = parseInt(value, radix);
    if (isNaN(int)) return null;
    return int;
  }

  toFloat(value: string | null) {
    if (!value) return 0;
    const float = parseFloat(value);
    if (isNaN(float)) return null;
    return float;
  }

  setKey(key: RedisKey, value: RedisValue) {
    return this.redis.set(key, value);
  }

  setKeys(map: Map<RedisKey, RedisValue>) {
    return this.redis.mset(map);
  }

  getKey(key: RedisKey) {
    return this.redis.get(key);
  }

  async getKeys(keys: RedisKey[]) {
    const values = await this.redis.mget(keys);
    return new Map(keys.map((key, index) => [key, values[index]]));
  }

  delKey(key: RedisKey) {
    return this.redis.del(key);
  }

  delKeys(keys: RedisKey[]) {
    return this.redis.del(keys);
  }

  keyExists(key: RedisKey) {
    return this.redis.exists(key);
  }

  setJSONKey(key: RedisKey, value: any) {
    return this.redis.set(key, JSON.stringify(value));
  }

  async getJSONKey<JSONType>(key: RedisKey) {
    const value = await this.redis.get(key);
    return value ? (JSON.parse(value) as JSONType) : null;
  }

  getIntKey(key: RedisKey): Promise<number | null>;
  getIntKey(key: RedisKey, radix?: number): Promise<number | null>;
  getIntKey(
    key: RedisKey,
    radix: number,
    isStrict?: boolean,
  ): Promise<number | null>;
  getIntKey(key: RedisKey, radix: number, isStrict: true): Promise<number>;
  async getIntKey(
    key: RedisKey,
    radix?: number,
    isStrict?: boolean,
  ): Promise<number | null> {
    const value = await this.redis.get(key);
    const int = this.toInt(value, radix);
    if (isStrict && int === null)
      throw new Error(`"${key}" is not an int: ${value}`);
    return int;
  }

  getFloatKey(key: RedisKey): Promise<number | null>;
  getFloatKey(key: RedisKey, isStrict: false): Promise<number | null>;
  getFloatKey(key: RedisKey, isStrict: true): Promise<number>;
  async getFloatKey(key: RedisKey, isStrict?: boolean): Promise<number | null> {
    const value = await this.redis.get(key);
    const float = this.toFloat(value);
    if (isStrict && float === null)
      throw new Error(`"${key}" is not a float: ${value}`);
    return float;
  }

  async scanKeys(pattern: string, count = 100, includeKeyPrefix = true) {
    const keys: string[] = [];
    const match = includeKeyPrefix ? `${this.keyPrefix}${pattern}` : pattern;
    const cursor = this.redis.scanStream({ match, count });
    for await (const matches of cursor) keys.push(...matches);
    return keys;
  }

  async setAndExpireKey(key: RedisKey, value: RedisValue, ttl: number) {
    const isSet = await this.redis.set(key, value, "EX", ttl);
    return isSet === "OK";
  }

  async lockKey(key: RedisKey) {
    const isLocked = await this.redis.set(key, "locked", "NX");
    return isLocked === "OK";
  }

  async isKeyLocked(key: RedisKey, ensure?: boolean) {
    if (!ensure) return this.keyExists(key);
    const value = await this.getKey(key);
    return value === "locked";
  }

  unlockKey(key: RedisKey) {
    return this.delKey(key);
  }

  async lockAndExpireKey(key: RedisKey, ttl: number) {
    const isLocked = await this.redis.set(key, "locked", "EX", ttl, "NX");
    return isLocked === "OK";
  }

  async refreshKeyLock(key: RedisKey, ttl: number) {
    const isRefreshed = await this.redis.set(key, "locked", "EX", ttl, "XX");
    return isRefreshed === "OK";
  }

  // Maps

  setField(key: RedisKey, field: RedisKey, value: RedisValue) {
    return this.redis.hset(key, field, value);
  }

  setFields(key: RedisKey, fields: [RedisKey, RedisValue][]) {
    return this.redis.hmset(key, fields);
  }

  setMap(key: RedisKey, map: Map<RedisKey, RedisValue>) {
    return this.redis.hmset(key, map);
  }

  getFieldKeys(key: RedisKey) {
    return this.redis.hkeys(key);
  }

  getField(key: RedisKey, field: RedisKey) {
    return this.redis.hget(key, field);
  }

  getFields(key: RedisKey, fields: RedisKey[]) {
    return this.redis.hmget(key, ...fields);
  }

  async getAllFields(key: RedisKey) {
    const records = await this.redis.hgetall(key);
    return records;
  }

  async getMap(key: RedisKey) {
    const records = await this.getAllFields(key);
    return new Map(Object.entries(records));
  }

  delField(key: RedisKey, field: RedisKey) {
    return this.redis.hdel(key, field);
  }

  delFields(key: RedisKey, fields: RedisKey[]) {
    return this.redis.hdel(key, ...fields);
  }

  fieldExists(key: RedisKey, field: RedisKey) {
    return this.redis.hexists(key, field);
  }

  getIntField(key: RedisKey, field: RedisKey): Promise<number | null>;
  getIntField(
    key: RedisKey,
    field: RedisKey,
    radix?: number,
  ): Promise<number | null>;
  getIntField(
    key: RedisKey,
    field: RedisKey,
    radix: number,
    isStrict?: boolean,
  ): Promise<number | null>;
  getIntField(
    key: RedisKey,
    field: RedisKey,
    radix: number,
    isStrict: true,
  ): Promise<number>;
  async getIntField(
    key: RedisKey,
    field: RedisKey,
    radix?: number,
    isStrict?: boolean,
  ): Promise<number | null> {
    const value = await this.getField(key, field);
    const int = this.toInt(value, radix);
    if (isStrict && int === null)
      throw new Error(`"${key}.${field}" is not an int: ${value}`);
    return int;
  }

  getFloatField(key: RedisKey, field: RedisKey): Promise<number | null>;
  getFloatField(
    key: RedisKey,
    field: RedisKey,
    isStrict?: boolean,
  ): Promise<number | null>;
  getFloatField(
    key: RedisKey,
    field: RedisKey,
    isStrict: true,
  ): Promise<number>;
  async getFloatField(
    key: RedisKey,
    field: RedisKey,
    isStrict?: boolean,
  ): Promise<number | null> {
    const value = await this.getField(key, field);
    const float = this.toFloat(value);
    if (isStrict && float === null)
      throw new Error(`"${key}.${field}" is not a float: ${value}`);
    return float;
  }

  async scanMap(
    key: string,
    pattern: string,
    count = 100,
    includeKeyPrefix = true,
  ) {
    const fields: string[] = [];
    const match = includeKeyPrefix ? `${this.keyPrefix}${pattern}` : pattern;
    const cursor = this.redis.hscanStream(key, { match, count });
    for await (const matches of cursor) fields.push(...matches);
    return fields;
  }

  async lockField(key: RedisKey, field: RedisKey) {
    const isLocked = await this.redis.hsetnx(key, field, "locked");
    return isLocked === 1;
  }

  async isFieldLocked(key: RedisKey, field: RedisKey, ensure?: boolean) {
    if (!ensure) return this.fieldExists(key, field);
    const value = await this.getField(key, field);
    return value === "locked";
  }

  unlockField(key: RedisKey, field: RedisKey) {
    return this.delField(key, field);
  }

  // Sets

  async getSet(key: RedisKey) {
    const members = await this.redis.smembers(key);
    return new Set(members);
  }

  getIntSet(key: RedisKey): Promise<Set<number | null>>;
  getIntSet(key: RedisKey, radix?: number): Promise<Set<number | null>>;
  getIntSet(
    key: RedisKey,
    radix: number,
    isStrict?: boolean,
  ): Promise<Set<number | null>>;
  getIntSet(key: RedisKey, radix: number, isStrict: true): Promise<Set<number>>;
  async getIntSet(
    key: RedisKey,
    radix?: number,
    isStrict?: boolean,
  ): Promise<Set<number | null>> {
    const members = await this.redis.smembers(key);
    const ints = members.flatMap((member, idx) => {
      const int = this.toInt(member, radix);
      if (isStrict && int === null)
        throw new Error(`"${key}[${idx}]" is not an int: ${member}`);
      return int;
    });
    return new Set(ints);
  }

  getFloatSet(key: RedisKey): Promise<Set<number | null>>;
  getFloatSet(key: RedisKey, isStrict: false): Promise<Set<number | null>>;
  getFloatSet(key: RedisKey, isStrict: true): Promise<Set<number>>;
  async getFloatSet(
    key: RedisKey,
    isStrict?: boolean,
  ): Promise<Set<number | null>> {
    const members = await this.redis.smembers(key);
    const floats = members
      .flatMap((member, idx) => {
        const float = parseFloat(member);
        if (isStrict && float === null)
          throw new Error(`"${key}[${idx}]" is not a float: ${member}`);
        return float;
      })
      .sort((a, b) => a - b);
    return new Set(floats);
  }

  async scanSet(
    key: string,
    pattern: string,
    count = 100,
    includeKeyPrefix = true,
  ) {
    const members: string[] = [];
    const match = includeKeyPrefix ? `${this.keyPrefix}${pattern}` : pattern;
    const cursor = this.redis.sscanStream(key, {
      match,
      count,
    });
    for await (const matches of cursor) members.push(...matches);
    return members;
  }

  async addToSet(key: RedisKey, values: RedisValue[], isStrict?: boolean) {
    const added = await this.redis.sadd(key, values);
    if (isStrict && added !== values.length)
      throw new Error(
        `Only ${added} of ${values.length} were added to "${key}"`,
      );
    return added;
  }

  async removeFromSet(key: RedisKey, values: RedisValue[], isStrict?: boolean) {
    const removed = await this.redis.srem(key, values);
    if (isStrict && removed !== values.length)
      throw new Error(
        `Only ${removed} of ${values.length} were removed from "${key}"`,
      );
    return removed;
  }

  countSet(key: RedisKey) {
    return this.redis.scard(key);
  }

  async isMemberOfSet(key: RedisKey, member: RedisValue) {
    const isMember = await this.redis.sismember(key, member);
    return isMember === 1;
  }

  areMembersOfSet(
    key: RedisKey,
    members: RedisValue[],
    returnType: "included" | "excluded",
  ): Promise<RedisValue[]>;
  async areMembersOfSet(
    key: RedisKey,
    members: RedisValue[],
    returnType?: string,
  ): Promise<boolean | RedisValue[]> {
    const replies = await this.redis.smismember(key, members);
    if (returnType)
      return replies.flatMap((reply, idx) => {
        if (
          (returnType === "included" && reply === 0) ||
          (returnType === "excluded" && reply === 1)
        )
          return [];
        return [members[idx]];
      });

    return replies.every((reply) => reply === 1);
  }
}
