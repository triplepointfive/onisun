import { ProfessionPicker, Profession, Player } from '../engine'
import { AttackerTwoHandedWeapons } from './talents'

enum OnisunProfessionId {
  Attacker,
  Defender,
}

export class OnisunAttackerProfession extends Profession {
  constructor(level: number = 1) {
    super(OnisunProfessionId.Attacker, 'Оружейник', level)

    this.talents.push(new AttackerTwoHandedWeapons())
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
