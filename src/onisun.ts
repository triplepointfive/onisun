import {
  allAbilities,
  Clan,
  Color,
  Critical,
  DamageType,
  Game,
  Gender,
  Level,
  Material,
  PickProfessionEvent,
  Player,
  PlayerAI,
  PlayerBorgAI,
  PrimaryAttributes,
  Profession,
  Race,
} from './engine'
import { Dispatcher } from './onisun/ai'
import { TitleDungeon } from './onisun/dungeons/title_dungeon'
import { BackgroundMenu, Menu, MainMenu } from './onisun/menus'
import {
  OnisunAttackerProfession,
  OnisunProfessionPicker,
} from './onisun/professions'
import { humanRace } from './onisun/races'

export * from './engine'
export * from './onisun/ai'
export * from './onisun/items'
export * from './onisun/menus'
export * from './onisun/professions'
export * from './onisun/races'
export * from './onisun/talents'

const critical: Critical = { chance: 0.05, multiplier: 2 }

export class Onisun extends Game {
  constructor(player: Player) {
    super(player, new OnisunProfessionPicker())

    const dungeon = new TitleDungeon()
    dungeon.register(this)
    dungeon.enter(this, player)
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
  public menu: Menu | null = null
  public mainGame: Onisun | null = null

  constructor() {
    this.menu = new MainMenu(this)
  }

  public initGame(player: Player) {
    this.mainGame = new Onisun(player)
    this.menu = null
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

  public randomPlayer(ai: PlayerAI): Player {
    return this.newPlayer(
      Gender.Male,
      humanRace,
      new OnisunAttackerProfession(),
      humanRace.primaryAttributes,
      'AI',
      new OnisunAttackerProfession(),
      ai
    )
  }

  public newTitleGame() {
    let player = this.randomPlayer(new PlayerBorgAI(new Dispatcher())),
      game = new TitleGame(player, new OnisunProfessionPicker()),
      dungeon = new TitleDungeon()

    dungeon.register(game)
    dungeon.enter(game, player)

    return game
  }
}
