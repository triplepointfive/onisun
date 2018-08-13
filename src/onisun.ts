import {
  Clan,
  Player,
  Specie,
  allAbilities,
  OneHandWeapon,
  Modifier,
  Characteristics,
  Game,
  Level,
  PlayerAI,
} from './engine'

import { OnisunProfessionPicker } from './onisun/professions'
import { woodenArrow, ironArrow, commonBow, smallRock } from './onisun/items'
import { TutorialDungeon } from './onisun/dungeons/tutorial_dungeon'

export * from './onisun/professions'
export * from './onisun/talents'
export * from './onisun/items'

export class Onisun extends Game {
  public professionPicker: OnisunProfessionPicker

  constructor() {
    super()
    this.player = this.initPlayer()
    this.professionPicker = new OnisunProfessionPicker(this.player)
    this.player.professions.push(this.professionPicker.attacker)

    const dungeon = new TutorialDungeon(this)
    dungeon.build()
    dungeon.enter()
  }

  protected initPlayer(): Player {
    const playerSpecie = new Specie('Player', Clan.Player, allAbilities)

    let player = new Player(
      new Level([1, 3, 5, 10, 20]),
      new Characteristics({
        attack: 1,
        defense: 4,
        dexterity: 3,
        health: 100,
        radius: 10,
        speed: 80,
      }),
      new PlayerAI(),
      playerSpecie
    )

    const dagger = new OneHandWeapon('Dagger', new Modifier({ attack: 3 }))
    const katana = new OneHandWeapon('Katana', new Modifier({ attack: 10 }))

    const wooden = woodenArrow()
    const iron = ironArrow()
    const rock = smallRock()

    const bow = commonBow()

    player.inventory.putToBag(dagger, 2)
    player.inventory.putToBag(katana, 1)

    player.inventory.putToBag(wooden, 5)
    player.inventory.putToBag(iron, 5)
    player.inventory.putToBag(rock, 5)

    player.inventory.putToBag(bow, 2)

    // player.putOn(RightHandSlot, dagger)
    // player.inventory.missileWeaponSlot.equip(player, bow)
    player.inventory.missileSlot.equip(player, wooden)

    return player
  }
}
