import { Player } from './player'

import { includes, sample } from 'lodash'
import { Game } from './game'

export enum TalentStatus {
  Available,
  Completed,
  Unavailable,
}

export abstract class Talent {
  constructor(
    public readonly name: string,
    public readonly depth: number,
    public rank: number,
    public readonly maxRank: number
  ) {}

  protected abstract onObtain(game: Game): void

  public upgrade(game: Game): void {
    this.rank += 1
    this.onObtain(game)
  }

  public status(profession: Profession): TalentStatus {
    if (this.rank === this.maxRank) {
      return TalentStatus.Completed
    } else if (this.depth * profession.depthCost > profession.points) {
      return TalentStatus.Unavailable
    } else {
      return TalentStatus.Available
    }
  }
}

export abstract class Profession {
  abstract get depthCost(): number

  constructor(
    public readonly id: number,
    public readonly name: string,
    public level: number = 1,
    public points: number = 0,
    public talents: Talent[]
  ) {}

  abstract get grid(): (Talent | undefined)[][]
}

export class ProfessionPicker {
  constructor(
    private pool: Profession[],
    private maxLevel: number,
    private maxTaken: number
  ) {}

  public available(player: Player): Profession[] {
    let professions: Profession[] = []
    let pickedProfession: Profession | undefined

    if (this.canUpdate(player)) {
      pickedProfession = this.updatableProfession(player)
    } else if (this.canTakeNewProfession(player)) {
      pickedProfession = this.newFromPool(player)
    }

    if (pickedProfession !== undefined) {
      professions.push(pickedProfession)
    }

    if (this.canTakeNewProfession(player)) {
      pickedProfession = this.newFromPool(
        player,
        pickedProfession && pickedProfession.id
      )
    } else if (this.canUpdate(player)) {
      pickedProfession = this.updatableProfession(
        player,
        pickedProfession && pickedProfession.id
      )
    }

    if (pickedProfession !== undefined) {
      professions.push(pickedProfession)
    }

    return professions
  }

  protected canUpdate(player: Player): boolean {
    return player.professions.some(
      profession => profession.level < this.maxLevel
    )
  }

  protected updatableProfession(
    player: Player,
    excludeId: number | undefined = undefined
  ): Profession | undefined {
    return sample(
      player.professions.filter(profession => {
        return excludeId !== profession.id
      })
    )
  }

  protected canTakeNewProfession(player: Player): boolean {
    return (
      player.professions.length < this.maxTaken &&
      this.pool.length > player.professions.length
    )
  }

  protected newFromPool(
    player: Player,
    excludeId: number | undefined = undefined
  ): Profession | undefined {
    const excluding = player.professions.map(profession => profession.id)

    if (excludeId !== undefined) {
      excluding.push(excludeId)
    }

    return sample(
      this.pool.filter(profession => !includes(excluding, profession.id))
    )
  }
}
