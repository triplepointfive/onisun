import { Application } from '../onisun'
import { allRaces, humanRace } from './races'
import { OnisunProfessionPicker } from './professions'

import {
  TalentsPresenter,
  Gender,
  Race,
  PrimaryAttributes,
  Player,
  Profession,
  Talent,
  PickTalentEvent,
} from '../engine'

import { sample, mergeWith } from 'lodash'
import { PlayerAI } from '../engine/ai/player_ai'

export enum MenuComponent {
  MainMenu,

  ChooseGenderMenu,
  ChooseRaceMenu,
  ChooseProfessionMenu,
  AttributesSelectionMenu,
  EnterNameMenu,
  BackgroundMenu,
  TalentsMenu,
}

export abstract class Menu {
  constructor(protected application: Application) {}

  abstract get component(): MenuComponent

  protected redirect(menu: Menu): void {
    this.application.menu = menu
  }
}

export class MainMenu extends Menu {
  get component(): MenuComponent {
    return MenuComponent.MainMenu
  }

  public newGame(): void {
    this.redirect(new ChooseGenderMenu(this.application))
  }

  public randomPlayer(): void {
    this.redirect(
      new BackgroundMenu(
        this.application.randomPlayer(new PlayerAI()),
        this.application
      )
    )
  }
}

export class ChooseGenderMenu extends Menu {
  get component(): MenuComponent {
    return MenuComponent.ChooseGenderMenu
  }

  public withGender(gender: Gender): void {
    this.redirect(new ChooseRaceMenu(gender, this.application))
  }

  public random(): void {
    this.withGender(sample([Gender.Male, Gender.Female]) || Gender.Female)
  }

  public back(): void {
    this.application.menu = new MainMenu(this.application)
  }
}

export class ChooseRaceMenu extends Menu {
  constructor(public gender: Gender, application: Application) {
    super(application)
  }

  get component(): MenuComponent {
    return MenuComponent.ChooseRaceMenu
  }

  public withRace(race: Race): void {
    this.redirect(new ChooseProfessionMenu(this.gender, race, this.application))
  }

  public random(): void {
    this.withRace(sample(allRaces) || humanRace)
  }

  public back(): void {
    this.application.menu = new ChooseGenderMenu(this.application)
  }
}

export class ChooseProfessionMenu extends Menu {
  public readonly professions: Profession[]

  constructor(
    public gender: Gender,
    public race: Race,
    application: Application
  ) {
    super(application)

    // TODO: Optimize
    this.professions = new OnisunProfessionPicker().pool
  }

  public withProfession(profession: Profession): void {
    this.redirect(
      new AttributesSelectionMenu(
        this.gender,
        this.race,
        profession,
        this.application
      )
    )
  }

  get component(): MenuComponent {
    return MenuComponent.ChooseProfessionMenu
  }

  public back(): void {
    this.redirect(new ChooseRaceMenu(this.gender, this.application))
  }
}

export class AttributesSelectionMenu extends Menu {
  public readonly attributeNames: string[]
  public readonly racialAttributes: PrimaryAttributes
  public readonly genderAttributes: PrimaryAttributes
  public readonly baseAttributes: PrimaryAttributes

  constructor(
    public gender: Gender,
    public race: Race,
    public profession: Profession,
    application: Application
  ) {
    super(application)

    this.attributeNames = Object.keys(this.race.primaryAttributes)

    this.racialAttributes = this.race.primaryAttributes
    this.genderAttributes = this.calcGenderAttributes(gender)

    this.baseAttributes = this.sumAttributes(
      this.racialAttributes,
      this.genderAttributes
    )
  }

  get component(): MenuComponent {
    return MenuComponent.AttributesSelectionMenu
  }

  get points(): number {
    return 200
  }

  public ready(deltaAttributes: PrimaryAttributes): void {
    this.redirect(
      new EnterNameMenu(
        this.gender,
        this.race,
        this.profession,
        this.sumAttributes(this.baseAttributes, deltaAttributes),
        this.application
      )
    )
  }

  public back(): void {
    this.redirect(
      new ChooseProfessionMenu(this.gender, this.race, this.application)
    )
  }

  private calcGenderAttributes(gender: Gender): PrimaryAttributes {
    if (gender === Gender.Male) {
      return {
        strength: 1,
        dexterity: -1,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      }
    } else {
      return {
        strength: -1,
        dexterity: 1,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      }
    }
  }

  private sumAttributes(
    attr1: PrimaryAttributes,
    attr2: PrimaryAttributes
  ): PrimaryAttributes {
    return mergeWith({}, attr1, attr2, (x, y) => {
      if (x) {
        return x + y
      }
    })
  }
}

export class EnterNameMenu extends Menu {
  constructor(
    public gender: Gender,
    public race: Race,
    public profession: Profession,
    public attributes: PrimaryAttributes,
    application: Application
  ) {
    super(application)
  }

  get component(): MenuComponent {
    return MenuComponent.EnterNameMenu
  }

  get maxLength(): number {
    return 20
  }

  public withName(name: string): void {
    const parentsProfession = sample(new OnisunProfessionPicker().pool)

    if (!parentsProfession) {
      throw 'EnterNameMenu: failed to get parentsProfession'
    }

    this.redirect(
      new BackgroundMenu(
        this.application.newPlayer(
          this.gender,
          this.race,
          this.profession,
          this.attributes,
          name,
          parentsProfession
        ),
        this.application
      )
    )
  }

  public back(): void {
    this.redirect(
      new AttributesSelectionMenu(
        this.gender,
        this.race,
        this.profession,
        this.application
      )
    )
  }
}

export class BackgroundMenu extends Menu {
  constructor(public player: Player, application: Application) {
    super(application)
  }

  get component(): MenuComponent {
    return MenuComponent.BackgroundMenu
  }

  public next(): void {
    this.redirect(new TalentsMenu(this.player, this.application))
  }
}

export class TalentsMenu extends Menu {
  public points: number
  public talentsPage: { professions: Profession[] }

  constructor(public player: Player, application: Application) {
    super(application)

    this.points = 3 // TODO ?
    this.talentsPage = { professions: player.professions }
  }

  public pickTalent(profession: Profession, talent: Talent): void {
    if (this.points > 0) {
      this.points -= 1
      this.player.on(new PickTalentEvent(profession, talent))
    }

    if (this.points <= 0) {
      this.application.initGame(this.player)
    }
  }

  get component(): MenuComponent {
    return MenuComponent.TalentsMenu
  }
}
