import { ProfessionPicker, Profession, Player } from '../engine'

enum OnisunProfessionId {
  Attacker,
  Defender,
}

export class OnisunAttackerProfession extends Profession {
  constructor(level: number = 1) {
    super(OnisunProfessionId.Attacker, 'Оружейник', level)
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
