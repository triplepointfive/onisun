export interface PrimaryAttributes {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

export interface Race {
  readonly name: string
  readonly primaryAttributes: PrimaryAttributes
}
