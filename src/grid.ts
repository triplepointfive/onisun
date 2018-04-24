import * as _ from "lodash";

export type Tile = string;
type Block = Array<Array<Tile>>

const blocks: Array<Block> = [
  [
    [" ", " "],
    [" ", " "],
  ],

  [
    ["#", "#"],
    ["#", " "],
  ],
  [
    ["#", "#"],
    [" ", "#"],
  ],
  [
    [" ", "#"],
    ["#", "#"],
  ],
  [
    ["#", " "],
    ["#", "#"],
  ],


  [
    [" ", "#"],
    [" ", "#"],
  ],
  [
    ["#", " "],
    ["#", " "],
  ],
  [
    ["#", "#"],
    [" ", " "],
  ],
  [
    [" ", " "],
    ["#", "#"],
  ],



  [
    ["#", " "],
    [" ", " "],
  ],
  [
    [" ", "#"],
    [" ", " "],
  ],
  [
    [" ", " "],
    ["#", " "],
  ],
  [
    [" ", " "],
    [" ", "#"],
  ],
];

const completeBlock: Block = [
  ["#", "#"],
  ["#", "#"],
];

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

let blockMap: Array<Array<MapBlock>> = [];

const BlockMapWidht = 6;
const BlockMapHeight = 6;
const BlockDimension = 2;

for (let i = 0; i < BlockMapHeight; i++) {
  let row = [];

  for (let j = 0; j < BlockMapWidht; j++) {
    let block = new MapBlock();

    if (i === 0 || j === 0 || i === BlockMapHeight - 1 || j === BlockMapWidht - 1) {
      block.confirmBlock();
      block.block = completeBlock;
    }

    row.push(block);
  }

  blockMap.push(row);
}

function blockMapToMap(blockMap: Array<Array<MapBlock>>) {
  let map = [];

  for (let i = 0; i < BlockMapHeight; i++) {
    for (let k = 0; k < BlockDimension; k++) {
      let row: Tile[] = [];

      for (let j = 0; j < BlockMapWidht; j++) {
        const block: Block | undefined = blockMap[i][j].block;

        if (block) {
          row = row.concat(block[k]);
        } else {
          const blockRow: string[] = new Array(BlockDimension).fill(" ");
          row = row.concat(blockRow);
        }
      }

      map.push(row);
    }
  }

  return map;
}

function matchHorizontal(left: Block, right: Block): boolean {
  return _.isEqual(
    left.map(row => row[BlockDimension - 1]),
    right.map(row => row[0]),
  );
}

function matchVertical(top: Block, bottom: Block): boolean {
  return _.isEqual(
    top[BlockDimension - 1],
    bottom[0],
  );
}

function fillMap(blockMap: MapBlock[][], i: number, j: number): boolean {
  if (blockMap[i][j].block !== undefined) {
    return true;
  }

  const shuffledBlocks = _.shuffle(blocks);
  for (let k = 0; k < shuffledBlocks.length; k++) {
    const block: Block = shuffledBlocks[k];

    blockMap[i][j].block = block;

    const state = isValidBlock(blockMap, i, j)
      && fillMap(blockMap, i - 1, j)
      && fillMap(blockMap, i, j - 1)
      && fillMap(blockMap, i + 1, j)
      && fillMap(blockMap, i, j + 1);

    if (state) {
      break;
    }
    else {
      blockMap[i][j].block = undefined;
    }
  }

  return blockMap[i][j].block !== undefined;
}

function isValidBlock(blockMap: MapBlock[][], i: number, j: number): boolean {
  const block = blockMap[i][j];
  if (block.isFinished()) {
    return true;
  }

  const elem = block.block;
  if (elem === undefined) {
    return false;
  }

  const top = blockMap[i - 1][j].block;
  const bottom = blockMap[i + 1][j].block;
  const left = blockMap[i][j - 1].block;
  const right = blockMap[i][j + 1].block;

  return (top === undefined || matchVertical(top, elem))
    && (bottom === undefined || matchVertical(elem, bottom))
    && (left === undefined || matchHorizontal(left, elem))
    && (right === undefined || matchHorizontal(elem, right));
}


fillMap(blockMap, 1, 1);

export let map: Array<Array<Tile>> = blockMapToMap(blockMap);
