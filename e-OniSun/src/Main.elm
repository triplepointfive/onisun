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
init () = ({ levelMap = initLevelMap, creatures = Dict.empty }, Cmd.none)

update : Msg -> Model -> (Model, Cmd Msg)
update (KeyPress msg) model =
  case msg of
    "l" ->
      ( moveEvent initPlayer { x = 1, y = 1 } model
      , Cmd.none
      )
    "k" ->
      ( moveEvent initPlayer { x = 2, y = 2 } model
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

initPlayer = { id = 1 }

initLevelMap : LevelMap
initLevelMap =
  fromString """
#####
#   #
#   #
#   #
#   #
#   #
#####
"""

view : Model -> Html Msg
view model =
  pre [] (List.map (\row -> div [] <| List.map (tileToElem) row) (raw model.levelMap))

raw : LevelMap -> List (List Tile)
raw rec = Array.toList <| Array.map (Array.toList) rec.map

tileToElem : Tile -> Html Msg
tileToElem tile = span [] [text <| String.fromChar <| tileChar tile]

tileChar : Tile -> Char
tileChar tile =
  case tile.creature of
    Nothing ->
      case tile.kind of
        Floor -> ' '
        Wall -> '#'
    Just _ ->
      '@'

-- Screen

type alias Game = { levelMap : LevelMap, creatures : Dict.Dict CreatureId Point }

type alias Event = Game -> Game

type alias Screen = { handler : String -> Event }

setCreature : Point -> Maybe Creature -> LevelMap -> LevelMap
setCreature pos creature levelMap =
  withTile pos (\tile -> { tile | creature = creature }) levelMap

moveEvent : Creature -> Point -> Event
moveEvent creature pos game =
  let
    removeOld =
      case Dict.get creature.id game.creatures of
        Nothing -> identity
        Just oldPos -> setCreature oldPos Nothing
  in
    { game
    | levelMap = setCreature pos (Just creature) <| removeOld game.levelMap
    , creatures = Dict.insert creature.id pos game.creatures
    }
