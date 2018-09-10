export interface Material {
  readonly insulator: boolean
  readonly firm: boolean
  readonly fragile: boolean
}

export namespace Material {
  export const cloth = {
    insulator: false,
    firm: false,
    fragile: false,
  }

  export const flesh = {
    insulator: true,
    firm: true,
    fragile: false,
  }

  export const glass = {
    insulator: false,
    firm: false,
    fragile: true,
  }

  export const iron = {
    insulator: true,
    firm: true,
    fragile: false,
  }

  export const leather = {
    insulator: false,
    firm: false,
    fragile: false,
  }

  export const stone = {
    insulator: true,
    firm: true,
    fragile: false,
  }

  export const wood = {
    insulator: true,
    firm: true,
    fragile: false,
  }
}
