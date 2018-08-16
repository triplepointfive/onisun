import { Creature, Reaction, Player } from '../creature'
import { Item, Potion } from '../items'
import { Trap } from '../tile'
import { AINewLevelEvent } from '../ai'
import { Game } from '../game'

export abstract class CreatureEvent {
  public abstract affectCreature(subject: Creature): Reaction
  public affectPlayer(subject: Player): Reaction {
    return this.affectCreature(subject)
  }
}

export class AttackEvent extends CreatureEvent {
  constructor(public actor: Creature) {
    super()
  }

  public affectCreature(subject: Creature): Reaction {
    if (this.actor.characteristics.misses(subject.characteristics)) {
      subject.currentLevel.game.logger.missMessage(this.actor, subject)
      return Reaction.DODGE
    }

    const damage = this.actor.characteristics.damageTo(subject.characteristics)

    if (damage >= subject.characteristics.health.currentValue()) {
      this.actor.on(new AddExperienceEvent(subject))
      subject.currentLevel.game.logger.killMessage(damage, this.actor, subject)
      subject.die()
      return Reaction.DIE
    } else {
      subject.characteristics.health.decrease(damage)
      subject.currentLevel.game.logger.hurtMessage(damage, this.actor, subject)
      return Reaction.HURT
    }
  }
}

export class TrapEvent extends CreatureEvent {
  constructor(private trap: Trap) {
    super()
  }

  public affectCreature(actor: Creature): Reaction {
    const damage = 10,
      game = actor.currentLevel.game

    // TODO: Special messages for dying.
    if (game.player.stageMemory().at(actor.pos.x, actor.pos.y).visible) {
      if (game.player.id === actor.id) {
        game.logger.youSteppedInTrap()
      } else {
        game.logger.creatureSteppedInTrap(actor)
      }
    }

    if (damage >= actor.characteristics.health.currentValue()) {
      actor.die()
      return Reaction.DIE
    } else {
      actor.characteristics.health.decrease(damage)
      return Reaction.HURT
    }
  }
}

export class ThrowEvent extends CreatureEvent {
  constructor(public actor: Creature, public missile: Item) {
    super()
  }

  public affectCreature(subject: Creature): Reaction {
    if (this.actor.characteristics.throwMisses(subject.characteristics)) {
      subject.currentLevel.game.logger.throwMissMessage(
        this.actor,
        subject,
        this.missile
      )
      return Reaction.THROW_DODGE
    }

    const damage = this.actor.characteristics.throwDamageTo(
      subject.characteristics,
      this.missile
    )

    if (damage >= subject.characteristics.health.currentValue()) {
      this.actor.on(new AddExperienceEvent(subject))
      subject.currentLevel.game.logger.throwKillMessage(
        damage,
        this.actor,
        subject,
        this.missile
      )
      subject.die()
      return Reaction.DIE
    } else {
      subject.characteristics.health.decrease(damage)
      subject.currentLevel.game.logger.throwHurtMessage(
        damage,
        this.actor,
        subject,
        this.missile
      )
      return Reaction.HURT
    }
  }
}

export class AddExperienceEvent extends CreatureEvent {
  constructor(public actor: Creature) {
    super()
  }

  public affectCreature(subject: Creature): Reaction {
    return Reaction.NOTHING
  }

  public affectPlayer(subject: Player): Reaction {
    subject.level.add(1).forEach(level => {
      subject.ai.pushEvent(
        new AINewLevelEvent(level, subject.currentLevel.game)
      )
    })

    return Reaction.NOTHING
  }
}
