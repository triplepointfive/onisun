import { Talent, Player } from '../engine'
import { ProtectionType } from '../engine/models/item'

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

export class DefenderSteelSkin extends OnisunTalent {
  protected onObtain(player: Player): void {
    player.specie.protections.push({ type: ProtectionType.Unarmored, value: 1 })
  }
}

export class DefenderBattleShield extends OnisunTalent {
  protected onObtain(player: Player): void {

  }
}
