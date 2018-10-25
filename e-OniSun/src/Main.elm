import Array
import Browser
import Browser.Events exposing (onKeyPress)
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

type alias Model = { levelMap : LevelMap }

type alias Msg = String

init () = ({ levelMap = levelMap }, Cmd.none)

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    "k" ->
      ({ model | levelMap = withTile ({ x = 0, y = 0 }) (\tile -> { tile | creature = Just Creature }) model.levelMap }
      , Cmd.none
      )
    _ -> (model, Cmd.none)

keyDecoder : Decode.Decoder String
keyDecoder =
  Decode.field "key" Decode.string

subscriptions : Model -> Sub Msg
subscriptions model =
  onKeyPress keyDecoder


levelMap : LevelMap
levelMap =
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
