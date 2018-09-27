import { Gender, Race, PrimaryAttributes, Player } from '../engine'

import { Application } from '../onisun'
import { allRaces, humanRace } from './races'

import { sample, mergeWith } from 'lodash'
import { Profession } from '../engine/models/profession'
import { OnisunProfessionPicker } from './professions'

export enum MenuComponent {
  MainMenu,

  ChooseGenderMenu,
  ChooseRaceMenu,
  ChooseProfessionMenu,
  AttributesSelectionMenu,
  EnterNameMenu,
  BackgroundMenu,
  PickTalentsMenu,
}

export abstract class Menu {
  constructor(protected application: Application) {}

  abstract get component(): MenuComponent

  protected redirect(menu: Menu): void {
    this.application.menu = menu
  }
}

export class MainMenu extends Menu {
  public newGame(): void {
    this.redirect(new ChooseGenderMenu(this.application))
  }

  get component(): MenuComponent {
    return MenuComponent.MainMenu
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

    this.baseAttributes = mergeWith(
      {},
      this.racialAttributes,
      this.genderAttributes,
      (x, y) => {
        if (x) {
          return x + y
        }
      }
    )
  }

  get component(): MenuComponent {
    return MenuComponent.AttributesSelectionMenu
  }

  get points(): number {
    return 200
  }

  public ready(totalAttributes: PrimaryAttributes): void {
    this.redirect(
      new EnterNameMenu(
        this.gender,
        this.race,
        this.profession,
        totalAttributes,
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
}
