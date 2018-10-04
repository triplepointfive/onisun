import { CoolDown } from '../../../src/engine'

describe('CoolDown', () => {
  let coolDown: CoolDown<string> = new CoolDown

  it('works', () => {
    const key1 = 'a', key2 = 'b'

    expect(coolDown.has(key1)).toBeFalsy()

    coolDown.add(key1, 1)
    coolDown.add(key2, 2)

    expect(coolDown.has(key1)).toBeTruthy()
    expect(coolDown.has(key2)).toBeTruthy()

    coolDown.turn()

    expect(coolDown.has(key1)).toBeFalsy()
    expect(coolDown.has(key2)).toBeTruthy()
  })
})
