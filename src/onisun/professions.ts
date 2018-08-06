import { ProfessionPicker, Profession, Player, Talent } from '../engine'

export class OnisunTalent extends Talent {
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

// TODO: Validate all Talent's ids are uniq
export enum OnisunTalentId {
  AttackerTwoHandedWeapons,
  AttackerHeavyWeapons,
  AttackerLightWeapons,
  AttackerTwoWeapons,
  AttackerDoubleTwoHandedWeapons,
  AttackerStrongGrip,
}

enum OnisunProfessionId {
  Attacker,
  Defender,
}

export class OnisunAttackerProfession extends Profession {
  constructor(level: number = 1) {
    super(OnisunProfessionId.Attacker, 'Оружейник', level)

    this.talents.push(
      new OnisunTalent(
        OnisunTalentId.AttackerTwoHandedWeapons,
        'Двуручные оружия',
        0,
        0,
        3
      )
    )
    this.talents.push(
      new OnisunTalent(
        OnisunTalentId.AttackerLightWeapons,
        'Легкие оружия',
        0,
        0,
        3
      )
    )
    this.talents.push(
      new OnisunTalent(
        OnisunTalentId.AttackerHeavyWeapons,
        'Тяжелые оружия',
        0,
        0,
        3
      )
    )

    this.talents.push(
      new OnisunTalent(
        OnisunTalentId.AttackerTwoWeapons,
        'Два оружия',
        1,
        0,
        1,
        'Позволяет брать оружие в каждую руку'
      )
    )
    // this.talents.push(new OnisunTalent(OnisunTalentId.Defender, 'Быстрые удары', 1, 0, 3))
    // this.talents.push(new OnisunTalent(OnisunTalentId.Defender, 'Мощный удар', 1, 0, 4))
    // this.talents.push(new OnisunTalent(OnisunTalentId.Defender, 'Выбивание оружия', 1, 0, 5))

    this.talents.push(
      new OnisunTalent(
        OnisunTalentId.AttackerDoubleTwoHandedWeapons,
        'Два двуручных оружия',
        2,
        0,
        2
      )
    )
    // this.talents.push(new OnisunTalent(OnisunTalentId.Defender, '- серия', 2, 0, 2))
    this.talents.push(
      new OnisunTalent(
        OnisunTalentId.AttackerStrongGrip,
        'Крепкий хват',
        2,
        0,
        2,
        'Оружие не выбивается из рук'
      )
    )
  }
}

export class OnisunDefenderProfession extends Profession {
  constructor(level: number = 1) {
    super(OnisunProfessionId.Defender, 'Защитник', level)
  }
}

export class OnisunProfessionPicker extends ProfessionPicker {
  constructor(
    player: Player,
    public attacker = new OnisunAttackerProfession(),
    public defender = new OnisunDefenderProfession()
  ) {
    super([attacker, defender], 3, 6)
  }
}
