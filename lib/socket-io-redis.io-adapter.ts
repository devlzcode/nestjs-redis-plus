import type { INestApplication } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import type { createAdapter } from "@socket.io/redis-adapter";
import type { ServerOptions } from "socket.io";

type AdapterConstructor = ReturnType<typeof createAdapter>;

export class SocketIoRedisAdapter extends IoAdapter {
  constructor(
    app: INestApplication,
    private readonly adapterConstructor: AdapterConstructor,
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
