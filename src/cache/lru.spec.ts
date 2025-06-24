import { LRUCache } from './lru';

describe('LRUCache', () => {
  let cache: LRUCache;

  beforeEach(() => {
    cache = new LRUCache(3); // small size for easy testing
  });

  it('should return undefined for missing key', () => {
    expect(cache.get('missing')).toBeUndefined();
  });

  it('should store and retrieve values', () => {
    cache.set('a', '1');
    expect(cache.get('a')).toBe('1');
  });

  it('should evict least recently used item when capacity exceeded', () => {
    cache.set('a', '1');
    cache.set('b', '2');
    cache.set('c', '3');
    cache.get('a');           // a is now recently used
    cache.set('d', '4');      // should evict 'b'

    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('a')).toBe('1');
    expect(cache.get('c')).toBe('3');
    expect(cache.get('d')).toBe('4');
  });

  it('should update value if key already exists', () => {
    cache.set('x', '1');
    cache.set('x', '999');
    expect(cache.get('x')).toBe('999');
  });

  it('should move key to front on get', () => {
    cache.set('a', '1');
    cache.set('b', '2');
    cache.set('c', '3');
    cache.get('a');           // a is now most recent
    cache.set('d', '4');      // should evict 'b'

    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('a')).toBe('1');
  });
});
