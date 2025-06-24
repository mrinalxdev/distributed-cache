export class ConsistentHashRing {
  private ring = new Map<number, string>();
  private nodes: string[] = [];
  private replicas: number;

  constructor(replicas = 3) {
    this.replicas = replicas;
  }

  addNode(node: string) {
    this.nodes.push(node);
    for (let i = 0; i < this.replicas; i++) {
      const hash = this.hash(`${node}:${i}`);
      this.ring.set(hash, node);
    }
  }

  getNode(key: string): string {
    const hash = this.hash(key);
    const sorted = Array.from(this.ring.keys()).sort((a, b) => a - b);
    for (const h of sorted) {
      if (hash <= h) return this.ring.get(h)!;
    }
    return this.ring.get(sorted[0])!;
  }

  private hash(str: string): number {
    let hash = 0;
    for (const char of str) hash = (hash << 5) - hash + char.charCodeAt(0);
    return hash >>> 0; // unsigned
  }
}
