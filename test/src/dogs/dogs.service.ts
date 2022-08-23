import { Injectable } from "@nestjs/common";
import { InjectRedisService, RedisService } from "../../../lib";

@Injectable()
export class DogsService {
  constructor(
    @InjectRedisService("Dogs") private readonly redisService: RedisService,
  ) {}

  onModuleInit() {
    console.log(`Created a redis service for ${this.redisService.clientName}`);
  }
}
