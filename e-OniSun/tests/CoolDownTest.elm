module CoolDownTest exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)

import CoolDown exposing (..)

key1 = 'a'
key2 = 'b'
new = newCoolDown
set = add (add new key1 1) key2 2
turned = turn (set)

suite : Test
suite =
  describe "CoolDown"
    [ test "new has no keys" <|
        \ _ -> Expect.equal (has new key1) False
    , describe "with both keys"
      [ test "has key 1" <|
        \ _ ->
          Expect.equal (has set key1) True
      , test "has key 2" <|
        \ _ ->
          Expect.equal (has set key2) True
      ]
    , describe "with both keys after a turn"
      [ test "has no key 1" <|
        \ _ ->
          Expect.equal (has turned key1) False
      , test "has key 2" <|
        \ _ ->
          Expect.equal (has turned key2) True
      ]
    ]
