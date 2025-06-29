import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [ApiModule, CacheModule],
})
export class AppModule {}
