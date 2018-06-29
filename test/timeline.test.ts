import { Timeline } from '../src/Timeline'

it('empty', () => {
  let timeline = new Timeline()
  expect(timeline.actors()).toEqual([])
})

describe('with two creatures', () => {
  const actor1 = 'actor1',
    actor2 = 'actor2'
  let timeline: Timeline<string>

  beforeEach(() => {
    timeline = new Timeline()
  })

  it('at different moments', () => {
    timeline.add(actor1, 4)
    timeline.add(actor2, 6)
    expect(timeline.actors()).toEqual([actor1])
    expect(timeline.actors()).toEqual([actor2])
    expect(timeline.actors()).toEqual([])
  })

  it('at the same moments', () => {
    timeline.add(actor1, 4)
    timeline.add(actor2, 4)
    expect(timeline.actors()).toEqual([actor1, actor2])
  })

  describe('next', () => {
    it('at the same moments', () => {
      timeline.add(actor1, 4)
      timeline.add(actor2, 4)
      expect(timeline.next()).toEqual(actor1)
      expect(timeline.next()).toEqual(actor2)
    })
  })

  it('moment equals on second turn', () => {
    timeline.add(actor1, 4)
    timeline.add(actor2, 8)
    expect(timeline.actors()).toEqual([actor1])
    timeline.add(actor1, 4)
    expect(timeline.actors()).toEqual([actor2, actor1])
  })

  it('removes actors', () => {
    timeline.add(actor1, 4)
    timeline.add(actor2, 8)
    expect(timeline.actors()).toEqual([actor1])
    timeline.remove(actor2)
    expect(timeline.actors()).toEqual([])
  })
})

describe('multiple ones', () => {
  const actor1 = 'actor1',
    actor2 = 'actor2',
    actor3 = 'actor3'
  let timeline: Timeline<string> = new Timeline()
  timeline.add(actor1, 90)
  timeline.add(actor2, 100)
  timeline.add(actor3, 120)

  it('picks the first one', () => {
    expect(timeline.actors()).toEqual([actor1])
  })
})
