defmodule CalcTest do
  use ExUnit.Case
  doctest Calc

  test "calculator tests" do
    assert Calc.eval("2 + 3") == "5"
    assert Calc.eval("5 * 1") == "5"
    assert Calc.eval("20 / 4") == "5"
    assert Calc.eval("24 / 6 + (5 - 4)") == "5"
    assert Calc.eval("1 + 3 * 3 + 1") == "11"
    assert Calc.eval("(5 - 4) * (4 + 5) / (9 - 4)") == "2"
    assert Calc.eval("33 * (4 + 5) / (9 - 6)") == "99"
  end
end
