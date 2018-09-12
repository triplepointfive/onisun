export interface Material {
  readonly corrodible: boolean
  readonly firm: boolean
  readonly fragile: boolean
  readonly insulator: boolean
}

export namespace Material {
  export const cloth: Material = {
    corrodible: false,
    firm: false,
    fragile: false,
    insulator: false,
  }

  export const flesh: Material = {
    corrodible: false,
    firm: true,
    fragile: false,
    insulator: true,
  }

  export const glass: Material = {
    corrodible: false,
    firm: false,
    fragile: true,
    insulator: false,
  }

  export const iron: Material = {
    corrodible: true,
    firm: true,
    fragile: false,
    insulator: true,
  }

  export const leather: Material = {
    corrodible: false,
    firm: false,
    fragile: false,
    insulator: false,
  }

  export const stone: Material = {
    corrodible: false,
    firm: true,
    fragile: false,
    insulator: true,
  }

  export const wood: Material = {
    corrodible: false,
    firm: true,
    fragile: false,
    insulator: true,
  }
}
