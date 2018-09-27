import { sample } from 'lodash'
import {
  allAbilities,
  BodyArmor,
  Clan,
  Color,
  Critical,
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
  PrimaryAttributes,
  Profession,
  ProtectionType,
  PutOnItemEvent,
  Race,
  Scroll,
  PickProfessionEvent,
} from './engine'
import { Dispatcher } from './onisun/ai'
import { TitleDungeon } from './onisun/dungeons/title_dungeon'
import {
  commonBow,
  ironArrow,
  LightSpeedBoots,
  smallRock,
  woodenArrow,
} from './onisun/items'
import { MainMenu, Menu, BackgroundMenu } from './onisun/menus'
import {
  OnisunAttackerProfession,
  OnisunDefenderProfession,
  OnisunProfessionPicker,
} from './onisun/professions'
import { allRaces, humanRace } from './onisun/races'

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
    return new Application().randomPlayer()
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
    this.menu = new BackgroundMenu(this.randomPlayer(), this)
  }

  public newPlayer(
    gender: Gender,
    race: Race,
    profession: Profession,
    attributes: PrimaryAttributes,
    name: string,
    parentsProfession: Profession,
    ai: PlayerAI = new PlayerAI()
  ) {
    let player = new Player(
      new Level([1, 3, 5, 10, 20]), // TODO
      ai,
      {
        name: name,
        race: race,
        gender: gender,
        clan: Clan.Player,
        abilities: allAbilities,
        leavesCorpseRatio: 0,

        ownProfession: profession,
        parentsProfession: parentsProfession,

        // TODO: Review the rest

        weight: 80,
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
        material: Material.flesh,
        throwingDamages: [],

        eyeColor: Color.Aqua,
        hairColor: Color.Fuchsia,
        skinColor: Color.Purple,

        height: 100,
        critical,
      },
      attributes
    )

    player.on(new PickProfessionEvent(profession))
    player.on(new PickProfessionEvent(parentsProfession))

    return player
  }

  public randomPlayer(): Player {
    return this.newPlayer(
      Gender.Male,
      humanRace,
      new OnisunDefenderProfession(),
      {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      'AI',
      new OnisunDefenderProfession(),
      new PlayerBorgAI(new Dispatcher())
    )
  }

  public newTitleGame() {
    let player = this.randomPlayer(),
      game = new TitleGame(player, new OnisunProfessionPicker()),
      dungeon = new TitleDungeon()

    dungeon.register(game)
    dungeon.enter(game, player)

    return game
  }
}
