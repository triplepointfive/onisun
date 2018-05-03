import * as _ from 'lodash'

import { LevelMap, Tile, TileTypes } from '../map'

type BlockId = string

class Block {
  public static readonly Dimensions = 3

  public id: BlockId

  constructor(public content: Tile[][], public weight: number) {
    if (content.length !== Block.Dimensions || content.some(row => row.length !== Block.Dimensions)) {
      throw `Invalid block '${content}'`
    }

    this.id = content.map(row => row.map(tile => tile.key).join('')).join('')
  }

  public matchRight(block: Block): boolean {
    return this.matchHorizontal(this, block)
  }

  public matchLeft(block: Block): boolean {
    return this.matchHorizontal(block, this)
  }

  public matchTop(block: Block): boolean {
    return this.matchVertical(block, this)
  }

  public matchBootom(block: Block): boolean {
    return this.matchVertical(this, block)
  }

  public mirrorVertically(): Block {
    return new Block(_.cloneDeep(this.content).reverse(), this.weight)
  }

  public mirrorHorizontally(): Block {
    return new Block(_.cloneDeep(this.content).map(row => row.reverse()), this.weight)
  }

  public rotateRight(): Block {
    return new Block(this.rotate(_.cloneDeep(this.content)), this.weight)
  }

  private rotate(matrix: any[][]): any[][] {
    matrix = matrix.reverse()

    let temp: number
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < i; j++) {
        temp = matrix[i][j]
        matrix[i][j] = matrix[j][i]
        matrix[j][i] = temp
      }
    }

    return matrix
  }

  private matchHorizontal(left: Block, right: Block): boolean {
    return _.isEqual(
      left.content.map(row => row[Block.Dimensions - 1]),
      right.content.map(row => row[0]),
    )
  }

  private matchVertical(top: Block, bottom: Block): boolean {
    return _.isEqual(
      top.content[Block.Dimensions - 1],
      bottom.content[0],
    )
  }
}

enum Direction {
  Top,
  Bottom,
  Left,
  Right,
}

interface Neighbors {
  [key: string]: Block[]
}

class BlockRepository {
  public blocks: Block[] = []
  public uniqBlockIds: Set<string> = new Set()

  public neighbors: { [key: string]: Neighbors } = {}

  constructor(public borderBlock: Block) {
    this.addBlock(borderBlock)
  }

  public addBlock(block: Block, mirrored: boolean = false): void {
    if (this.uniqBlockIds.has(block.id)) {
      return
    }

    this.blocks.push(block)
    this.uniqBlockIds.add(block.id)

    this.findNeighbors(block)

    if (!mirrored) {
      const horizontalBlock = block.mirrorHorizontally()

      this.addBlock(horizontalBlock, true)
      this.addBlock(block.mirrorVertically(), true)
      this.addBlock(horizontalBlock.mirrorVertically(), true)
    }

    let rotationBlock = block.rotateRight()
    for (let i = 0; i < 3; i++) {
      this.addBlock(rotationBlock, true)
      rotationBlock = rotationBlock.rotateRight()
    }
  }

  public available(top: Block | undefined, bottom: Block | undefined,
                   left: Block | undefined, right: Block | undefined): Block[] {
    let availableBlocks = this.blocks

    if (top !== undefined) {
      availableBlocks = _.intersection(availableBlocks, this.neighbors[top.id][Direction.Bottom])
    }

    if (bottom !== undefined) {
      availableBlocks = _.intersection(availableBlocks, this.neighbors[bottom.id][Direction.Top])
    }

    if (left !== undefined) {
      availableBlocks = _.intersection(availableBlocks, this.neighbors[left.id][Direction.Right])
    }

    if (right !== undefined) {
      availableBlocks = _.intersection(availableBlocks, this.neighbors[right.id][Direction.Left])
    }

    // return _.sortBy(availableBlocks, block => Math.random() * block.weight)
    return _.sortBy(availableBlocks, block => 1 * block.weight).reverse()
  }

  private findNeighbors(centralBlock: Block) {
    this.blocks.forEach((block) => {
      if (centralBlock.matchTop(block)) {
        this.addNeighbor(centralBlock, block, Direction.Top)
        this.addNeighbor(block, centralBlock, Direction.Bottom)
      }

      if (centralBlock.matchBootom(block)) {
        this.addNeighbor(centralBlock, block, Direction.Bottom)
        this.addNeighbor(block, centralBlock, Direction.Top)
      }

      if (centralBlock.matchLeft(block)) {
        this.addNeighbor(centralBlock, block, Direction.Left)
        this.addNeighbor(block, centralBlock, Direction.Right)
      }

      if (centralBlock.matchRight(block)) {
        this.addNeighbor(centralBlock, block, Direction.Right)
        this.addNeighbor(block, centralBlock, Direction.Left)
      }
    })
  }

  private addNeighbor(central: Block, neighbor: Block, direction: Direction) {
    if (!this.neighbors[central.id]) {
      this.neighbors[central.id] = {
        [Direction.Top]: [],
        [Direction.Bottom]: [],
        [Direction.Left]: [],
        [Direction.Right]: [],
      }
    }

    this.neighbors[central.id][direction].push(neighbor)
  }
}

enum MapBlockState {
  EMPTY,
  CONFIRMED,
}

class MapBlock {
  private state: MapBlockState
  public block?: Block

  constructor() {
    this.state = MapBlockState.EMPTY
  }

  public isFinished(): boolean {
    return this.block !== undefined && this.state === MapBlockState.CONFIRMED
  }

  public confirmBlock() {
    this.state = MapBlockState.CONFIRMED
  }
}

class Map {
  private blockMap: MapBlock[][] = []
  private map: Tile[][] = []

  private steps = 0

  constructor(public width: number, public height: number, private blockRepository: BlockRepository) {
    this.initializeBlockMap()
  }

  public initializeBlockMap() {
    for (let i = 0; i < this.height; i++) {
      let row = []

      for (let j = 0; j < this.width; j++) {
        let block = new MapBlock()

        if (i === 0 || j === 0 || i === this.height - 1 || j === this.width - 1) {
          block.confirmBlock()
          block.block = this.blockRepository.borderBlock
        }

        row.push(block)
      }

      this.blockMap.push(row)
    }
  }

  public fillMap(i: number, j: number): boolean {
    if (this.blockMap[i][j].block !== undefined) {
      return true
    }
    this.steps += 1

    if (this.steps > 100000) {
      throw 'failed to generate'
    }

    const top = this.blockMap[i - 1][j].block
    const bottom = this.blockMap[i + 1][j].block
    const left = this.blockMap[i][j - 1].block
    const right = this.blockMap[i][j + 1].block

    const shuffledBlocks = this.blockRepository.available(top, bottom, left, right)
    for (let k = 0; k < shuffledBlocks.length; k++) {
      const block: Block = shuffledBlocks[k]

      this.blockMap[i][j].block = block

      const state = this.fillMap(i - 1, j)
                 && this.fillMap(i, j - 1)
                 && this.fillMap(i + 1, j)
                 && this.fillMap(i, j + 1)

      if (state) {
        break
      }
      else {
        this.blockMap[i][j].block = undefined
      }
    }

    return this.blockMap[i][j].block !== undefined
  }

  public buildMap(): LevelMap {
    const iterateHeight = this.height - 1
    const iterateWidth = this.width - 1

    for (let i = 1; i < iterateHeight; i++) {
      for (let k = 0; k < Block.Dimensions - (i === iterateHeight - 1 ? 0 : 1); k++) {
        let row: Tile[] = []

        for (let j = 1; j < iterateWidth; j++) {
          const block: Block | undefined = this.blockMap[i][j].block

          if (block) {
            const blockRow = block.content[k]
            row = row.concat(j === iterateWidth - 1 ? blockRow : _.initial(blockRow))
          } else {
            const blockRow: Tile[] = new Array(Block.Dimensions).fill(' ')
            row = row.concat(blockRow)
          }
        }

        this.map.push(row)
      }
    }

    return new LevelMap(this.map)
  }

  private addDoor(): boolean {
    return Math.random() > 0.5
  }
}

const rawToTiles = function(map: string[]): Tile[][] {
  let tiles: Tile[][] = []
  map.forEach((row) => {
    let tileRow: Tile[] = []
    row.split('').forEach((key) => {
      tileRow.push(Tile.retrive(key))
    })
    tiles.push(tileRow)
  })
  return tiles
}

const blocks = [
  { content: [
    'WWW',
    'WWW',
    'WWW',
  ], weight: 0.5},

  { content: [
    'RRR',
    'RRR',
    'RRR',
  ], weight: 20},

  { content: [
    'WCW',
    'RRR',
    'RRR',
  ], weight: 20},
  { content: [
    'WWC',
    'RRR',
    'RRR',
  ], weight: 20},
  { content: [
    'CWC',
    'RRR',
    'RRR',
  ], weight: 20},
  { content: [
    'WWW',
    'RRR',
    'RRR',
  ], weight: 20},

  { content: [
    'WCW',
    'CRR',
    'WRR',
  ], weight: 20},
  { content: [
    'WWW',
    'WRR',
    'WRR',
  ], weight: 20},
  { content: [
    'WWW',
    'CRR',
    'WRR',
  ], weight: 20},
  { content: [
    'WWC',
    'WRR',
    'WRR',
  ], weight: 20},
  { content: [
    'WWC',
    'WRR',
    'CRR',
  ], weight: 20},

  { content: [
    'WWW',
    'CCW',
    'WCW',
  ], weight: 20},
  { content: [
    'WWW',
    'CCC',
    'WWW',
  ], weight: 20},
  { content: [
    'WCW',
    'CCC',
    'WWW',
  ], weight: 20},
  { content: [
    'WCW',
    'CCC',
    'WCW',
  ], weight: 20},
]

const generate = function(dimX: number, dimY: number): LevelMap {
  let blockRepository = new BlockRepository(
    new Block(rawToTiles(blocks[0].content), blocks[0].weight))
  _.tail(blocks).forEach(({ content, weight }) => {
    blockRepository.addBlock(new Block(rawToTiles(content), weight))
  })

  let blockMap = new Map(dimX, dimY, blockRepository)
  blockMap.fillMap(1, 1)

  return blockMap.buildMap()
}

export { generate }
