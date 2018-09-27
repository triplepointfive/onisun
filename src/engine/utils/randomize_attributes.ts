import { PrimaryAttributes } from '../lib/race'

import { clone, sample } from 'lodash'

export const randomizeAttributes = function(
  baseAttributes: PrimaryAttributes,
  points: number
): [PrimaryAttributes, number] {
  let totalAttributes = clone(baseAttributes),
    availableAttributes = Object.keys(baseAttributes),
    deltaAttributes: PrimaryAttributes = {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    },
    randomAttribute

  while (availableAttributes.length) {
    availableAttributes = availableAttributes.filter(
      attribute => totalAttributes[attribute] <= points
    )
    randomAttribute = sample(availableAttributes)

    if (randomAttribute) {
      points -= totalAttributes[randomAttribute]
      deltaAttributes[randomAttribute] += 1
      totalAttributes[randomAttribute] += 1
    }
  }

  return [deltaAttributes, points]
}
