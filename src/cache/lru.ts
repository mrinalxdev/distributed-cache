export class LRUNode {
  constructor(
    public key: string,
    public value: string,
    public prev: LRUNode | null = null,
    public next: LRUNode | null = null,
  ) {}
}

export class LRUCache {
  private map = new Map<string, LRUNode>();
  private head: LRUNode | null = null;
  private tail: LRUNode | null = null;

  constructor(private capacity: number) {}

  get(key: string): string | undefined {
    const node = this.map.get(key);

    if (!node) return undefined;
    this.moveToHead(node);
    return node.value;
  }

  set(key: string, value: string) {
    if (this.map.has(key)) {
      const node = this.map.get(key)!;
      node.value = value;
      this.moveToHead(node);
    } else {
      const newNode = new LRUNode(key, value);
      this.map.set(key, newNode);
      this.addToHead(newNode);
      if (this.map.size > this.capacity) {
        this.evictTail();
      }
    }
  }

  private moveToHead(node: LRUNode) {
    node.next = this.head;
    node.prev = null;

    if (this.head) this.head.prev = node;
    this.head = node;
    if (!this.tail) this.tail = node;
  }

  private addToHead(node: LRUNode) {
    node.next = this.head;
    node.prev = null;

    if (this.head) this.head.prev = node;

    this.head = node;

    if (!this.tail) this.tail = node;
  }

  private removeNode(node: LRUNode) {
    if (node.prev) node.prev.next = node.next;
    else this.head = node.next;
    if (node.next) node.next.prev = node.prev;
    else this.tail = node.prev;
  }

  private evictTail() {
    if (this.tail) {
      this.map.delete(this.tail.key);
      this.removeNode(this.tail);
    }
  }
}
