## Races

## Classes

## Professions

## Talents

## Skills

## Stats

Every creature has the following stats:

### HP

It is the value of the damage you can take. Hit points could be regenerated with time and recovered with potions and some other tricks.

### Armor

Check [here](#damage-and-armor-types)

### Damage

Check [here](#damage-and-armor-types). Note that melee and missile damage (if applicable) may differ.

### Speed

This defines how often a creature has a turn in comparison to other creatures. The lower value means more often turns. E.g. a monster with speed 5 has twice more turns than a monster with speed 10. Different actions may take a different amount of time, so some monsters move slowly, but their attacks are extremely fast.

### Body control (BC)

It is a change of a monster to dodge the hit. It is the same for melee and missile attack (although missile attacks have it own change to miss). Note that this value works in comparison with enemies value. This means, even if a monster has a high body control value, still it can be easily hit by a monster with even higher body control value.

## Main attributes

Main attributes are key stats of every character. Their lower limit is 0 and the max value differ.

### Strength

This affects the damage you do with melee weapons and interactions with heavy items.

- Every point adds 5kg to carrying capacity.
- Adjusts damage value in melee. With low value, it is a penalty, with the higher value is a bonus.

### Dexterity

### Constitution

- Every point adds 3kg to carrying capacity.
- Affects max health value on level up.

### Intelligence

### Wisdom

### Charisma

## Combat

### Damage and armor types

Generally, every single damage made to a creature has a type. Each damage type behaves differently with different armor types. E.g. melee attack does lower damage on heavy armor and higher on medium armor.

Below is a table of ratios for damages and armor types:

|        | Light | Medium | Heavy | Solid | Unarmored |
| ------ | ----- | ------ | ----- | ----- | --------- |
| Melee  | 1     | 2/3    | 1     | 4/3   | 1         |
| Pierce | 1/2   | 4/3    | 1     | 3     | 3/4       |
| Blunt  | 1     | 2      | 1     | 1/2   | 1/2       |
| Magic  | 5/4   | 3/4    | 1/2   | 3     | 1         |
| Pure   | 0     | 0      | 0     | 0     | 0         |

Also, the damage might have a subtype, which is used to be able to block the damage entirely. Like, frost attack has type Magic, and if a victim has magic block equipment, the damage will be reduced. But if the victim has ice resistance, the damage will be blocked fully, no matter what kind of armor the victim wears.

### Resistances

All creatures can have resistances to different damage types. Some of them are built in, but some may be acquired with items or other tricks. This is a list of all damage related resistances:

| Name                  | Blocks                                                              |
| --------------------- | ------------------------------------------------------------------- |
| Anemia                | Bleeding, vampires                                                  |
| Antidote              | Poison                                                              |
| Insulator             | Electricity                                                         |
| Intangible            | Melee, pierce, blunt attacks                                        |
| Magic Immunity        | Magic attacks                                                       |
| Teleportation control | Allows to resist random teleportation or choose desired destination |
| Water proof           | Ignores possible affects of water                                   |

## Impacts

Mostly these are applicable to player character only, nevertheless, some could be applied to monsters as well.

| Name       | Source                                   | Effect                                                                             |
| ---------- | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| Blind      | Items, monsters                          | You can't see anything                                                             |
| Stressed   | Carrying more items then capacity allows | Speed is reduced by quoter, reduces BC by 3                                        |
| Loaded     | Get Stressed and take more items         | Speed is reduces by half, reduces BC by 6                                          |
| Overloaded | Get Loaded and take more items           | Movement unavailable, reduces BC by 10                                             |
| Poisoned   | Monsters, traps                          | Periodical damage                                                                  |
| Bleeding   | Monsters, traps                          | Periodical damage                                                                  |
| Confusion  | Monsters, some actions                   | You fail to make things that require concentration, including reading, casting etc |

## Magic

## Experience

## Items

Basically, items are equipment or usable. Equipment items are various types of armor made of different materials.

### Materials

Materials have the following properties:

| Name                | Description                                        |
| ------------------- | -------------------------------------------------- |
| Affected with water | Transforms when contacts water (rusts or destroys) |
| Firm                | Retains the shape when interacting                 |
| Fragile             | Easy to break                                      |
| Insulator           | Blocks the flow of an electrical current           |

### Traps

Traps are tiles on dungeon floor, that can be activated when monster steps on them. Some can be activated multiple times and some can be untrapped.

| Trap          | Effect                                                                                  |
| ------------- | --------------------------------------------------------------------------------------- |
| Air blow      | Disarms players with low strength or blows away lightweight monster                     |
| Arrow trap    | This trap has a second part on a wall around. It shoots arrow from a wall to floor tile |
| Bare wire     | Electric shock damage on your feet                                                      |
| Falling rock  | Falls on your head, does blunt damage                                                   |
| Dart trap     | Same like arrow trap, but does poison damage                                            |
| Spiked pit    | Does pierce damage, takes few turns to climb out                                        |
| Hole          | Monster falls on a level below                                                          |
| Light trap    | Makes you blind                                                                         |
| Teleportation | Teleports to a random tile on same dungeon level                                        |
| Water         | Rusts equipment, both carried and worn                                                  |

## Keys

Main screen:

| Key | Command | Effect                                                                      |
| --- | ------- | --------------------------------------------------------------------------- |
| L   | Look    | Allows you to check what it is in a tile                                    |
| H   | Handle  | General command for all interactions with tiles: going on stairways, untrap |
