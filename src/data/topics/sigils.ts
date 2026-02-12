import type { TopicContent } from "@/lib/types";

const sigils: TopicContent = {
  meta: {
    slug: "sigils",
    title: "Sigils & Regex",
    description: "Built-in sigils, custom sigils, and regular expressions",
    number: 20,
    active: true,
  },

  eli5: {
    analogyTitle: "The Rubber Stamp Collection",
    analogy:
      "Imagine you have a collection of rubber stamps. Each stamp takes the same raw text and transforms it into something specific — one stamp turns text into a list of words, another turns it into a date, another highlights every pattern match in yellow. You just pick the right stamp, press it on your text, and out comes exactly the thing you need.",
    items: [
      { label: "The ~ prefix", description: "The handle you grip to hold the stamp. Every sigil starts with a tilde (~) to tell Elixir 'I'm about to use a stamp, not write regular code.'" },
      { label: "The letter", description: "The stamp design. A lowercase letter like ~s gives you a string, ~w gives you a word list, ~r gives you a regex pattern. Uppercase versions skip escape processing." },
      { label: "The delimiters", description: "The ink pad boundaries. You can use parentheses, brackets, braces, angle brackets, pipes, slashes, or quotes — pick whichever avoids conflicts with your content." },
      { label: "Modifiers", description: "Adjustments after stamping. Letters at the end tweak behavior — like 'i' for case-insensitive matching on regex, or 'a' to get atoms from a word list." },
    ],
    keyTakeaways: [
      "Sigils are syntactic shortcuts that transform text literals into useful data structures at compile time.",
      "Lowercase sigils process escape sequences (like \\n); uppercase versions keep them raw.",
      "Built-in sigils include ~s (string), ~c (charlist), ~w (word list), ~r (regex), ~D (date), ~T (time), and ~N (naive datetime).",
      "Regex sigils (~r) compile the pattern at compile time, making them more efficient than runtime construction.",
      "You can define custom sigils in your own modules with the sigil_x function naming convention.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "~s / ~S", color: "#059669", examples: ["~s(hello world)", "~S(no \\n escape)", "~s|pipes work|"], description: "String sigil. Lowercase processes escapes, uppercase keeps them literal. Useful when strings contain many quotes." },
      { name: "~c / ~C", color: "#6b46c1", examples: ["~c(hello)", "~C(raw)", "~c|charlist|"], description: "Charlist sigil. Returns a list of character codepoints. Needed for interfacing with Erlang libraries." },
      { name: "~w / ~W", color: "#2563eb", examples: ["~w(foo bar baz)", "~w(one two)a", "~w(1 2 3)c"], description: "Word list sigil. Splits on whitespace. Modifiers: a for atoms, c for charlists, s for strings (default)." },
      { name: "~r / ~R", color: "#e11d48", examples: ["~r/hello/", "~r/^\\d+$/", "~r/pattern/i"], description: "Regex sigil. Compiles a regular expression at compile time. Supports modifiers like i (case-insensitive) and m (multiline)." },
      { name: "~D / ~T / ~N", color: "#d97706", examples: ["~D[2024-01-15]", "~T[13:45:00]", "~N[2024-01-15 13:45:00]"], description: "Date, Time, and NaiveDateTime sigils. Create calendar types from ISO 8601 formatted strings." },
      { name: "Custom Sigils", color: "#0891b2", examples: ["sigil_p/2", "~p(/path/to)", "defmacro sigil_x"], description: "You can define your own sigils by creating a macro named sigil_x where x is the letter. The function receives the string and modifiers." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "What Are Sigils?",
        prose: [
          "Sigils are a mechanism for working with textual representations of data. They start with a tilde (~), followed by a letter that determines the type, then delimiters containing the content, and optional modifier characters at the end.",
          "The key insight is that sigils are processed at compile time, not runtime. This means a regex sigil like `~r/pattern/` compiles the regex once during compilation rather than every time the code runs. It also means the compiler can catch malformed patterns early.",
          "You can use eight different delimiter pairs: `()`, `[]`, `{}`, `<>`, `||`, `//`, `\"\"`, and `''`. This flexibility lets you pick delimiters that don't conflict with your content.",
        ],
        code: {
          title: "Sigil delimiter flexibility",
          code: `# All of these are equivalent
~s(hello world)
~s[hello world]
~s{hello world}
~s<hello world>
~s|hello world|
~s/hello world/
~s"hello world"
~s'hello world'

# Pick delimiters to avoid escaping
~s(string with "quotes")
~s[path/to/file]
~s{this has (parens)}`,
          output: "\"string with \\\"quotes\\\"\"",
        },
      },
      {
        title: "String and Charlist Sigils",
        prose: [
          "The `~s` sigil creates strings and is most useful when your text contains double quotes that would need escaping. The uppercase `~S` version keeps escape sequences as literal characters — `\\n` stays as a backslash followed by 'n' rather than becoming a newline.",
          "The `~c` sigil creates charlists (lists of integer codepoints). You'll mostly use these when calling Erlang functions that expect charlists. The uppercase `~C` variant keeps escapes raw, just like `~S` does for strings.",
        ],
        code: {
          title: "String and charlist sigils",
          code: `# ~s: string with easy quoting
~s(She said "hello")
# => "She said \\"hello\\""

# ~S: raw string, no escape processing
~S(line one\\nstill line one)
# => "line one\\\\nstill line one"

# ~s processes escapes
~s(line one\\nline two)
# => "line one\\nline two"

# ~c: charlist
~c(hello)
# => ~c"hello" (i.e. [104, 101, 108, 108, 111])

# ~C: raw charlist
~C(no \\n escape)
# => ~c"no \\\\n escape"`,
          output: "~c\"no \\\\n escape\"",
        },
      },
      {
        title: "The Word List Sigil",
        prose: [
          "The `~w` sigil splits a string on whitespace and returns a list. By default it returns a list of strings, but you can append modifiers to change the element type: `a` for atoms, `c` for charlists, `s` for strings (the default).",
          "This is incredibly handy for quickly defining lists of strings or atoms without all the quotes and commas. It's one of the most commonly used sigils in everyday Elixir code.",
        ],
        code: {
          title: "Word list sigil",
          code: `# Default: list of strings
~w(foo bar baz)
# => ["foo", "bar", "baz"]

# With atom modifier
~w(foo bar baz)a
# => [:foo, :bar, :baz]

# With charlist modifier
~w(foo bar baz)c
# => [~c"foo", ~c"bar", ~c"baz"]

# Great for defining allowed values
@valid_roles ~w(admin moderator user)a
# => [:admin, :moderator, :user]

# Uppercase version: no escape processing
~W(hello\\nworld foo)
# => ["hello\\\\nworld", "foo"]`,
          output: "[\"hello\\\\nworld\", \"foo\"]",
        },
      },
      {
        title: "Regex Sigils",
        prose: [
          "The `~r` sigil compiles a regular expression into a `Regex` struct at compile time. This is more efficient than calling `Regex.compile!/1` at runtime, and the syntax is cleaner. You typically use regex with `Regex.match?/2`, `Regex.run/2`, `Regex.scan/2`, and `String.match?/2`.",
          "Regex modifiers go after the closing delimiter: `i` for case-insensitive, `m` for multiline (^ and $ match line boundaries), `s` for dotall (. matches newlines), `u` for unicode, and `x` for extended (ignore whitespace and comments in the pattern).",
        ],
        code: {
          title: "Regex in action",
          code: `# Basic matching
Regex.match?(~r/hello/, "hello world")
# => true

# Case-insensitive modifier
Regex.match?(~r/hello/i, "HELLO World")
# => true

# Capturing groups
Regex.run(~r/(\\w+)@(\\w+\\.\\w+)/, "user@example.com")
# => ["user@example.com", "user", "example.com"]

# Named captures
Regex.named_captures(~r/(?<name>\\w+)@(?<domain>\\w+\\.\\w+)/, "user@example.com")
# => %{"domain" => "example.com", "name" => "user"}

# Scan for all matches
Regex.scan(~r/\\d+/, "I have 3 cats and 12 dogs")
# => [["3"], ["12"]]

# String.replace with regex
String.replace("hello world", ~r/\\w+/, fn word ->
  String.capitalize(word)
end)
# => "Hello World"`,
          output: "\"Hello World\"",
        },
      },
      {
        title: "Date, Time, and DateTime Sigils",
        prose: [
          "Elixir provides sigils for creating calendar types from ISO 8601 strings. `~D` creates a `Date`, `~T` creates a `Time`, `~N` creates a `NaiveDateTime` (no timezone), and `~U` creates a `DateTime` with UTC timezone.",
          "These sigils validate the input at compile time — if you write `~D[2024-13-45]`, the compiler will reject it immediately. This makes them a safe, readable way to work with date and time literals.",
        ],
        code: {
          title: "Calendar sigils",
          code: `# Date
date = ~D[2024-06-15]
date.year   # => 2024
date.month  # => 6
date.day    # => 15

# Time
time = ~T[14:30:00]
time.hour   # => 14
time.minute # => 30

# NaiveDateTime (no timezone)
ndt = ~N[2024-06-15 14:30:00]
ndt.year  # => 2024
ndt.hour  # => 14

# UTC DateTime
udt = ~U[2024-06-15 14:30:00Z]
udt.time_zone  # => "Etc/UTC"

# Date comparison
Date.compare(~D[2024-01-01], ~D[2024-12-31])
# => :lt`,
          output: ":lt",
        },
      },
      {
        title: "Custom Sigils",
        prose: [
          "You can define your own sigils by writing a macro named `sigil_x` (where x is a lowercase letter) that takes two arguments: the sigil content as a string and a list of modifier characters as a charlist.",
          "Custom sigils are great for domain-specific literals — think JSON parsing, path construction, or query building. Because they're macros, they run at compile time, so you can validate input early and generate optimized code.",
        ],
        code: {
          title: "Defining a custom sigil",
          code: `defmodule MySigils do
  @doc "Sigil to create a trimmed, downcased string"
  defmacro sigil_t(term, _modifiers) do
    quote do
      unquote(term)
      |> String.trim()
      |> String.downcase()
    end
  end

  @doc "Sigil to split on commas"
  defmacro sigil_l(term, modifiers) do
    quote do
      items = String.split(unquote(term), ",", trim: true)

      if unquote(modifiers) == ~c"a" do
        Enum.map(items, &String.to_atom(String.trim(&1)))
      else
        Enum.map(items, &String.trim/1)
      end
    end
  end
end

# Usage (after import)
import MySigils

~t(  HELLO World  )
# => "hello world"

~l(apple, banana, cherry)
# => ["apple", "banana", "cherry"]

~l(foo, bar, baz)a
# => [:foo, :bar, :baz]`,
          output: "[:foo, :bar, :baz]",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "What is the difference between ~s and ~S?",
        options: [
          { label: "~s creates a string, ~S creates a symbol" },
          { label: "~s processes escape sequences, ~S keeps them as literal characters", correct: true },
          { label: "~s is for single-line strings, ~S is for multi-line" },
          { label: "There is no difference — they are aliases" },
        ],
        explanation:
          "Lowercase sigils like ~s process escape sequences (\\n becomes a newline). Uppercase versions like ~S keep everything literal (\\n stays as a backslash and the letter n). This lowercase/uppercase distinction applies to all sigils.",
      },
      {
        question: "What does ~w(foo bar baz)a return?",
        options: [
          { label: "[\"foo\", \"bar\", \"baz\"]" },
          { label: "[:foo, :bar, :baz]", correct: true },
          { label: "[~c\"foo\", ~c\"bar\", ~c\"baz\"]" },
          { label: "\"foo bar baz\"" },
        ],
        explanation:
          "The ~w sigil splits on whitespace, and the `a` modifier converts each element to an atom. Without any modifier (or with `s`), you'd get strings. With `c`, you'd get charlists.",
      },
      {
        question: "When is a ~r regex pattern compiled?",
        options: [
          { label: "Every time the containing function is called" },
          { label: "At compile time, once", correct: true },
          { label: "At runtime, the first time it's used" },
          { label: "It depends on the regex complexity" },
        ],
        explanation:
          "Regex sigils are compiled during compilation, not at runtime. This means the pattern is parsed and optimized once, making subsequent matches faster. This is one of the key advantages of using ~r over Regex.compile!/1.",
      },
      {
        question: "Which delimiters are NOT valid for sigils?",
        options: [
          { label: "~s(content)" },
          { label: "~s[content]" },
          { label: "~s{content}" },
          { label: "~s!content!", correct: true },
        ],
        explanation:
          "Elixir supports eight delimiter pairs for sigils: (), [], {}, <>, ||, //, \"\", and ''. Exclamation marks are not a valid delimiter pair. This is a common misconception for developers coming from other languages.",
      },
      {
        question: "How do you define a custom sigil named ~j in a module?",
        options: [
          { label: "def sigil_j(string, modifiers)" },
          { label: "defmacro sigil_j(term, modifiers)", correct: true },
          { label: "defsigil :j, fn string -> ... end" },
          { label: "defmacro ~j(term, modifiers)" },
        ],
        explanation:
          "Custom sigils are defined as macros named sigil_x where x is the sigil letter. They take two arguments: the term (content) and modifiers (charlist of characters after the closing delimiter). Using defmacro means the sigil is expanded at compile time.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "Sigil Explorer",
        difficulty: "beginner",
        prompt:
          "Write expressions using sigils to produce each of the following:\n1. The string `He said \"wow\"` without escaping any quotes\n2. A list of atoms `[:get, :post, :put, :delete]`\n3. A regex that matches email addresses (simplified: word characters, @, word characters, dot, word characters) with case-insensitive matching\n4. Today's date using the date sigil",
        hints: [
          { text: "Use ~s with delimiters that aren't double quotes — like parentheses or pipes." },
          { text: "The ~w sigil with the `a` modifier creates a list of atoms from whitespace-separated words." },
          { text: "For case-insensitive regex, add the `i` modifier after the closing delimiter." },
        ],
        solution: `# 1. String without escaping quotes
~s(He said "wow")
# => "He said \\"wow\\""

# 2. List of atoms
~w(get post put delete)a
# => [:get, :post, :put, :delete]

# 3. Case-insensitive email regex
~r/\\w+@\\w+\\.\\w+/i

# 4. Today's date (example)
~D[2024-06-15]`,
        walkthrough: [
          "Using ~s with parentheses as delimiters lets us include double quotes without escaping.",
          "~w splits on whitespace and the `a` modifier converts each word to an atom — much cleaner than typing [:get, :post, :put, :delete].",
          "The `i` after the closing / makes the regex case-insensitive. The pattern \\w+@\\w+\\.\\w+ matches a basic email format.",
          "~D creates a Date struct from an ISO 8601 string. The compiler validates the date, so ~D[2024-13-45] would be a compile error.",
        ],
      },
      {
        title: "Regex Data Extractor",
        difficulty: "intermediate",
        prompt:
          "Write a function `extract_info/1` that takes a string like `\"Name: Alice, Age: 30, Email: alice@example.com\"` and returns a map `%{name: \"Alice\", age: 30, email: \"alice@example.com\"}`. Use regex sigils with named captures. Handle the case where the string doesn't match by returning `{:error, :no_match}`.",
        hints: [
          { text: "Use `Regex.named_captures/2` with a regex that has named capture groups like (?<name>...)." },
          { text: "Named captures return string keys. You'll need to convert the age to an integer." },
          { text: "Regex.named_captures returns nil when there's no match — pattern match on this." },
        ],
        solution: `defmodule DataExtractor do
  @pattern ~r/Name:\\s*(?<name>\\w+),\\s*Age:\\s*(?<age>\\d+),\\s*Email:\\s*(?<email>\\S+)/

  def extract_info(input) do
    case Regex.named_captures(@pattern, input) do
      nil ->
        {:error, :no_match}

      %{"name" => name, "age" => age, "email" => email} ->
        {:ok, %{name: name, age: String.to_integer(age), email: email}}
    end
  end
end

DataExtractor.extract_info("Name: Alice, Age: 30, Email: alice@example.com")
# => {:ok, %{name: "Alice", age: 30, email: "alice@example.com"}}

DataExtractor.extract_info("garbage input")
# => {:error, :no_match}`,
        walkthrough: [
          "We store the regex as a module attribute with @pattern. Because it uses ~r, the regex is compiled once at compile time.",
          "Named capture groups like (?<name>\\w+) let us extract values by name instead of position.",
          "Regex.named_captures returns a map with string keys on success, or nil on failure.",
          "We pattern match on the result: nil means no match, and we destructure the map to extract the three fields.",
          "The age comes back as a string from the regex, so we convert it with String.to_integer/1.",
        ],
      },
      {
        title: "Custom Sigil: Markdown Headers",
        difficulty: "advanced",
        prompt:
          "Create a custom sigil `~h` that parses a simple markdown-like string into a list of `{level, text}` tuples. Lines starting with # are headers — the number of # characters determines the level. Non-header lines should be ignored. Support a modifier `d` that returns only the deepest headers (highest level number).\n\nExample:\n```\n~h\"\"\"\n# Title\n## Section\nSome text\n### Subsection\n\"\"\" \n=> [{1, \"Title\"}, {2, \"Section\"}, {3, \"Subsection\"}]\n\n~h\"\"\"\n# Title\n## Section\n### Deep\n\"\"\"d\n=> [{3, \"Deep\"}]\n```",
        hints: [
          { text: "Split the input on newlines, then use Regex.run/2 to match lines starting with one or more # characters." },
          { text: "Use `~r/^(#+)\\s+(.+)$/` to capture both the hashes and the text." },
          { text: "For the `d` modifier, find the max level first, then filter the list to keep only headers at that level." },
        ],
        solution: `defmodule MarkdownSigils do
  defmacro sigil_h(term, modifiers) do
    quote do
      headers =
        unquote(term)
        |> String.split("\\n", trim: true)
        |> Enum.reduce([], fn line, acc ->
          case Regex.run(~r/^(#+)\\s+(.+)$/, String.trim(line)) do
            [_, hashes, text] ->
              [{String.length(hashes), text} | acc]
            _ ->
              acc
          end
        end)
        |> Enum.reverse()

      if unquote(modifiers) == ~c"d" do
        max_level = headers |> Enum.map(&elem(&1, 0)) |> Enum.max(fn -> 0 end)
        Enum.filter(headers, fn {level, _} -> level == max_level end)
      else
        headers
      end
    end
  end
end

import MarkdownSigils

~h\"\"\"
# Title
## Section
Some text
### Subsection
\"\"\"
# => [{1, "Title"}, {2, "Section"}, {3, "Subsection"}]

~h\"\"\"
# Title
## Section
### Deep
\"\"\"d
# => [{3, "Deep"}]`,
        walkthrough: [
          "The sigil is defined as a macro (defmacro sigil_h) so it's expanded at compile time.",
          "We split the input on newlines and use Enum.reduce to process each line.",
          "The regex ~r/^(#+)\\s+(.+)$/ captures the hash marks and the header text separately.",
          "We count the hashes with String.length to determine the header level.",
          "The list is built in reverse (prepending is O(1)) and reversed at the end.",
          "When the `d` modifier is present, we find the maximum level and filter to keep only headers at that depth.",
        ],
      },
    ],
  },
};

export default sigils;
