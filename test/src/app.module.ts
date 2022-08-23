import { Module } from "@nestjs/common";
import { RedisModule } from "../../lib";
import { SocketIoRedisModule } from "../../lib/socket-io";

import { CatsModule } from "./cats/cats.module";
import { DogsModule } from "./dogs/dogs.module";

@Module({
  imports: [
    RedisModule.forRoot(),
    RedisModule.forRoot({ name: "Cats", host: "localhost", port: 6379 }),
    RedisModule.forRoot({ name: "Dogs", url: "redis://localhost:6379" }),
    SocketIoRedisModule.forAdapter(),
    CatsModule,
    DogsModule,
  ],
})
export class AppModule {}
