# Referred Site : https://github.com/kcurtin/calculator/blob/master/lib/calculator.ex #

defmodule Calc do
  @moduledoc """
  Documentation for Calc.
  """

  @doc """
  Calculator

  ## Examples

      iex> 2 + 3
      5

  """
  @parensRegex ~r/\(([^()]+)\)/

  def main() do
      case IO.gets("> ") do
      :eof ->
        IO.puts "All done"
      {:error, reason} ->
        IO.puts "Error: #{reason}"
      exp ->
        IO.puts eval(exp)
        main()
    end
  end

  def eval(exp) do
    "(#{exp})" # to solve as inner-parenthesis
    |> String.replace(~r/[ \n]/,"") # remove all whitespaces and line-break
    |> compute(true)
  end

  defp compute(exp, false), do: exp # if no operations are left to compute
  defp compute(exp, true) do # compute the operation
    exp
    |> replaceRegex # compute and replace the innermost parenthesis
    |> compute(Regex.match?(@parensRegex,exp)) # check if exp still has ()
  end

  # start computing by finding the correct operation
  defp computeExp(exp, :begin), do: computeExp(exp, "*", :more)

  # compare current expression with regular expression
  defp computeExp(exp, operator, :more) do
      computeExp(exp, operator, Regex.match?(toMatchRegex(operator), exp))
  end

  # solve when the appropriate operation is found and then continue
  defp computeExp(exp, operator, true), do: computeExp(solveEq(exp,operator),
                                                        operator, :more)
  # arithmetic operation in order of precedence
  defp computeExp(exp, "*", false), do: computeExp(exp, "/", :more)
  defp computeExp(exp, "/", false), do: computeExp(exp, "+", :more)
  defp computeExp(exp, "+", false), do: computeExp(exp, "-", :more)
  defp computeExp(exp, "-", false), do: exp # no more operations

  # generate regex of the operation in the expression for computation
  defp toMatchRegex(operator) do
    {_, regx} = Regex.compile("(\\d+)(\\#{operator})(\\d+)") # generate regex
    regx
  end

  # compute the portion for which regex matched and replace it in expression
  defp solveEq(portion, operator) do
    toMatchRegex(operator)
    |> Regex.replace(portion, fn _,left,op,right
                          -> "#{computeVal(String.to_integer(left),
                                           String.to_atom(op),
                                           String.to_integer(right))}" end)
  end

  # perform the arithmetic operation
  def computeVal(l,o,r) do
    Kernel # get the Kernel functions
    |> apply(o,[l,r]) # apply arithmetic operation to arguments
    |> round # round to the nearest integer
  end

  # compute the portions with parenthesis and replace it in the expression
  defp replaceRegex(exp) do
    Regex.replace(@parensRegex, exp, fn _, portion ->
                                        computeExp(portion, :begin)
                                        end)
  end
end
