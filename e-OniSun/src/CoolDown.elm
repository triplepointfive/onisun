module CoolDown exposing (..)

import Dict

type CoolDown key = CoolDown (Dict.Dict key Int)

newCoolDown : CoolDown a
newCoolDown = CoolDown Dict.empty

has : CoolDown comparable -> comparable -> Bool
has (CoolDown dict) k =
  Dict.member k dict

add : CoolDown comparable -> comparable -> Int -> CoolDown comparable
add (CoolDown dict) k v =
  CoolDown (Dict.insert k v dict)

turn : CoolDown comparable -> CoolDown comparable
turn (CoolDown dict) =
  CoolDown (Dict.map (\ _ v -> v - 1) (Dict.filter (\ _ v -> v > 1) dict))
