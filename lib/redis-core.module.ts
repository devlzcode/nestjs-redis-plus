import type { OnApplicationShutdown } from "@nestjs/common";
import { Global, Inject, Module } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { ConfigurableModuleClass } from "./redis-core.module-definition";
import { REDIS_CLIENT_NAME_TOKEN } from "./redis.constants";

@Global()
@Module({})
export class RedisCoreModule
  extends ConfigurableModuleClass
  implements OnApplicationShutdown
{
  constructor(
    @Inject(REDIS_CLIENT_NAME_TOKEN) private readonly clientName: string,
    private readonly moduleRef: ModuleRef
  ) {
    super();
  }

  async onApplicationShutdown() {
    const client = this.moduleRef.get(this.clientName);
    await client.quit();
  }
}
