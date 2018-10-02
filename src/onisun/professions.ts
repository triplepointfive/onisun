import { ProfessionPicker, Profession, Player, Talent } from '../engine'
import {
  AttackerTwoHandedWeapons,
  AttackerStrongGrip,
  DefenderSteelSkin,
} from './talents'

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
    super(OnisunProfessionId.Attacker, 'warrior', level, 0, [strongGrip])
  }

  get depthCost(): number {
    return 5
  }

  get grid(): (Talent | undefined)[][] {
    return [[undefined, this.strongGrip, undefined]]
  }
}

export class OnisunDefenderProfession extends Profession {
  constructor(
    level: number = 0,
    public steelSkin: DefenderSteelSkin = new DefenderSteelSkin(
      'steelSkin',
      0,
      0,
      5
    )
  ) {
    super(OnisunProfessionId.Defender, 'defender', level, 0, [steelSkin])
  }

  get depthCost(): number {
    return 5
  }

  get grid(): (Talent | undefined)[][] {
    return [[this.steelSkin]]
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
