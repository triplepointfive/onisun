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
import {
  woodenArrow,
  ironArrow,
  commonBow,
  smallRock,
  LightSpeedBoots,
} from './onisun/items'
import { TutorialDungeon } from './onisun/dungeons/tutorial_dungeon'
import { PickUpItemsEvent } from './engine/events/pick_up_items_event'

export * from './onisun/professions'
export * from './onisun/talents'
export * from './onisun/items'
export * from './onisun/tiles'

export class Application {
  public game: Onisun
  constructor() {
    this.game = new Onisun(this.initPlayer())

    const dungeon = new TutorialDungeon()
    dungeon.register(this.game)
    dungeon.enter(this.game, this.game.player)

    const player = this.game.player,
    prof = this.game.professionPicker.available(player)[1]
    if (prof) {
      player.professions.push(prof)
    }

    const dagger = new OneHandWeapon('Dagger', 0.8, new Modifier({ attack: 3 }))
    const katana = new OneHandWeapon('Katana', 1, new Modifier({ attack: 10 }))

    const wooden = woodenArrow()
    const iron = ironArrow()
    const rock = smallRock()

    const bow = commonBow()

    const tile = this.game.currentMap.creatureTile(player)

    tile.addItem(dagger, 2)
    tile.addItem(katana, 1)
    tile.addItem(wooden, 5)
    tile.addItem(iron, 5)
    tile.addItem(rock, 5)
    tile.addItem(bow, 2)

    player.on(
      new PickUpItemsEvent(
        tile,
        [
          { item: dagger, count: 2 },
          { item: katana, count: 1 },
          { item: wooden, count: 5 },
          { item: iron, count: 5 },
          { item: rock, count: 5 },
          { item: bow, count: 2 },
        ],
        this.game
      )
    )

    player.inventory.missileWeaponSlot.equip(player, bow)
    player.inventory.missileSlot.equip(player, wooden)

    player.inventory.putToBag(new LightSpeedBoots(), 1)
  }

  protected initPlayer(): Player {
    return new Player(
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
      new Specie('Player', 80, Clan.Player, allAbilities)
    )
  }
}

export class Onisun extends Game {
  constructor(player: Player) {
    super(player, new OnisunProfessionPicker(player))
  }
}
