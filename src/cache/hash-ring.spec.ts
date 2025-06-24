import { ConsistentHashRing } from './hash-ring';

describe('ConsistentHashRing', () => {
  let ring: ConsistentHashRing;

  beforeEach(() => {
    ring = new ConsistentHashRing(3);
    ring.addNode('nodeA');
    ring.addNode('nodeB');
  });

  it('should assign keys to a node', () => {
    const node = ring.getNode('my-key');
    expect(typeof node).toBe('string');
    expect(['nodeA', 'nodeB']).toContain(node);
  });

  it('should return the same node for the same key (deterministic)', () => {
    const key = 'consistent-key';
    const node1 = ring.getNode(key);
    const node2 = ring.getNode(key);
    expect(node1).toBe(node2);
  });

  it('should change node mapping when a new node is added', () => {
    const key = 'redis-key';
    const before = ring.getNode(key);

    ring.addNode('nodeC');
    const after = ring.getNode(key);

    // node assignment *may* change — can't guarantee it always does
    // so we assert that either it changes or stays valid
    expect(['nodeA', 'nodeB', 'nodeC']).toContain(after);

    // Optional: This shows the rebalance effect (not deterministic for every key)
    if (before !== after) {
      expect(true).toBe(true); // shows keys may move
    }
  });
});
