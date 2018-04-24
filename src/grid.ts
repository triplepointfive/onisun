export type Tile = string;
type Block = Array<Array<Tile>>

const blocks: Array<Block> = [
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

  public confirmBlock() {
    this.state = MapBlockState.CONFIRMED;
  }
}

let blockMap: Array<Array<MapBlock>> = [];

const BlockMapWidht = 4;
const BlockMapHeight = 4;
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

export let map: Array<Array<Tile>> = blockMapToMap(blockMap);
