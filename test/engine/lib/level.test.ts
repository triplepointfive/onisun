import { Level } from '../../../src/engine'

it('Increases experience', () => {
  let level = new Level([2, 5])

  expect(level.currentExperience).toEqual(0)
  level.add(1)
  expect(level.currentExperience).toEqual(1)
})

it('By one level', () => {
  let level = new Level([2, 5])

  expect(level.currentExperience).toEqual(0)
  expect(level.current).toEqual(1)
  level.add(2)
  expect(level.currentExperience).toEqual(0)
  expect(level.current).toEqual(2)
})

it('By multiple levels at once', () => {
  let level = new Level([2, 2, 5])

  expect(level.currentExperience).toEqual(0)
  expect(level.current).toEqual(1)

  level.add(4)

  expect(level.currentExperience).toEqual(0)
  expect(level.current).toEqual(3)
})

it('Gains max level', () => {
  let level = new Level([2, 2])

  expect(level.currentExperience).toEqual(0)
  expect(level.current).toEqual(1)

  level.add(2)
  level.add(2)

  expect(level.currentExperience).toEqual(2)
  expect(level.requiredExperience).toEqual(2)
  expect(level.current).toEqual(3)

  level.add(2)

  expect(level.currentExperience).toEqual(2)
  expect(level.requiredExperience).toEqual(2)
  expect(level.current).toEqual(3)
})
