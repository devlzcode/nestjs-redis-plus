import { Module } from "@nestjs/common";
import { SocketIoRedisModule } from "../../../lib/socket-io";

import { CatsService } from "./cats.service";

@Module({
  imports: [SocketIoRedisModule.forEmitter({ name: "Cats" })],
  providers: [CatsService],
})
export class CatsModule {}
