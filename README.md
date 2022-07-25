# nestjs-redis-plus
> A NestJS module for Redis with some extra features such as:
> - [`Redis Emitter`](#Emitter)
> - [`Redis Adapter`](#Adapter)

> This module uses [`ioredis`](https://github.com/luin/ioredis), [`@socket.io/redis-emitter`](https://github.com/socketio/redis-emitter) and [`@socket.io/redis-adapter`](https://github.com/socketio/redis-adapter) to connect to Redis.

## Installation
`npm i nestjs-redis-plus ioredis socket.io @nestjs/websockets @nestjs/platform-socket.io @socket.io/redis-adapter @socket.io/redis-emitter`

## Usage
```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis-plus';

@Module({
  imports: [
    RedisModule.forRoot({
      host: 'localhost',
      port: 6379,
    }),
    /* Multiple connections */
    RedisModule.forRoot({
      name: 'Secondary',
      host: 'localhost',
      port: 6379,
    }),
  ]
})
export class AppModule {}
```

## Emitter
A Redis emitter is a simple way to emit events to Redis.

```ts
/// cats.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis-plus';

@Module({
  imports: [
    RedisModule.forEmitter()
  ],
})
export class CatsModule {}
```

```ts
/// cats.service.ts
import { Injectable } from '@nestjs/common';
import type { Emitter } from '@socket.io/redis-emitter';
import { InjectRedisEmitter } from 'nestjs-redis-plus';

@Injectable()
export class CatsService {
  constructor(@InjectRedisEmitter() private readonly emitter: Emitter) {}

  async onCreated() {
    this.emitter.emit('cats:created', {
      name: 'Cat',
      age: 1,
    });
  }
}
```

## Adapter
A Redis adapter is a simple way to listen to events from Redis.

```ts
/// app.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis-plus';

@Module({
  imports: [
    RedisModule.forRoot({ host: 'localhost', port: 6379 }),
    RedisModule.forAdapter()
  ],
})
export class AppModule {}
```

```ts
/// main.ts
import { NestFactory } from '@nestjs/core';
import { RedisIoAdapter, getAdapterConstructorToken } from 'nestjs-redis-plus';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const adapterConstructor = app.get(getAdapterConstructorToken());
  const adapter = new RedisIoAdapter(app, adapterConstructor);
  app.useWebSocketAdapter(adapter);
  await app.listen(3000);
}
```


## Misc
Wondering if I should make named emitters as well to have more than one redis emitter in a module. Let me know if you'd appreciate this feature!