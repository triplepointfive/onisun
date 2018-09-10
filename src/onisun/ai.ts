import {
  MetaAI,
  Escaper,
  Explorer,
  Chaser,
  Attacker,
  Picker,
  Patrol,
  Loiter,
  Thrower,
  Descender,
  Creature,
  LevelMap,
  Game,
  CreatureEvent,
  SelfHealer,
} from '../engine'

export class Dispatcher extends MetaAI {
  private escaper: Escaper
  private explorer: Explorer
  private chaser: Chaser
  private attacker: Attacker
  private picker: Picker
  private patrol: Patrol
  private loiter: Loiter
  private thrower: Thrower

  private descender: Descender

  constructor() {
    super()
    this.escaper = new Escaper()
    this.explorer = new Explorer()
    this.chaser = new Chaser()
    this.attacker = new Attacker()
    this.picker = new Picker()
    this.patrol = new Patrol()
    this.loiter = new Loiter()
    this.thrower = new Thrower()

    this.descender = new Descender()
  }

  public act(
    actor: Creature,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    this.runEvents()
    let event: CreatureEvent | undefined

    if (this.feelsGood(actor)) {
      if ((event = this.attacker.act(actor, levelMap, game))) {
      } else if ((event = this.thrower.act(actor, levelMap, game))) {
      } else if ((event = this.chaser.act(actor, levelMap, game))) {
      } else if ((event = this.picker.act(actor, levelMap, game))) {
      } else {
        event = this.explore(actor, levelMap, game)
      }
    } else if (
      this.healthCritical(actor) &&
      (event = this.escaper.act(actor, levelMap, game))
    ) {
    } else if ((event = this.attacker.act(actor, levelMap, game))) {
    } else if ((event = this.thrower.act(actor, levelMap, game))) {
    } else if ((event = this.chaser.act(actor, levelMap, game))) {
    } else {
      event = new SelfHealer().act(actor, levelMap)
    }

    this.resetEvents()

    return event
  }

  private feelsGood(actor: Creature): boolean {
    return actor.health.currentValue > actor.health.maximum * 0.9
  }

  private healthCritical(actor: Creature): boolean {
    return actor.health.currentValue < actor.health.maximum / 4
  }

  private explore(
    actor: Creature,
    levelMap: LevelMap,
    game: Game
  ): CreatureEvent | undefined {
    let event: CreatureEvent | undefined

    if ((event = this.explorer.act(actor, levelMap, game))) {
      if (!actor.dead) {
        this.patrol.trackMovement(
          levelMap.creaturePos(actor),
          levelMap.creatureTile(actor)
        )
      }
    } else if ((event = this.descender.act(actor, levelMap, game))) {
    } else if ((event = this.patrol.act(actor, levelMap, game))) {
    } else {
      event = this.loiter.act(actor, levelMap, game)
    }

    return event
  }
}
