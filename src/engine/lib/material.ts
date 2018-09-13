export enum WaterAffect {
  Corrosion,
  Destroy,
}

export interface Material {
  readonly affectedWithWater?: WaterAffect
  readonly firm: boolean
  readonly fragile: boolean
  readonly insulator: boolean
}

export namespace Material {
  export const cloth: Material = {
    affectedWithWater: undefined,
    firm: false,
    fragile: false,
    insulator: false,
  }

  export const flesh: Material = {
    affectedWithWater: undefined,
    firm: true,
    fragile: false,
    insulator: true,
  }

  export const glass: Material = {
    affectedWithWater: undefined,
    firm: false,
    fragile: true,
    insulator: false,
  }

  export const iron: Material = {
    affectedWithWater: WaterAffect.Corrosion,
    firm: true,
    fragile: false,
    insulator: true,
  }

  export const leather: Material = {
    affectedWithWater: undefined,
    firm: false,
    fragile: false,
    insulator: false,
  }

  export const paper: Material = {
    affectedWithWater: WaterAffect.Destroy,
    firm: false,
    fragile: false,
    insulator: true,
  }

  export const stone: Material = {
    affectedWithWater: undefined,
    firm: true,
    fragile: false,
    insulator: true,
  }

  export const wood: Material = {
    affectedWithWater: undefined,
    firm: true,
    fragile: false,
    insulator: true,
  }
}
