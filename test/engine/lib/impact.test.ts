import { ImpactBunch, ImpactType } from '../../../src/engine'

describe('ImpactBunch', () => {
  let bunch: ImpactBunch, type: ImpactType

  beforeEach(() => {
    bunch = new ImpactBunch()
    type = ImpactType.Blind
  })

  it('has no effects by default', () => {
    expect(bunch.activeImpacts).toEqual([])
  })

  it('turn does nothing when there is no effect', () => {
    bunch.turn()
    expect(bunch.activeImpacts).toEqual([])
  })

  describe('with temporary effect', () => {
    beforeEach(() => {
      bunch.addImpact(type, 2)
    })

    it('returns it', () => {
      expect(bunch.activeImpacts).toEqual([type])
    })

    it('removes when time passes', () => {
      bunch.turn()
      expect(bunch.activeImpacts).toEqual([type])
      bunch.turn()
      expect(bunch.activeImpacts).toEqual([])
    })

    it('adding and removing const effect does not affect it', () => {
      bunch.addConstImpact(type, 'boots')
      expect(bunch.activeImpacts).toEqual([type])
      bunch.removeConstImpact(type, 'boots')
      expect(bunch.activeImpacts).toEqual([type])
    })

    it('allows to remove it fully', () => {
      bunch.removeImpact(type)
      expect(bunch.activeImpacts).toEqual([])
    })
  })

  describe('with const effect', () => {
    beforeEach(() => {
      bunch.addConstImpact(type, 'boots')
    })

    it('returns it', () => {
      expect(bunch.activeImpacts).toEqual([type])
    })

    it('allows to remove it with correct source', () => {
      bunch.removeConstImpact(type, 'boots')
      expect(bunch.activeImpacts).toEqual([])
    })

    it('disallows to remove it with incorrect source', () => {
      bunch.removeConstImpact(type, 'helmet')
      expect(bunch.activeImpacts).toEqual([type])
    })
  })
})
