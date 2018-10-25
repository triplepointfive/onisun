import Browser
import Html exposing (..)

import Model.Talent exposing (..)

import Array

main =
  Browser.element
    { init = init
    , update = update
    , subscriptions = subscriptions
    , view = view
    }

type alias Model = Int

type alias Msg = Int

init () = (0, Cmd.none)

update msg _ = (0, Cmd.none)

subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.none

levelMap : LevelMap
levelMap =
  withTile ({ x = 0, y = 0 }) (\tile -> { tile | creature = Just Creature })
  <| fromString """
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
  pre [] (List.map (\row -> div [] <| List.map (tileToElem) row) (raw levelMap))

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
