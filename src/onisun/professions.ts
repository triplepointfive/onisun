import { ProfessionPicker, Profession, Player, Talent } from '../engine'
import { AttackerTwoHandedWeapons, AttackerStrongGrip } from './talents'

enum OnisunProfessionId {
  Attacker,
  Defender,
}

export class OnisunAttackerProfession extends Profession {
  constructor(
    level: number = 0,
    public strongGrip: AttackerStrongGrip = new AttackerStrongGrip(
      'strongGrip',
      1,
      0,
      5
    )
  ) {
    super(OnisunProfessionId.Attacker, 'warrior', level, 0, [
      strongGrip,
    ])
  }

  get depthCost(): number {
    return 5
  }

  get grid(): (Talent | undefined)[][] {
    return [
      [undefined, this.strongGrip, undefined],
    ]
  }
}

export class OnisunDefenderProfession extends Profession {
  constructor(level: number = 0) {
    super(OnisunProfessionId.Defender, 'defender', level, 0, [])
  }

  get depthCost(): number {
    return 5
  }

  get grid(): (Talent | undefined)[][] {
    return []
  }
}

export class OnisunProfessionPicker extends ProfessionPicker {
  constructor(
    public attacker = new OnisunAttackerProfession(),
    public defender = new OnisunDefenderProfession()
  ) {
    super([attacker, defender], 3, 6)
  }
}
