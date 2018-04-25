import * as _ from "lodash";

export type Tile = string;

class Block {
  public static readonly Dimensions = 2;

  constructor(public content: Tile[][]) {
    if (content.length !== Block.Dimensions || content.some(row => row.length !== Block.Dimensions)) {
      throw `Invalid block '${content}'`;
    }
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

const blocks: Array<Block> = [
  new Block([
    [" ", " "],
    [" ", " "],
  ]),

  new Block([
    ["#", "#"],
    ["#", " "],
  ]),
  new Block([
    ["#", "#"],
    [" ", "#"],
  ]),
  new Block([
    [" ", "#"],
    ["#", "#"],
  ]),
  new Block([
    ["#", " "],
    ["#", "#"],
  ]),

  new Block([
    [" ", "#"],
    [" ", "#"],
  ]),
  new Block([
    ["#", " "],
    ["#", " "],
  ]),
  new Block([
    ["#", "#"],
    [" ", " "],
  ]),
  new Block([
    [" ", " "],
    ["#", "#"],
  ]),

  new Block([
    ["#", " "],
    [" ", " "],
  ]),
  new Block([
    [" ", "#"],
    [" ", " "],
  ]),
  new Block([
    [" ", " "],
    ["#", " "],
  ]),
  new Block([
    [" ", " "],
    [" ", "#"],
  ]),
];

const completeBlock: Block = new Block([
  ["#", "#"],
  ["#", "#"],
]);

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
          block.block = completeBlock;
        }

        row.push(block);
      }

      this.blockMap.push(row);
    }
  }

  public toMap(): string[][] {
    let map = [];

    for (let i = 0; i < this.height; i++) {
      for (let k = 0; k < Block.Dimensions; k++) {
        let row: Tile[] = [];

        for (let j = 0; j < this.width; j++) {
          const block: Block | undefined = this.blockMap[i][j].block;

          if (block) {
            row = row.concat(block.content[k]);
          } else {
            const blockRow: string[] = new Array(Block.Dimensions).fill(" ");
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

    const shuffledBlocks = _.shuffle(blocks);
    for (let k = 0; k < shuffledBlocks.length; k++) {
      const block: Block = shuffledBlocks[k];

      this.blockMap[i][j].block = block;

      const state = this.isValidBlock(i, j)
        && this.fillMap(i - 1, j)
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
blockMap.fillMap(1, 1);

export let map: Array<Array<Tile>> = blockMap.toMap();
