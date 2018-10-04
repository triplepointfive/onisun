export class CoolDown<Key> {
  constructor(public active: Map<Key, number> = new Map()) {}

  public add(key: Key, turns: number): void {
    this.active.set(key, turns)
  }

  public turn(): void {
    this.active.forEach((val, key) => {
      if (val <= 1) {
        this.active.delete(key)
      } else {
        this.active.set(key, val - 1)
      }
    })
  }

  public has(key: Key): boolean {
    return this.active.has(key)
  }
}
