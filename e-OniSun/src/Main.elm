import Array
import Browser
import Browser.Events exposing (onKeyPress)
import Dict
import Html exposing (..)
import Json.Decode as Decode

import Model.Talent exposing (..)

main =
  Browser.element
    { init = init
    , update = update
    , subscriptions = subscriptions
    , view = view
    }

type alias Model = Game

type Msg = KeyPress String

init : () -> (Model, Cmd Msg)
init () = ({ levelMap = initLevelMap, player = initPlayer }, Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update (KeyPress msg) model =
  case msg of
    "j" ->
      ( movePlayerEvent Down model
      , Cmd.none
      )
    "k" ->
      ( movePlayerEvent Up model
      , Cmd.none
      )
    _ -> (model, Cmd.none)

keyDecoder : Decode.Decoder Msg
keyDecoder =
  Decode.map KeyPress
    <| Decode.field "key" Decode.string

subscriptions : Model -> Sub Msg
subscriptions model =
  onKeyPress keyDecoder

initPlayer : Player
initPlayer = { id = 1, pos = { x = 1, y = 2 }, professions = [] }

initLevelMap : LevelMap
initLevelMap =
  { creatures = []
  , map = fromString """
#####
#   #
#   #
#   #
#   #
#   #
#####
"""
  }

view : Model -> Html Msg
view model =
  let creatures = Dict.fromList (List.map (\creature -> (creature.pos, creature)) model.levelMap.creatures)
  in
  pre [] (List.map (\row -> div [] <| List.map (tileToElem) row) (raw model.levelMap))

raw : LevelMap -> List (List Tile)
raw rec = Array.toList <| Array.map (Array.toList) rec.map

tileToElem : Tile -> Html Msg
tileToElem tile = span [] [text <| String.fromChar <| tileChar tile]

tileChar : Tile -> Char
tileChar tile =
  case tile.kind of
    Floor -> ' '
    Wall -> '#'

-- Screen

type alias Game =
  { levelMap : LevelMap
  , player : Player
  }

type alias Event = Game -> Game

type alias Screen = { handler : String -> Event }

-- setCreature : Point -> Maybe Creature -> LevelMap -> LevelMap
-- setCreature pos creature levelMap =
--   withTile pos (\tile -> { tile | creature = creature }) levelMap
--
-- moveEvent : Creature -> Point -> Event
-- moveEvent creature pos game =
--   let
--     removeOld =
--       case Dict.get creature.id game.creatures of
--         Nothing -> identity
--         Just oldPos -> setCreature oldPos Nothing
--   in
--     { game
--     | levelMap = setCreature pos (Just creature) <| removeOld game.levelMap
--     , creatures = Dict.insert creature.id pos game.creatures
--     }

type Direction = Up | Down | Left | Right

movePlayerEvent : Direction -> Event
movePlayerEvent dir game =
  let player = game.player in
  { game | player = { player | pos = directionPos dir game.player.pos } }

directionPos : Direction -> Point -> Point
directionPos dir ({ x, y }) =
  case dir of
    Up -> { x = x, y = y - 1 }
    Down -> { x = x, y = y + 1 }
    Left -> { x = x - 1, y = y }
    Right -> { x = x + 1, y = y }
