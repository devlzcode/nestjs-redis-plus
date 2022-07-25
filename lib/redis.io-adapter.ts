import { INestApplication } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import type { createAdapter } from "@socket.io/redis-adapter";
import type { Server, ServerOptions } from "socket.io";

type AdapterConstructor = ReturnType<typeof createAdapter>;

export class IoRedisAdapter extends IoAdapter {
  constructor(
    app: INestApplication,
    private readonly adapterConstructor: AdapterConstructor
  ) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options) as Server;
    server.adapter(this.adapterConstructor);
    return server;
  }
}
