import { Module } from "@nestjs/common";
import { RedisModule } from "../../../lib";

@Module({
  imports: [RedisModule.forEmitter("Dogs")],
})
export class DogsModule {}
