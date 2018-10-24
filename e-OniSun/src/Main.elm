import Browser
import Html exposing (div)

main = Browser.sandbox { init = 0, update = \x m -> x, view = \ x -> div [] [] }
