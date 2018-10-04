import { includes } from 'lodash'
import { Game, GroupedItem, ImpactBunch, LevelMap, Memory } from '../../engine'
import { MetaAI } from '../ai/meta_ai'
import { AfterEvent } from '../events/after_event'
import { CreatureEvent, Reaction } from '../events/internal'
import { ItemsBunch } from '../lib/bunch'
import { ImpactType } from '../lib/impact'
import { buildFov } from '../lib/map_fov'
import { HealthStat } from '../lib/stat'
import { Item, Missile, Protection } from './item'
import { Damage } from '../lib/damage'
import { CreatureSpecie, Resistance } from './specie'
import { CoolDown } from '../utils/cool_down';

export enum Clan {
  Player,
  PlayerOnlyEnemy,
  FreeForAll,
}

export enum Ability {
  GoStairway,
  Inventory,
  Throwing,

  KnockWeaponOut,
}

export type CreatureId = number

export abstract class Creature<Specie extends CreatureSpecie = CreatureSpecie> {
  private static lastId: CreatureId = 0
  public static getId(): CreatureId {
    return this.lastId++
  }

  protected stageMemories: Map<string, Memory> = new Map()

  public dead: boolean = false

  public health: HealthStat
  public coolDown: CoolDown<Ability>

  constructor(public specie: Specie, public id: CreatureId = Creature.getId()) {
    this.health = new HealthStat(specie)
    this.coolDown = new CoolDown()
  }

  get name(): string {
    return this.specie.name
  }

  get clan(): Clan {
    return this.specie.clan
  }

  get protections(): Protection[] {
    return this.specie.protections
  }

  get throwDamages(): Damage[] {
    return this.specie.throwingDamages
  }

  get damages(): Damage[] {
    return this.specie.damages
  }

  public can(ability: Ability) {
    return includes(this.specie.abilities, ability)
  }

  public on(event: CreatureEvent): Reaction {
    return event.affectCreature(this)
  }

  get speed(): number {
    return this.specie.moveSpeed
  }

  public stageMemory(levelMap: LevelMap): Memory {
    const memory = this.stageMemories.get(levelMap.name)

    if (memory) {
      return memory
    }

    return this.visionMask(levelMap)
  }

  public visionMask(levelMap: LevelMap): Memory {
    let memory = this.stageMemories.get(levelMap.name)

    if (memory) {
      memory.resetVisible()
    } else {
      memory = new Memory(levelMap.width, levelMap.height)

      this.stageMemories.set(levelMap.name, memory)
    }

    buildFov(levelMap.creaturePos(this), this.visionRadius, memory, levelMap)

    return memory
  }

  public abstract act(levelMap: LevelMap, game: Game): number

  private _impactsBunch: ImpactBunch | undefined

  get impactsBunch(): ImpactBunch {
    if (!this._impactsBunch) {
      this._impactsBunch = new ImpactBunch()
    }

    return this._impactsBunch
  }

  public hasImpact(type: ImpactType): boolean {
    return includes(this.impacts, type)
  }

  public addConstImpact(type: ImpactType, effect: string): void {
    this.impactsBunch.addConstImpact(type, effect)
  }

  public addImpact(type: ImpactType, turns: number): void {
    this.impactsBunch.addImpact(type, turns)
  }

  public removeConstImpact(type: ImpactType, effect: string): void {
    this.impactsBunch.removeConstImpact(type, effect)
  }

  public removeImpact(type: ImpactType): void {
    this.impactsBunch.removeImpact(type)
  }

  get visionRadius(): number {
    if (this.hasImpact(ImpactType.Blind)) {
      return 0
    }

    return this.specie.visionRadius
  }

  get bodyControl(): number {
    return this.specie.bodyControl
  }

  get impacts(): ImpactType[] {
    return this.impactsBunch.activeImpacts
  }

  public hasResistance(resistance: Resistance): boolean {
    return includes(this.resistances, resistance)
  }

  get resistances(): Resistance[] {
    return this.specie.resistances
  }

  get weightWithCarryings(): number {
    return this.specie.weight
  }

  abstract get missile(): GroupedItem<Missile> | undefined
  abstract get inventoryItems(): GroupedItem<Item>[]

  public abstract addItem(item: Item, count: number): void
  public abstract removeItem(item: Item, count: number): void

  public statsTurn(): void {
    this.coolDown.turn()
    this.health.turn()

    if (this._impactsBunch) {
      // TODO: When ran out - disappear
      this._impactsBunch.turn()
    }
  }
}

export class AICreature extends Creature {
  private bag?: ItemsBunch<Item>

  constructor(
    public ai: MetaAI,
    specie: CreatureSpecie,
    id: CreatureId = Creature.getId()
  ) {
    super(specie, id)
  }

  public act(levelMap: LevelMap, game: Game): number {
    this.statsTurn()
    this.visionMask(levelMap)

    const command = this.ai.act(this, levelMap, game)
    if (command) {
      this.on(command)
    }
    this.on(new AfterEvent(levelMap, game))

    return this.speed
  }

  get missile(): GroupedItem<Missile> | undefined {
    // TODO: Remove perpetuum items?
    if (this.specie.throwingItem) {
      return { item: this.specie.throwingItem, count: 1 }
    }
  }

  get inventoryItems(): GroupedItem<Item>[] {
    return this.bag ? this.bag.bunch : []
  }

  public addItem(item: Item, count: number): void {
    if (!this.bag) {
      this.bag = new ItemsBunch()
    }

    this.bag.put(item, count)
  }

  public removeItem(item: Item, count: number): void {
    if (!this.bag) {
      throw `Creature ${this.name} tried to remove item ${
        item.name
      } but it does not present`
    }

    this.bag.remove(item, count)
  }
}
