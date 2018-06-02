import { Timeline } from '../src/Timeline'

test('empty', () => {
    let timeline = new Timeline()
    expect(timeline.actors()).toEqual([])
})

describe('with two creatures', () => {
    const actor1 = 'actor1', actor2 = 'actor2'
    let timeline: Timeline<string>

    beforeEach(() => {
        timeline = new Timeline()
    })

    test('at different moments', () => {
        timeline.add(actor1, 4)
        timeline.add(actor2, 6)
        expect(timeline.actors()).toEqual([actor1])
        expect(timeline.actors()).toEqual([actor2])
        expect(timeline.actors()).toEqual([])
    })

    test('at the same momens', () => {
        timeline.add(actor1, 4)
        timeline.add(actor2, 4)
        expect(timeline.actors()).toEqual([actor1, actor2])
    })

    test('moment equals on second turn', () => {
        timeline.add(actor1, 4)
        timeline.add(actor2, 8)
        expect(timeline.actors()).toEqual([actor1])
        timeline.add(actor1, 4)
        expect(timeline.actors()).toEqual([actor2, actor1])
    })
})