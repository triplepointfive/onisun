module Model.Talent exposing (..)

import Random
import Random.List
import Dict
import Array

import Debug

type TalentStatus = Available | Completed | Unavailable

type alias Talent =
  { name : String
  , depth : Int
  , rank : Int
  , maxRank : Int
  }

type alias Profession =
  { name : String
  , level : Int
  , depthCost : Int
  , points : Int
  , talents : List Talent
  }

type alias Player =
  { professions : List Profession
  }

obtain : Talent -> Player -> Talent
obtain talent game =
  { talent | rank = talent.rank + 1 }

upgrade : Talent -> Talent
upgrade talent =
  { talent | rank = talent.rank + 1 }

-- Profession

status : Profession -> Talent -> TalentStatus
status profession talent =
  if talent.rank == talent.maxRank then
    Completed
  else if talent.depth * profession.depthCost > profession.points then
    Unavailable
  else
    Available

-- grid : Profession -> List (List (Maybe Talent))
-- grid = undefined

-- Profession Picker

professionsToPick : List Profession -> List Profession -> Int -> Int -> Random.Generator (List Profession)
professionsToPick pool takenProfessions maxLevel maxTaken =
  let upgradableProfessions = filterShuffle (\ profession -> profession.level < maxLevel) pool
      newProfessions = filterShuffle (\ profession -> List.member profession takenProfessions) pool
  in Random.map (List.take 2) (Random.map2 intersect upgradableProfessions newProfessions)

filterShuffle : (a -> Bool) -> List a -> Random.Generator (List a)
filterShuffle f list = Random.List.shuffle (List.filter f list)

intersect : List a -> List a -> List a
intersect a b =
  case a of
    [] -> b
    x :: xs ->
      case b of
        [] -> a
        y :: ys -> x :: y :: intersect xs ys

-- Base

type Gender
  = Male
  | Female
  | Neuter

type Material
  = Cloth
  | Flesh
  | Glass
  | Iron
  | Leather
  | Paper
  | Stone
  | Wood

type alias CreatureId = Int

type alias Creature = { id : CreatureId }

-- Timeline

type alias Timeline a =
  { step : Int
  , turns : Dict.Dict Int (List a)
  }

new : Timeline a
new =
  { step = 0, turns = Dict.empty }

add : a -> Int -> Timeline a -> Timeline a
add v delta t =
  { t | turns = Dict.update (t.step + delta) (\ old ->
    case old of
      Nothing -> Just [v]
      Just xs -> Just (v :: xs)
    ) t.turns
  }

remove : a -> Timeline a -> Timeline a
remove v t =
  { t | turns = Dict.filter (\ _ val -> not (List.isEmpty val))
    (Dict.map (\ _ val -> List.filter ((/=) v) val) t.turns)
  }

-- Level map

type TileKind = Floor | Wall

type alias Tile = { kind : TileKind, creature : Maybe Creature }

type alias LevelMap = { map : Array.Array (Array.Array Tile) }

fromString : String -> LevelMap
fromString str =
  { map = Array.fromList
    <| List.map (\ line -> Array.fromList
      <| List.map (\ c -> if c == ' ' then newTile Floor  else newTile Wall)
      <| String.toList line)
    <| List.filter (\line -> not <| String.isEmpty line)
    <| String.split "\n" str
  }

newTile : TileKind -> Tile
newTile kind = { kind = kind, creature = Nothing }

type alias Point = { x : Int, y : Int }

withTile : Point -> (Tile -> Tile) -> LevelMap -> LevelMap
withTile pos f levelMap =
  case Array.get pos.y levelMap.map of
    Nothing -> Debug.todo "withTile undefined column"
    Just row ->
      case Array.get pos.x row of
        Nothing -> Debug.todo "withTile undefined row"
        Just tile ->
          { levelMap | map = Array.set pos.y (Array.set pos.x (f tile) row) levelMap.map }
