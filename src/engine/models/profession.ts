import { Player } from './creature'

import { includes, sample } from 'lodash'
import { Talent } from './talent'

export class Profession {
  public talents: Talent[] = []
  public readonly depthCost: number = 3

  constructor(
    public readonly id: number,
    public readonly name: string,
    public level: number = 1,
    public points: number = 0
  ) {}
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
