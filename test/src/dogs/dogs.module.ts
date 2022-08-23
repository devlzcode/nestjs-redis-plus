import { Module } from "@nestjs/common";
import { SocketIoRedisModule } from "../../../lib/socket-io";

import { DogsService } from "./dogs.service";

@Module({
  imports: [SocketIoRedisModule.forEmitter("Dogs")],
  providers: [DogsService],
})
export class DogsModule {}
