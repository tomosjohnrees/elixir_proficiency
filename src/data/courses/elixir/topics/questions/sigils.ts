import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
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
  {
    question: "What does ~w(hello world)c return?",
    options: [
      { label: "[\"hello\", \"world\"]" },
      { label: "[:hello, :world]" },
      { label: "[~c\"hello\", ~c\"world\"]", correct: true },
      { label: "'hello world'" },
    ],
    explanation:
      "The `c` modifier on the ~w sigil converts each whitespace-separated word into a charlist. Without a modifier (or with `s`), you get strings. With `a`, you get atoms. With `c`, you get charlists — lists of integer codepoints.",
  },
  {
    question: "What is the result of ~S(hello\\nworld)?",
    options: [
      { label: "\"hello\\nworld\" (with a newline character)" },
      { label: "\"hello\\\\nworld\" (with literal backslash-n)", correct: true },
      { label: "A compile error because ~S doesn't accept escape sequences" },
      { label: "\"helloworld\" (newline is stripped)" },
    ],
    explanation:
      "Uppercase sigils like ~S skip escape sequence processing entirely. The backslash and 'n' are kept as literal characters in the string rather than being converted to a newline. This is useful when working with content that contains many backslashes, like regex patterns or Windows file paths.",
  },
  {
    question: "Which regex modifier makes the . character match newline characters as well?",
    options: [
      { label: "m (multiline)" },
      { label: "i (case-insensitive)" },
      { label: "s (dotall)", correct: true },
      { label: "x (extended)" },
    ],
    explanation:
      "The `s` (dotall) modifier makes the dot (.) match any character including newlines. Without it, . matches everything except newline characters. The `m` modifier is different — it makes ^ and $ match the beginning and end of each line rather than the entire string.",
  },
  {
    question: "What happens if you write ~D[2024-13-45]?",
    options: [
      { label: "It returns nil" },
      { label: "It raises a runtime error when the value is used" },
      { label: "It produces a compile-time error", correct: true },
      { label: "It creates a Date struct with clamped values" },
    ],
    explanation:
      "Date, time, and datetime sigils validate their input at compile time. Since month 13 and day 45 are invalid, the compiler will reject this code before it ever runs. This early validation is one of the major benefits of using sigils over runtime parsing functions.",
  },
  {
    question: "In a custom sigil definition `defmacro sigil_p(term, modifiers)`, what type is the `modifiers` argument?",
    options: [
      { label: "A string of modifier characters" },
      { label: "A list of atom flags" },
      { label: "A charlist (list of character codepoints)", correct: true },
      { label: "A keyword list of options" },
    ],
    explanation:
      "The modifiers argument in a custom sigil is a charlist — a list of integer codepoints representing the characters written after the closing delimiter. For example, if someone writes ~p(content)ab, the modifiers argument would be ~c\"ab\" (i.e., [97, 98]). This is why you'll often see comparisons like `modifiers == ~c\"a\"`.",
  },
  {
    question: "What does Regex.named_captures(~r/(?<year>\\d{4})-(?<month>\\d{2})/, \"2024-06\") return?",
    options: [
      { label: "%{year: \"2024\", month: \"06\"}" },
      { label: "%{\"year\" => \"2024\", \"month\" => \"06\"}", correct: true },
      { label: "[{\"year\", \"2024\"}, {\"month\", \"06\"}]" },
      { label: "%{year: 2024, month: 6}" },
    ],
    explanation:
      "Regex.named_captures/2 returns a map with string keys (not atom keys) corresponding to the named capture groups. The captured values are always strings — no automatic type conversion occurs. This is a common gotcha: you need to explicitly convert values with functions like String.to_integer/1 if you need other types.",
  },
  {
    question: "Why would you use ~R instead of ~r for a regex pattern?",
    options: [
      { label: "~R compiles the regex at runtime for dynamic patterns" },
      { label: "~R supports more advanced regex features like lookaheads" },
      { label: "~R avoids processing escape sequences, reducing the need for double-escaping", correct: true },
      { label: "~R creates a case-insensitive regex by default" },
    ],
    explanation:
      "Like all uppercase sigils, ~R skips escape sequence processing. This means you don't need to double-escape special characters. For example, to match a literal backslash followed by 'n', you'd write ~R(\\n) instead of ~r(\\\\n). This is especially helpful for complex regex patterns with many backslashes.",
  },
  {
    question: "What is the difference between ~U[2024-06-15 14:30:00Z] and ~N[2024-06-15 14:30:00]?",
    options: [
      { label: "~U creates a Unix timestamp, ~N creates a NaiveDateTime" },
      { label: "~U requires the Z suffix and creates a UTC DateTime; ~N creates a NaiveDateTime with no timezone info", correct: true },
      { label: "They are equivalent — both create the same DateTime struct" },
      { label: "~U validates against a timezone database, ~N does not" },
    ],
    explanation:
      "~U creates a DateTime struct fixed to the UTC timezone (indicated by the Z suffix, which is required). ~N creates a NaiveDateTime that has no timezone information at all. Use ~N when timezone is irrelevant, and ~U when you need an explicit UTC timestamp. The distinction matters for correctness in applications that deal with multiple timezones.",
  },
  {
    question: "Which of the following correctly uses interpolation inside a sigil?",
    options: [
      { label: "~s(hello #{name}) with a lowercase sigil", correct: true },
      { label: "~S(hello #{name}) with an uppercase sigil" },
      { label: "~r/#{pattern}/ with either case" },
      { label: "Interpolation is not supported in any sigil" },
    ],
    explanation:
      "Lowercase sigils support interpolation (#{...}), just like they support escape sequences. Uppercase sigils treat the content completely literally, so #{name} would remain as the literal characters #, {, n, a, m, e, }. This makes lowercase sigils useful when you need dynamic content, and uppercase sigils ideal for content with many special characters.",
  },
  {
    question: "What does the `x` modifier do on a regex sigil like ~r/pattern/x?",
    options: [
      { label: "Enables XML matching mode" },
      { label: "Makes the regex match exclusively (non-greedy)" },
      { label: "Enables extended mode: ignores unescaped whitespace and allows # comments in the pattern", correct: true },
      { label: "Enables hexadecimal escape sequences in the pattern" },
    ],
    explanation:
      "The `x` (extended) modifier makes the regex engine ignore unescaped whitespace and treat # as a comment character within the pattern. This allows you to write complex regex patterns across multiple lines with comments explaining each part, dramatically improving readability for long patterns. To match a literal space in extended mode, you must escape it with a backslash.",
  },
];

export default questions;
