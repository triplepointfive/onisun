import { Talent, Player } from '../engine'

export abstract class OnisunTalent extends Talent {
  constructor(name: string, depth: number, rank: number, maxRank: number) {
    super(name, depth, rank, maxRank)
  }
}

export class AttackerTwoHandedWeapons extends OnisunTalent {
  public onObtain(player: Player): void {}
}

export class AttackerLightWeapons extends OnisunTalent {
  public onObtain(player: Player): void {}
}

export class AttackerHeavyWeapons extends OnisunTalent {
  public onObtain(player: Player): void {}
}

export class AttackerTwoWeapons extends OnisunTalent {
  public onObtain(player: Player): void {}
}

export class AttackerDoubleTwoHandedWeapons extends OnisunTalent {
  public onObtain(player: Player): void {}
}

export class AttackerStrongGrip extends OnisunTalent {
  public onObtain(player: Player): void {}
}
