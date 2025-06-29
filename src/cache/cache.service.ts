import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { LRUCache } from './lru';
import { ConsistentHashRing } from './hash-ring';

@Injectable()
export class CacheService implements OnModuleInit {
  private redis: Redis;
  private lru = new LRUCache(100);
  private ring = new ConsistentHashRing();

  async onModuleInit() {
    this.redis = new Redis(); // connect to Redis
    this.ring.addNode('local-node'); // if multi-node, add more
  }

  async get(key: string): Promise<string | undefined> {
    const fromLRU = this.lru.get(key);
    if (fromLRU) return fromLRU;

    const node = this.ring.getNode(key);
    if (node !== 'local-node') return undefined; // remote lookup would go here

    const val = await this.redis.get(key);
    if (val) this.lru.set(key, val);
    return val;
  }

  async set(key: string, value: string, ttl = 60): Promise<void> {
    const node = this.ring.getNode(key);
    if (node !== 'local-node') return; // remote logic

    this.lru.set(key, value);
    await this.redis.set(key, value, 'EX', ttl);
  }

  async delete(key: string): Promise<void> {
    this.lru.set(key, '');
    await this.redis.del(key);
  }
}
