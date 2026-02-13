import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "String.length vs byte_size for UTF-8",
    description:
      "String.length/1 counts grapheme clusters (what humans perceive as characters), while byte_size/1 counts raw bytes. For ASCII text they're the same, but for Unicode they can differ significantly. Using the wrong one for buffer sizes or protocol work causes subtle bugs.",
    code: `# ASCII — same result
String.length("hello")  #=> 5
byte_size("hello")       #=> 5

# Unicode — different results
String.length("héllo")  #=> 5
byte_size("héllo")       #=> 6  (é is 2 bytes in UTF-8)

# Emoji — even more dramatic
String.length("👨‍👩‍👧‍👦")  #=> 1  (one grapheme cluster)
byte_size("👨‍👩‍👧‍👦")       #=> 25 (multiple codepoints + joiners)

# For network protocols or file I/O, use byte_size
# For user-facing character counts, use String.length`,
  },
  {
    title: "String Concatenation with <> Copies Both Strings",
    description:
      "The <> operator creates a new binary by copying both operands. Repeatedly concatenating in a loop is O(n^2) because each step copies everything built so far. Use IO lists (iodata) for building strings incrementally, then convert once at the end.",
    code: `# Slow — O(n^2), copies on every concatenation
result = Enum.reduce(1..1000, "", fn i, acc ->
  acc <> Integer.to_string(i) <> ", "
end)

# Fast — O(n), builds an IO list and joins once
result = 1..1000
|> Enum.map(fn i -> [Integer.to_string(i), ", "] end)
|> IO.iodata_to_binary()

# IO lists are nested lists of strings/integers
# Many functions accept iodata directly
IO.puts(["Hello", " ", "World"])
#=> Hello World`,
  },
  {
    title: "Single-Quoted Literals Are Charlists, Not Strings",
    description:
      "This is one of the most common Elixir gotchas for newcomers. 'hello' is a charlist (a list of integer codepoints), while \"hello\" is a binary string. They are entirely different types. String module functions only work on binaries.",
    code: `'hello' == "hello"
#=> false

is_list('hello')    #=> true
is_binary("hello")  #=> true

# String functions reject charlists
String.upcase('hello')
#=> ** (FunctionClauseError)

# Use to_string/1 to convert
to_string('hello')
#=> "hello"

# Charlists are common when working with Erlang libraries
:httpc.request('http://example.com')
# Many Erlang functions expect/return charlists`,
  },
  {
    title: "Pattern Matching on Strings Only Works for Prefixes",
    description:
      "You can pattern match on the beginning of a string using the <> operator, but not on the end or middle. The left side of <> must be a known-size binary (a literal or a fixed-size pattern). This is a binary limitation, not a language design choice.",
    code: `# Matching a prefix works
"Hello, " <> name = "Hello, World"
name
#=> "World"

# Matching a suffix does NOT work
# greeting <> " World" = "Hello World"
#=> ** (CompileError) the left argument of <> must be a literal or
#     a variable with a known size

# For suffix/contains, use String functions
String.ends_with?("Hello World", "World")
#=> true

String.contains?("Hello World", "lo Wo")
#=> true`,
  },
  {
    title: "Grapheme Clusters vs Codepoints",
    description:
      "Elixir distinguishes between codepoints (individual Unicode values) and grapheme clusters (what users perceive as single characters). Some visible characters are composed of multiple codepoints. Using String.codepoints/1 instead of String.graphemes/1 can split characters that should stay together.",
    code: `# The 'é' can be a single codepoint or two combined
e_acute = "é"  # single codepoint: U+00E9

String.graphemes(e_acute)   #=> ["é"]
String.codepoints(e_acute)  #=> ["é"]

# Composed form: e + combining acute accent
composed = "e\\u0301"  # U+0065 + U+0301

String.graphemes(composed)   #=> ["é"]   # 1 grapheme
String.codepoints(composed)  #=> ["e", "́"]  # 2 codepoints

# Flag emoji are two regional indicator codepoints
String.graphemes("🇧🇷")   #=> ["🇧🇷"]   # 1 grapheme
String.codepoints("🇧🇷")  #=> ["🇧", "🇷"]  # 2 codepoints

# Always use String.graphemes for user-facing text splitting`,
  },
];

export default gotchas;
