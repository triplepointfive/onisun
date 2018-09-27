import { sample } from 'lodash'
import {
  allAbilities,
  BodyArmor,
  Clan,
  Color,
  DamageType,
  Game,
  Gender,
  Level,
  Material,
  OneHandWeapon,
  PickUpItemsEvent,
  Player,
  PlayerAI,
  PlayerBorgAI,
  ProtectionType,
  PutOnItemEvent,
} from './engine'
import { Scroll } from './engine/models/item'
import { Critical } from './engine/models/specie'
import { Dispatcher } from './onisun/ai'
import { TitleDungeon } from './onisun/dungeons/title_dungeon'
import {
  commonBow,
  ironArrow,
  LightSpeedBoots,
  smallRock,
  woodenArrow,
} from './onisun/items'
import {
  AttributesSelectionMenu,
  Menu,
  ChooseRaceMenu,
  MainMenu,
} from './onisun/menus'
import {
  OnisunAttackerProfession,
  OnisunDefenderProfession,
  OnisunProfessionPicker,
} from './onisun/professions'
import { allRaces, humanRace } from './onisun/races'
import { ProfessionPicker } from './engine/models/profession'

export * from './engine'
export * from './onisun/ai'
export * from './onisun/items'
export * from './onisun/menus'
export * from './onisun/professions'
export * from './onisun/races'
export * from './onisun/talents'

const critical: Critical = { chance: 0.05, multiplier: 2 }

export class TmpApplication {
  public game: Onisun
  constructor() {
    this.game = new Onisun(this.initPlayer())

    const dungeon = new TitleDungeon()
    dungeon.register(this.game)
    dungeon.enter(this.game, this.game.player)

    const player = this.game.player
    player.professions.push(new OnisunAttackerProfession())
    player.professions.push(new OnisunDefenderProfession())

    const dagger = new OneHandWeapon('Кинжал', 0.8, Material.iron, [
      { type: DamageType.Melee, dice: { times: 1, max: 3 }, extra: 2 },
    ])
    const katana = new OneHandWeapon('Катана', 1, Material.iron, [
      { type: DamageType.Melee, dice: { times: 5, max: 2 }, extra: 0 },
    ])
    const plateArmor = new BodyArmor('Латы', 1, Material.iron, [
      { type: ProtectionType.Heavy, value: 5 },
    ])
    const scroll = new Scroll('Свиток ххх')

    const wooden = woodenArrow()
    const iron = ironArrow()
    const rock = smallRock()

    const bow = commonBow()

    if (this.game.currentMap) {
      const tile = this.game.currentMap.creatureTile(player)

      tile.addItem(dagger, 2)
      tile.addItem(katana, 1)
      tile.addItem(plateArmor, 1)
      tile.addItem(wooden, 5)
      tile.addItem(iron, 5)
      tile.addItem(rock, 5)
      tile.addItem(bow, 2)
      tile.addItem(scroll, 20)

      player.on(
        new PickUpItemsEvent(
          tile,
          [
            { item: dagger, count: 2 },
            { item: katana, count: 1 },
            { item: plateArmor, count: 1 },
            { item: wooden, count: 5 },
            { item: iron, count: 5 },
            { item: rock, count: 5 },
            { item: bow, count: 2 },
            { item: scroll, count: 20 },
          ],
          this.game
        )
      )

      player.on(
        new PutOnItemEvent(player.inventory.missileWeaponSlot, bow, this.game)
      )
      player.on(
        new PutOnItemEvent(player.inventory.missileSlot, wooden, this.game)
      )
      player.on(
        new PutOnItemEvent(player.inventory.rightHandSlot, katana, this.game)
      )
      player.on(
        new PutOnItemEvent(player.inventory.chestSlot, plateArmor, this.game)
      )

      player.addItem(new LightSpeedBoots(), 1)

      this.game.logger.reset()
    }
  }

  protected initPlayer(): Player {
    return new Player(
      new Level([1, 3, 5, 10, 20]),
      new PlayerAI(),
      {
        name: 'Player',
        weight: 80,
        clan: Clan.Player,
        abilities: allAbilities,
        protections: [],
        damages: [],
        maxHealthValue: 10,
        regenerationRate: 30,
        regenerationValue: 1,
        resistances: [],
        visionRadius: 10,
        moveSpeed: 20,
        attackSpeed: 20,
        bodyControl: 5,
        leavesCorpseRatio: 0,
        material: Material.flesh,
        throwingDamages: [],

        race: humanRace,
        gender: Gender.Male,
        eyeColor: Color.Aqua,
        hairColor: Color.Fuchsia,
        skinColor: Color.Purple,
        height: 100,

        critical,
      },
      12,
      12,
      15
    )
  }
}

export class Onisun extends Game {
  constructor(player: Player) {
    super(player, new OnisunProfessionPicker())
  }
}

export class TitleGame extends Game {
  public turn(): void {
    super.turn()

    if (this.currentMap && this.playerTurn) {
      this.player.ai.endTurn(this, this.currentMap)
    }
  }

  get done(): boolean {
    return this.player.dead || this.turns > 150
  }
}

export class Application {
  public menu: Menu

  constructor() {
    // this.menu = new MainMenu(this)
    this.menu = new AttributesSelectionMenu(
      Gender.Male,
      humanRace,
      new OnisunAttackerProfession(),
      this
    )
  }

  public titleGame() {
    let player = new Player(
        new Level([1, 3, 5, 10, 20]),
        new PlayerBorgAI(new Dispatcher()),
        {
          name: 'Player',
          weight: 80,
          clan: Clan.Player,
          abilities: allAbilities,
          protections: [],
          damages: [
            { type: DamageType.Pure, dice: { times: 3, max: 3 }, extra: 1 },
          ],
          maxHealthValue: 10,
          regenerationRate: 1,
          regenerationValue: 1,
          resistances: [],
          visionRadius: 10,
          moveSpeed: 20,
          attackSpeed: 20,
          bodyControl: 5,
          leavesCorpseRatio: 0,
          material: Material.flesh,
          throwingDamages: [],

          race: sample(allRaces) || humanRace,
          gender: Gender.Male,
          eyeColor: Color.Aqua,
          hairColor: Color.Fuchsia,
          skinColor: Color.Purple,
          height: 100,
          critical,
        },
        12,
        12,
        15
      ),
      game = new TitleGame(player, new OnisunProfessionPicker()),
      dungeon = new TitleDungeon()

    dungeon.register(game)
    dungeon.enter(game, player)

    return game
  }
}
