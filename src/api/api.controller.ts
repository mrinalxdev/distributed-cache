import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CacheService } from '../cache/cache.service';

@Controller('cache')
export class ApiController {
  constructor(private readonly cache: CacheService) {}

  @Get()
  async get(@Query('key') key: string) {
    return this.cache.get(key);
  }

  @Post()
  async set(@Body() body: { key: string; value: string; ttl?: number }) {
    await this.cache.set(body.key, body.value, body.ttl ?? 60);
    return { status: 'ok' };
  }
}
