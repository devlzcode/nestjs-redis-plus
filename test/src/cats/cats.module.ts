import { Module } from "@nestjs/common";
import { RedisModule } from "../../../lib";

@Module({
  imports: [RedisModule.forEmitter()],
})
export class CatsModule {}
