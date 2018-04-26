import * as _ from "lodash";

type BlockId = string;

export enum TileTypes {
  Wall,
  Door,
  Floor,
}

export class Tile {
  private static repository: { [key: string]: Tile } = {};

  private static register(key: string, tile: Tile) {
    if (this.repository[key]) {
      throw `Tile '${key}' is already registered!`;
    }

    this.repository[key] = tile;
  }

  public static retrive(key: string): Tile {
    let tile = this.repository[key];

    if (!tile) {
      throw `Tile '${key}' is not registered!`;
    }

    return tile;
  }

  constructor(public key: string, public display: string, public type: TileTypes) {
    Tile.register(key, this);
  }
};

new Tile("R", " ", TileTypes.Floor);
new Tile("C", " ", TileTypes.Floor);
new Tile("W", "#", TileTypes.Wall);
new Tile("D", "+", TileTypes.Door);

class Block {
  public static readonly Dimensions = 3;

  public id: BlockId;

  constructor(public content: Tile[][]) {
    if (content.length !== Block.Dimensions || content.some(row => row.length !== Block.Dimensions)) {
      throw `Invalid block '${content}'`;
    }

    this.id = content.map(row => row.map(tile => tile.key).join("")).join("");
  }

  public matchRight(block: Block): boolean {
    return this.matchHorizontal(this, block);
  }

  public matchLeft(block: Block): boolean {
    return this.matchHorizontal(block, this);
  }

  public matchTop(block: Block): boolean {
    return this.matchVertical(block, this);
  }

  public matchBootom(block: Block): boolean {
    return this.matchVertical(this, block);
  }

  public mirrorVertically(): Block {
    return new Block(_.cloneDeep(this.content).reverse());
  }

  public mirrorHorizontally(): Block {
    return new Block(_.cloneDeep(this.content).map(row => row.reverse()));
  }

  public rotateRight(): Block {
    return new Block(this.rotate(_.cloneDeep(this.content)));
  }

  private rotate(matrix: any[][]): any[][] {
    matrix = matrix.reverse();

    let temp: number;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < i; j++) {
        temp = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = temp;
      }
    }

    return matrix;
  }

  private matchHorizontal(left: Block, right: Block): boolean {
    return _.isEqual(
      left.content.map(row => row[Block.Dimensions - 1]),
      right.content.map(row => row[0]),
    );
  }

  private matchVertical(top: Block, bottom: Block): boolean {
    return _.isEqual(
      top.content[Block.Dimensions - 1],
      bottom.content[0],
    );
  }
}

enum Direction {
  Top,
  Bottom,
  Left,
  Right,
};

interface Neighbors {
  [key: string]: Block[];
}

class BlockRepository {
  public blocks: Block[] = [];
  public uniqBlockIds: Set<string> = new Set();

  public neighbors: { [key: string]: Neighbors } = {};

  constructor(public borderBlock: Block) {
    this.addBlock(borderBlock);
  }

  public addBlock(block: Block, mirrored: boolean = false): void {
    if (this.uniqBlockIds.has(block.id)) {
      return;
    }

    this.blocks.push(block);
    this.uniqBlockIds.add(block.id);

    this.findNeighbors(block);

    if (!mirrored) {
      const horizontalBlock = block.mirrorHorizontally();

      this.addBlock(horizontalBlock, true);
      this.addBlock(block.mirrorVertically(), true);
      this.addBlock(horizontalBlock.mirrorVertically(), true);
    }

    let rotationBlock = block.rotateRight();
    for (let i = 0; i < 3; i++) {
      this.addBlock(rotationBlock, true);
      rotationBlock = rotationBlock.rotateRight();
    }
  }

  public shuffledBlocks(): Block[] {
    return _.shuffle(this.blocks);
  }

  public available(top: Block | undefined, bottom: Block | undefined,
                   left: Block | undefined, right: Block | undefined): Block[] {
    let availableBlocks = this.blocks;

    if (top !== undefined) {
      availableBlocks = _.intersection(availableBlocks, this.neighbors[top.id][Direction.Bottom]);
    }

    if (bottom !== undefined) {
      availableBlocks = _.intersection(availableBlocks, this.neighbors[bottom.id][Direction.Top]);
    }

    if (left !== undefined) {
      availableBlocks = _.intersection(availableBlocks, this.neighbors[left.id][Direction.Right]);
    }

    if (right !== undefined) {
      availableBlocks = _.intersection(availableBlocks, this.neighbors[right.id][Direction.Left]);
    }

    return _.shuffle(availableBlocks);
  }

  private findNeighbors(centralBlock: Block) {
    this.blocks.forEach((block) => {
      if (centralBlock.matchTop(block)) {
        this.addNeighbor(centralBlock, block, Direction.Top);
        this.addNeighbor(block, centralBlock, Direction.Bottom);
      }

      if (centralBlock.matchBootom(block)) {
        this.addNeighbor(centralBlock, block, Direction.Bottom);
        this.addNeighbor(block, centralBlock, Direction.Top);
      }

      if (centralBlock.matchLeft(block)) {
        this.addNeighbor(centralBlock, block, Direction.Left);
        this.addNeighbor(block, centralBlock, Direction.Right);
      }

      if (centralBlock.matchRight(block)) {
        this.addNeighbor(centralBlock, block, Direction.Right);
        this.addNeighbor(block, centralBlock, Direction.Left);
      }
    });
  }

  private addNeighbor(central: Block, neighbor: Block, direction: Direction) {
    if (!this.neighbors[central.id]) {
      this.neighbors[central.id] = {
        [Direction.Top]: [],
        [Direction.Bottom]: [],
        [Direction.Left]: [],
        [Direction.Right]: [],
      };
    }

    this.neighbors[central.id][direction].push(neighbor);
  }
}

const rawToTiles = function (map: string[]): Tile[][] {
  let tiles: Tile[][] = [];
  map.forEach((row) => {
    let tileRow: Tile[] = [];
    row.split("").forEach((key) => {
      tileRow.push(Tile.retrive(key));
    });
    tiles.push(tileRow);
  });
  return tiles;
};

let blockRepository = new BlockRepository(
  new Block(rawToTiles([
    "WWW",
    "WWW",
    "WWW",
  ]))
);

[
  [
    "RRR",
    "RRR",
    "RRR",
  ],

  [
    "WCW",
    "RRR",
    "RRR",
  ],
  [
    "WWC",
    "RRR",
    "RRR",
  ],
  [
    "CWC",
    "RRR",
    "RRR",
  ],
  [
    "WWW",
    "RRR",
    "RRR",
  ],

  [
    "WCW",
    "CRR",
    "WRR",
  ],
  [
    "WWW",
    "WRR",
    "WRR",
  ],
  [
    "WWW",
    "CRR",
    "WRR",
  ],
  [
    "WWC",
    "WRR",
    "WRR",
  ],
  [
    "WWC",
    "WRR",
    "CRR",
  ],

  [
    "WWW",
    "CCW",
    "WCW",
  ],
  [
    "WWW",
    "CCC",
    "WWW",
  ],
  [
    "WCW",
    "CCC",
    "WWW",
  ],
  [
    "WCW",
    "CCC",
    "WCW",
  ],

].forEach((content) => {
  blockRepository.addBlock(new Block(rawToTiles(content)));
});

enum MapBlockState {
  EMPTY,
  CONFIRMED,
};

class MapBlock {
  private state: MapBlockState;
  public block?: Block;

  constructor() {
    this.state = MapBlockState.EMPTY;
  }

  public isFinished(): boolean {
    return this.block !== undefined && this.state === MapBlockState.CONFIRMED;
  }

  public confirmBlock() {
    this.state = MapBlockState.CONFIRMED;
  }
}

class Map {
  private blockMap: MapBlock[][] = [];

  private steps = 0;

  constructor(public width: number, public height: number) {
    this.initializeBlockMap();
  }

  public initializeBlockMap() {
    for (let i = 0; i < this.height; i++) {
      let row = [];

      for (let j = 0; j < this.width; j++) {
        let block = new MapBlock();

        if (i === 0 || j === 0 || i === this.height - 1 || j === this.width - 1) {
          block.confirmBlock();
          block.block = blockRepository.borderBlock;
        }

        row.push(block);
      }

      this.blockMap.push(row);
    }
  }

  public toMap(): Tile[][] {
    let map = [];

    for (let i = 0; i < this.height; i++) {
      for (let k = 0; k < Block.Dimensions - 1; k++) {
        let row: Tile[] = [];

        for (let j = 0; j < this.width; j++) {
          const block: Block | undefined = this.blockMap[i][j].block;

          if (block) {
            row = row.concat(_.initial(block.content[k]));
          } else {
            const blockRow: Tile[] = new Array(Block.Dimensions).fill(" ");
            row = row.concat(blockRow);
          }
        }

        map.push(row);
      }
    }

    return map;
  }

  public fillMap(i: number, j: number): boolean {
    if (this.blockMap[i][j].block !== undefined) {
      return true;
    }
    this.steps += 1;

    if (this.steps > 300000) {
      throw "failed to generate";
    }

    const top = this.blockMap[i - 1][j].block;
    const bottom = this.blockMap[i + 1][j].block;
    const left = this.blockMap[i][j - 1].block;
    const right = this.blockMap[i][j + 1].block;

    const shuffledBlocks = blockRepository.available(top, bottom, left, right);
    for (let k = 0; k < shuffledBlocks.length; k++) {
      const block: Block = shuffledBlocks[k];

      this.blockMap[i][j].block = block;

      const state = this.fillMap(i - 1, j)
                 && this.fillMap(i, j - 1)
                 && this.fillMap(i + 1, j)
                 && this.fillMap(i, j + 1);

      if (state) {
        break;
      }
      else {
        this.blockMap[i][j].block = undefined;
      }
    }

    return this.blockMap[i][j].block !== undefined;
  }

  private isValidBlock(i: number, j: number): boolean {
    const block = this.blockMap[i][j];
    if (block.isFinished()) {
      return true;
    }

    const elem = block.block;
    if (elem === undefined) {
      return false;
    }

    const top = this.blockMap[i - 1][j].block;
    const bottom = this.blockMap[i + 1][j].block;
    const left = this.blockMap[i][j - 1].block;
    const right = this.blockMap[i][j + 1].block;

    return (top === undefined || elem.matchTop(top))
      && (bottom === undefined || elem.matchBootom(bottom))
      && (left === undefined || elem.matchLeft(left))
      && (right === undefined || elem.matchRight(right));
  }
}

let blockMap: Map = new Map(20, 20);

console.log("Blocks", blockRepository.blocks.length);
console.log(blockRepository.neighbors)

console.time("fillMap");

blockMap.fillMap(1, 1);

console.timeEnd("fillMap");

export let map: Array<Array<Tile>> = blockMap.toMap();
