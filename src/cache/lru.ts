export class LRUNode {
  constructor(
    public key: string,
    public value: string,
    public prev: LRUNode | null = null,
    public next: LRUNode | null = null,
  ) { }
}

export class LRUCache {
  private map = new Map<string, LRUNode>();
  private head: LRUNode | null = null; 
  private tail : LRUNode | null = null;

  constructor(private capacity : number){}

  get(key : string) : string | undefined {
    const node = this.map.get(key)

    if (!node) return undefined
    this.moveToHead(node)
    return node.value
  }


  private moveToHead(node : LRUNode){
    node.next = this.head
    node.prev = null;

    if (this.head) this.head.prev = node;
    this.head = node;
    if (!this.tail) this.tail = node;
  }
}
