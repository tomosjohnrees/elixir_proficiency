import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Single-Quoted Literals Are Charlists, Not Strings",
    description:
      "Single-quoted values like 'hello' create charlists (linked lists of integer codepoints), not binary strings. This is inherited from Erlang. Most Elixir code uses double-quoted strings, so accidentally using single quotes gives you a completely different data type.",
    code: `# These are completely different types
is_list('hello')    #=> true
is_binary("hello")  #=> true

# Charlists are lists of integers
'ABC' == [65, 66, 67]
#=> true

# String functions don't work on charlists
String.upcase('hello')
#=> ** (FunctionClauseError)

# Convert between them
to_string('hello')   #=> "hello"
to_charlist("hello") #=> ~c"hello"`,
  },
  {
    title: "Lists of Small Integers Display as Charlists in IEx",
    description:
      "IEx will display a list of small integers as a charlist if all values are valid printable codepoints. This is confusing because [7, 8, 9] displays as a charlist since those happen to be ASCII control characters. Use i/1 or inspect with charlists: false to see the actual integers.",
    code: `# These display as charlists in IEx
[65, 66, 67]
#=> ~c"ABC"

[104, 101, 108, 108, 111]
#=> ~c"hello"

# To see the actual integers
inspect([65, 66, 67], charlists: :as_lists)
#=> "[65, 66, 67]"

# Use i/1 in IEx for full type info
i [65, 66, 67]
# Data type: List
# ...`,
  },
  {
    title: "Keyword Lists Allow Duplicate Keys",
    description:
      "Keyword lists are just lists of {key, value} tuples, so they allow duplicate keys. Functions like Keyword.get/2 return the first match only. This catches people who assume keyword lists behave like maps with unique keys.",
    code: `opts = [color: "red", size: 10, color: "blue"]

# Only the first :color is returned
Keyword.get(opts, :color)
#=> "red"

# But all values are there
Keyword.get_values(opts, :color)
#=> ["red", "blue"]

# Maps enforce unique keys
%{color: "red", color: "blue"}
#=> %{color: "blue"}  # last value wins`,
  },
  {
    title: "List Prepend Is O(1) but Append Is O(n)",
    description:
      "Linked lists in Elixir are singly linked, so prepending with [head | tail] is O(1) but appending with ++ or List.insert_at/3 is O(n) because the entire list must be traversed and copied. In loops, always prepend and reverse at the end.",
    code: `# O(1) — prepend is fast
list = [2, 3, 4]
[1 | list]
#=> [1, 2, 3, 4]

# O(n) — append copies the entire left list
list ++ [5]
#=> [2, 3, 4, 5]

# In recursive functions, prepend then reverse
defmodule Example do
  def double(list), do: do_double(list, [])

  defp do_double([], acc), do: Enum.reverse(acc)
  defp do_double([h | t], acc), do: do_double(t, [h * 2 | acc])
end`,
  },
];

export default gotchas;
