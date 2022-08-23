import { Injectable } from "@nestjs/common";
import { InjectRedisService, RedisService } from "../../../lib";

@Injectable()
export class CatsService {
  constructor(
    @InjectRedisService("Cats") private readonly redisService: RedisService,
  ) {}

  onModuleInit() {
    console.log(`Created a redis service for ${this.redisService.clientName}`);
  }
}
