# nestjs-redis-plus

> A NestJS module for Redis with some extra features such as:
>
> - [`Redis Emitter`](#Emitter)
> - [`Redis Adapter`](#Adapter)

> This module uses [`ioredis`](https://github.com/luin/ioredis), [`@socket.io/redis-emitter`](https://github.com/socketio/redis-emitter) and [`@socket.io/redis-adapter`](https://github.com/socketio/redis-adapter) to connect to Redis.

## Installation

`npm i nestjs-redis-plus ioredis socket.io @nestjs/websockets @nestjs/platform-socket.io @socket.io/redis-adapter @socket.io/redis-emitter`

## Usage

```ts
// app.module.ts
import { Module } from "@nestjs/common";
import { RedisModule } from "nestjs-redis-plus";

@Module({
  imports: [
    RedisModule.forRoot(),
    /* Multiple connections */
    RedisModule.forRoot({
      name: "Secondary",
      host: "localhost",
      port: 6379,
    }),
  ],
})
export class AppModule {}
```
