import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "~r Regex Sigils Use Erlang's PCRE Syntax",
    description:
      "Elixir's ~r sigil compiles regular expressions using Erlang's :re module, which uses PCRE (Perl Compatible Regular Expressions). This is subtly different from regex in other languages. For example, named captures use (?<name>...) syntax, and some Unicode property classes may behave differently than expected.",
    code: `# Elixir regex uses PCRE syntax via Erlang's :re
~r/hello \\w+/

# Named captures use (?<name>...) syntax
regex = ~r/(?<year>\\d{4})-(?<month>\\d{2})/
Regex.named_captures(regex, "2024-03")
#=> %{"year" => "2024", "month" => "03"}

# Modifiers go after the closing delimiter
~r/hello/i    # case insensitive
~r/hello/s    # dotall — . matches newlines
~r/hello/m    # multiline — ^ and $ match line boundaries
~r/hello/u    # unicode — enables Unicode patterns

# Beware: Erlang's regex doesn't support all PCRE2 features
# like \\p{Emoji} — check :re docs for supported properties`,
  },
  {
    title: "Uppercase Sigils Don't Allow Interpolation",
    description:
      "Lowercase sigils (~s, ~r, ~w) allow string interpolation with \#{...}. Uppercase versions (~S, ~R, ~W) do not — they treat everything literally, including \\#{...} sequences. This is useful for raw strings but surprising if you accidentally capitalize the sigil letter and your interpolations silently stop working.",
    code: `name = "world"

# Lowercase: interpolation works
~s(hello \#{name})
#=> "hello world"

# Uppercase: NO interpolation — literal output
~S(hello \#{name})
#=> "hello \\\#{name}"

# Same with regex:
pattern = "foo"
~r/\#{pattern}/    #=> ~r/foo/    (interpolated)
~R/\#{pattern}/    #=> ~r/\\\#{pattern}/  (literal)

# And word lists:
type = "bar"
~w(\#{type} baz)   #=> ["bar", "baz"]
~W(\#{type} baz)   #=> ["\\\#{type}", "baz"]`,
  },
  {
    title: "Custom Sigils Must Be Defined as sigil_x Functions",
    description:
      "To create a custom sigil ~x, you define a function named sigil_x/2 that receives the string content and a charlist of modifiers. The naming convention is strict — it must be sigil_ followed by a single lowercase or uppercase character. The function must be imported or required to be used as a sigil.",
    code: `defmodule MySigils do
  # Define ~i for parsing integers
  def sigil_i(string, []),  do: String.to_integer(string)
  def sigil_i(string, ~c"f"), do: String.to_float(string)

  # Uppercase version — no interpolation allowed
  def sigil_I(string, []),  do: String.to_integer(string)
end

# Must import to use the sigil
import MySigils

~i(42)
#=> 42

~i(3.14)f
#=> 3.14

# Common mistake: forgetting to import
~i(42)
#=> ** (CompileError) undefined function sigil_i/2

# Modifiers come as a charlist, not a string:
def sigil_x(string, modifiers) do
  # modifiers is ~c"abc", not "abc"
end`,
  },
  {
    title: "~w Word List Modifier Affects Return Type",
    description:
      "The ~w sigil creates a word list, but the modifier letter after the closing delimiter determines the element type: no modifier or ~w(...)s returns strings, ~w(...)a returns atoms, and ~w(...)c returns charlists. Using the wrong modifier can cause subtle type errors, especially ~w(...)a which creates atoms from user-influenced content.",
    code: `# Default (or 's'): list of strings
~w(foo bar baz)
#=> ["foo", "bar", "baz"]

~w(foo bar baz)s
#=> ["foo", "bar", "baz"]

# 'a': list of atoms
~w(foo bar baz)a
#=> [:foo, :bar, :baz]

# 'c': list of charlists
~w(foo bar baz)c
#=> [~c"foo", ~c"bar", ~c"baz"]

# Common mistake: using 'a' then comparing with strings
fields = ~w(name email)a  #=> [:name, :email]

"name" in fields
#=> false  — comparing string to atoms!

:name in fields
#=> true

# Also dangerous: ~w(...)a creates atoms,
# which are never garbage collected
~w(\#{user_input})a  # Don't do this with untrusted input!`,
  },
];

export default gotchas;
