import { Module } from "@nestjs/common";
import { RedisModule } from "../../lib";
import { CatsModule } from "./cats/cats.module";
import { DogsModule } from "./dogs/dogs.module";

@Module({
  imports: [
    RedisModule.forRoot({ host: "localhost", port: 6379 }),
    RedisModule.forRoot({ name: "Dogs", host: "localhost", port: 6379 }),
    RedisModule.forAdapterConstructor(),
    CatsModule,
    DogsModule,
  ],
})
export class AppModule {}
