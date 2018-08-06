import { Talent, Game } from '../engine'

// TODO: Validate all Talent's ids are uniq
export enum OnisunTalentId {
  AttackerTwoHandedWeapons,
  AttackerHeavyWeapons,
  AttackerLightWeapons,
  AttackerTwoWeapons,
  AttackerDoubleTwoHandedWeapons,
  AttackerStrongGrip,
}

export abstract class OnisunTalent extends Talent {
  constructor(
    id: number,
    name: string,
    depth: number,
    rank: number,
    maxRank: number,
    description: string = ''
  ) {
    super(id, name, depth, rank, maxRank, description)
  }
}

export class AttackerTwoHandedWeapons extends OnisunTalent {
  constructor() {
    super(OnisunTalentId.AttackerTwoHandedWeapons, 'Двуручные оружия', 0, 0, 3)
  }

  public onObtain(game: Game): void {}
}

export class AttackerLightWeapons extends OnisunTalent {
  constructor() {
    super(OnisunTalentId.AttackerLightWeapons, 'Легкие оружия', 0, 0, 3)
  }

  public onObtain(game: Game): void {}
}

export class AttackerHeavyWeapons extends OnisunTalent {
  constructor() {
    super(OnisunTalentId.AttackerHeavyWeapons, 'Тяжелые оружия', 0, 0, 3)
  }

  public onObtain(game: Game): void {}
}

export class AttackerTwoWeapons extends OnisunTalent {
  constructor() {
    super(
      OnisunTalentId.AttackerTwoWeapons,
      'Два оружия',
      1,
      0,
      1,
      'Позволяет брать оружие в каждую руку'
    )
  }

  public onObtain(game: Game): void {}
}

export class AttackerDoubleTwoHandedWeapons extends OnisunTalent {
  constructor() {
    super(
      OnisunTalentId.AttackerDoubleTwoHandedWeapons,
      'Два двуручных оружия',
      2,
      0,
      2
    )
  }

  public onObtain(game: Game): void {}
}

export class AttackerStrongGrip extends OnisunTalent {
  constructor() {
    super(
      OnisunTalentId.AttackerStrongGrip,
      'Крепкий хват',
      2,
      0,
      2,
      'Оружие не выбивается из рук'
    )
  }

  public onObtain(game: Game): void {}
}
