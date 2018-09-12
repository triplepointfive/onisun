import {} from '../helpers'
import {
  OneHandWeapon,
  Material,
  DamageType,
  ProtectionType,
  Protection,
  Damage,
  BodyArmor,
  CorrosionLevel,
} from '../../../src/engine'

describe('Weapon', () => {
  it('does nothing if material is not corrodible', () => {
    let item = new OneHandWeapon('test', 1, Material.glass, [])
    expect(item.corrosionLevel).toEqual(CorrosionLevel.None)

    item.corrode()
    expect(item.corrosionLevel).toEqual(CorrosionLevel.None)
  })

  it('corrosion', () => {
    const damages = (penalty: number): Damage[] => [
      { type: DamageType.Pure, dice: { times: 0, max: 0 }, extra: 3 - penalty },
    ]

    let item = new OneHandWeapon('test', 1, Material.iron, damages(0))
    expect(item.corrosionLevel).toEqual(CorrosionLevel.None)
    expect(item.damages).toEqual(damages(0))

    item.corrode()
    expect(item.corrosionLevel).toEqual(CorrosionLevel.Slightly)
    expect(item.damages).toEqual(damages(1))

    item.corrode()
    expect(item.corrosionLevel).toEqual(CorrosionLevel.Mostly)
    expect(item.damages).toEqual(damages(2))

    item.corrode()
    expect(item.corrosionLevel).toEqual(CorrosionLevel.Fully)
    expect(item.damages).toEqual(damages(4))

    item.corrode()
    expect(item.corrosionLevel).toEqual(CorrosionLevel.Fully)
    expect(item.damages).toEqual(damages(4))
  })
})

describe('Armor', () => {
  it('corrosion', () => {
    const protections = (penalty: number): Protection[] => [
      { type: ProtectionType.Heavy, value: 3 - penalty },
    ]

    let item = new BodyArmor('test', 1, Material.iron, protections(0))
    expect(item.corrosionLevel).toEqual(CorrosionLevel.None)
    expect(item.protections).toEqual(protections(0))

    item.corrode()
    expect(item.corrosionLevel).toEqual(CorrosionLevel.Slightly)
    expect(item.protections).toEqual(protections(1))

    item.corrode()
    expect(item.corrosionLevel).toEqual(CorrosionLevel.Mostly)
    expect(item.protections).toEqual(protections(2))

    item.corrode()
    expect(item.corrosionLevel).toEqual(CorrosionLevel.Fully)
    expect(item.protections).toEqual(protections(4))

    item.corrode()
    expect(item.corrosionLevel).toEqual(CorrosionLevel.Fully)
    expect(item.protections).toEqual(protections(4))
  })
})
