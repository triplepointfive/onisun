import { drawn } from '../../../src/engine'

describe('drawn', () => {
  it('Unknown char', () => {
    expect(() => drawn(['W'], new Map())).toThrow()
  })
})
