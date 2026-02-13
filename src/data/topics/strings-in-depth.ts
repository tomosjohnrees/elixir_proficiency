import type { TopicContent } from "@/lib/types";
import questions from "./questions/strings-in-depth";
import gotchas from "./gotchas/strings-in-depth";

const stringsInDepth: TopicContent = {
  meta: {
    slug: "strings-in-depth",
    title: "Strings in Depth",
    description: "Binaries, UTF-8, charlists, and the String module",
    number: 9,
    active: true,
  },

  eli5: {
    analogyTitle: "The Envelope and the Letter",
    analogy:
      "Think of a string as a sealed envelope. When you look at the outside, you see readable text — \"Hello\". But inside, the letter is actually written in a special code: a sequence of numbers that represent each character. That code is called UTF-8. Most of the time you just read the envelope and don't think about the numbers inside. But sometimes — when dealing with emojis, accented characters, or raw data — you need to open the envelope and work with the numbers directly.",
    items: [
      { label: "Strings (binaries)", description: "The sealed envelope. Double-quoted text like \"hello\". Under the hood, it's a sequence of UTF-8 encoded bytes stored as a binary." },
      { label: "Charlists", description: "A completely different kind of letter — a list of character codes. Single-quoted like 'hello'. Mostly used for Erlang interop, not day-to-day Elixir." },
      { label: "Bytes vs characters", description: "An English letter takes 1 byte. An emoji might take 4 bytes. The envelope's weight (byte_size) can be more than the number of characters (String.length)." },
      { label: "Binaries", description: "The raw data format underneath strings. Any sequence of bytes. Strings are binaries that happen to be valid UTF-8." },
    ],
    keyTakeaways: [
      "Elixir strings are UTF-8 encoded binaries. \"hello\" is a binary, not a list of characters.",
      "Single-quoted 'hello' is a charlist (a list of integers), NOT a string. This trips up many beginners.",
      "String.length/1 counts graphemes (visible characters). byte_size/1 counts raw bytes. They differ for multi-byte characters.",
      "The String module operates on graphemes (what humans see as characters). Binary pattern matching operates on bytes.",
      "Binaries are the general type. Strings are binaries that are valid UTF-8. You can have binaries that aren't strings.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "String (Binary)", color: "#059669", examples: ["\"hello\"", "\"José\"", "\"emoji: 🎉\""], description: "Double-quoted. UTF-8 encoded binary. The standard text type in Elixir." },
      { name: "Charlist", color: "#d97706", examples: ["'hello'", "'José'", "[104, 101, 108, 108, 111]"], description: "Single-quoted. A list of Unicode codepoints (integers). Used mainly for Erlang interop." },
      { name: "Binary", color: "#6b46c1", examples: ["<<72, 101, 108, 108, 111>>", "<<0, 255, 128>>"], description: "Raw byte sequence. Strings are binaries, but binaries can hold any bytes — not just valid UTF-8." },
      { name: "Grapheme vs Byte", color: "#2563eb", examples: ["\"é\" = 2 bytes, 1 grapheme", "\"🎉\" = 4 bytes, 1 grapheme", "\"hello\" = 5 bytes, 5 graphemes"], description: "A grapheme is what you see. A byte is what's stored. Multi-byte characters mean length ≠ byte_size." },
    ],
    operatorGroups: [
      {
        name: "String Operations",
        operators: [
          { symbol: "<>", description: "Concatenate strings" },
          { symbol: "\#{}", description: "Interpolation inside double quotes" },
          { symbol: "String.length", description: "Count graphemes (visible characters)" },
          { symbol: "byte_size", description: "Count raw bytes" },
          { symbol: "String.at", description: "Get grapheme at index" },
          { symbol: "String.slice", description: "Extract a substring" },
        ],
      },
      {
        name: "Binary Pattern Matching",
        operators: [
          { symbol: "<<>>", description: "Binary literal / pattern match syntax" },
          { symbol: "::utf8", description: "Match a UTF-8 codepoint" },
          { symbol: "::binary", description: "Match remaining bytes" },
          { symbol: "::size(n)", description: "Match exactly n bits" },
        ],
      },
    ],
  },

  deepDive: {
    sections: [
      {
        title: "Strings Are Binaries",
        prose: [
          "In Elixir, a double-quoted string is a UTF-8 encoded binary. A binary is a contiguous sequence of bytes, written with the <<>> syntax. When those bytes happen to be valid UTF-8, Elixir displays them as a readable string.",
          "You can verify this with is_binary/1 — it returns true for any string. You can also see the raw bytes using :binary.bin_to_list/1 or by inspecting with binaries: :as_binaries.",
          "This means string operations are really binary operations under the hood. Concatenation with <> is binary concatenation. Pattern matching on strings uses binary pattern syntax. Understanding this connection is key to working with strings at a deeper level.",
        ],
        code: {
          title: "Strings as binaries",
          code: `# Strings are binaries
is_binary("hello")  # => true

# See the raw bytes
"hello" == <<104, 101, 108, 108, 111>>  # => true

# UTF-8 multi-byte characters
"é" == <<195, 169>>  # => true (2 bytes!)
"🎉" == <<240, 159, 142, 137>>  # => true (4 bytes!)

# byte_size vs String.length
byte_size("hello")  # => 5 (1 byte per ASCII char)
String.length("hello")  # => 5

byte_size("José")   # => 5 (é is 2 bytes)
String.length("José")  # => 4

byte_size("🎉")     # => 4
String.length("🎉")  # => 1`,
          output: "1",
        },
      },
      {
        title: "Charlists — The Other Kind of Text",
        prose: [
          "Single-quoted text like 'hello' is NOT a string — it's a charlist. A charlist is just a plain list of integers, where each integer is a Unicode codepoint. Elixir displays a list of integers as a charlist when all values are printable characters.",
          "Charlists exist primarily for Erlang interop. Many Erlang functions expect or return charlists. In pure Elixir code, you'll almost always use double-quoted strings. If you accidentally get a charlist, convert it with to_string/1.",
          "A common gotcha: IEx sometimes displays lists of small integers as charlists. [104, 101, 108, 108, 111] shows as 'hello' because those are the codepoints for h-e-l-l-o. This is just a display quirk — it's still a list.",
        ],
        code: {
          title: "Strings vs charlists",
          code: `# Double quotes = string (binary)
is_binary("hello")  # => true
is_list("hello")    # => false

# Single quotes = charlist (list of integers)
is_list('hello')    # => true
is_binary('hello')  # => false

# A charlist is just a list of codepoints
'hello' == [104, 101, 108, 108, 111]  # => true

# The IEx display gotcha
[104, 101, 108, 108, 111]  # => 'hello' (displayed as charlist!)
[104, 101, 108, 108, 111, 0]  # => [104, 101, 108, 108, 111, 0]
# Adding 0 (non-printable) breaks the charlist display

# Converting between them
to_string('hello')    # => "hello"
to_charlist("hello")  # => 'hello'

# They are NOT equal
'hello' == "hello"  # => false`,
          output: "false",
        },
      },
      {
        title: "Binary Pattern Matching",
        prose: [
          "One of Elixir's most powerful features is pattern matching on binaries. You can destructure strings byte-by-byte or codepoint-by-codepoint, extract fixed-size segments, and match specific prefixes — all with pattern matching.",
          "The ::utf8 modifier matches a single UTF-8 codepoint (which might be multiple bytes). The ::binary modifier matches the rest of the binary. This lets you process strings character by character in a way that correctly handles multi-byte characters.",
          "Binary pattern matching is heavily used in parsers, protocol implementations, and anywhere you need to process raw data. It's one of the features Elixir inherits from Erlang that makes it excellent for networking and data processing.",
        ],
        code: {
          title: "Binary patterns",
          code: `# Match the first byte and the rest
<<first, rest::binary>> = "hello"
first  # => 104 (the byte for 'h')
rest   # => "ello"

# Match a UTF-8 codepoint (handles multi-byte)
<<first::utf8, rest::binary>> = "José"
first  # => 74 (codepoint for 'J')
rest   # => "osé"

# Match a specific prefix
<<"Hello, ", name::binary>> = "Hello, world"
name  # => "world"

# Recursive string processing
defmodule StringWalker do
  def each_char(<<>>), do: :ok
  def each_char(<<char::utf8, rest::binary>>) do
    IO.puts(<<char::utf8>>)
    each_char(rest)
  end
end

StringWalker.each_char("hi!")
# Prints: h, i, !`,
          output: ":ok",
        },
      },
      {
        title: "The String Module",
        prose: [
          "The String module provides functions that operate on graphemes — the characters you see on screen. A grapheme may consist of multiple codepoints (like é which can be e + combining accent), and String functions handle this correctly.",
          "Key functions include split, trim, replace, starts_with?, contains?, upcase, downcase, and capitalize. For more complex text processing, graphemes/1 returns a list of individual graphemes and codepoints/1 returns the Unicode codepoints.",
          "String.slice/3 and String.at/2 work by grapheme index, not byte index. This is correct but can be slow for large strings since it must walk from the beginning. If you need frequent random access, consider converting to a list of graphemes first.",
        ],
        code: {
          title: "String module highlights",
          code: `# Splitting and joining
String.split("a, b, c", ", ")  # => ["a", "b", "c"]
Enum.join(["a", "b", "c"], " - ")  # => "a - b - c"

# Trimming
String.trim("  hello  ")       # => "hello"
String.trim_leading("  hello") # => "hello"
String.trim_trailing("hello  ") # => "hello"

# Search and replace
String.contains?("hello", "ell")  # => true
String.replace("hello", "l", "r") # => "herro"
String.starts_with?("hello", "he") # => true

# Working with graphemes
String.graphemes("José")  # => ["J", "o", "s", "é"]
String.codepoints("🇺🇸")  # => ["🇺", "🇸"]
String.length("🇺🇸")      # => 1 (one flag grapheme!)

# Case conversion
String.upcase("hello")     # => "HELLO"
String.downcase("HELLO")   # => "hello"
String.capitalize("hello") # => "Hello"`,
          output: "\"Hello\"",
        },
      },
      {
        title: "Sigils for String Convenience",
        prose: [
          "Elixir provides sigils — shortcuts for creating common literal values. The most useful string-related sigils are ~s for strings (handy when your string contains double quotes) and ~w for word lists.",
          "~s works like double quotes but lets you use double quotes inside without escaping. ~S (uppercase) is the non-interpolating version. ~w splits a string into a list of words — great for quickly creating word lists without typing quotes and commas.",
          "You'll encounter sigils throughout Elixir codebases. ~r creates regular expressions, ~c creates charlists, and libraries can define their own. For now, ~s and ~w are the most practical for string work.",
        ],
        code: {
          title: "String sigils",
          code: `# ~s for strings with double quotes
~s(She said "hello")  # => "She said \\"hello\\""

# ~S for no interpolation
name = "world"
~s(Hello #{name})  # => "Hello world"
~S(Hello #{name})  # => "Hello \#{name}" (literal)

# ~w for word lists
~w(foo bar baz)        # => ["foo", "bar", "baz"]
~w(foo bar baz)a       # => [:foo, :bar, :baz] (atoms!)

# ~r for regex
String.match?("hello", ~r/ell/)  # => true
Regex.scan(~r/\\d+/, "abc123def456")
# => [["123"], ["456"]]`,
          output: "[[\"123\"], [\"456\"]]",
        },
      },
    ],
  },

  gotchas: { items: gotchas },

  quiz: {
    questions,
  },

  practice: {
    problems: [
      {
        title: "Caesar Cipher",
        difficulty: "beginner",
        prompt:
          "Write a function caesar/2 that shifts every letter in a string by n positions in the alphabet (wrapping around). Keep spaces and non-letter characters unchanged. Handle both uppercase and lowercase.\n\nExample: caesar(\"Hello, World!\", 3) should return \"Khoor, Zruog!\".",
        hints: [
          { text: "Use to_charlist/1 to get a list of codepoints you can manipulate, then to_string/1 to convert back." },
          { text: "Lowercase letters are codepoints 97-122 (?a to ?z). Uppercase are 65-90 (?A to ?Z). Use rem/2 for wrapping." },
          { text: "Enum.map over the charlist, shifting letters and passing through other characters unchanged." },
        ],
        solution: `defmodule Cipher do
  def caesar(text, shift) do
    text
    |> to_charlist()
    |> Enum.map(fn char -> shift_char(char, shift) end)
    |> to_string()
  end

  defp shift_char(char, shift) when char in ?a..?z do
    rem(char - ?a + shift, 26) + ?a
  end

  defp shift_char(char, shift) when char in ?A..?Z do
    rem(char - ?A + shift, 26) + ?A
  end

  defp shift_char(char, _shift), do: char
end

Cipher.caesar("Hello, World!", 3)
# => "Khoor, Zruog!"

Cipher.caesar("abc xyz", 1)
# => "bcd yza"`,
        walkthrough: [
          "We convert the string to a charlist to work with individual codepoints as integers. This makes arithmetic straightforward.",
          "For each character, we check if it's lowercase (a-z), uppercase (A-Z), or something else. Guards with char in ?a..?z use Elixir's ? syntax for character codepoints.",
          "The shift formula normalizes to 0-25 (subtract ?a), adds the shift, wraps with rem/2, then converts back (add ?a). This handles wrapping past z correctly.",
          "Non-letter characters pass through unchanged via the catch-all clause.",
          "Finally, to_string/1 converts the shifted charlist back to a proper binary string.",
        ],
      },
      {
        title: "String Truncator",
        difficulty: "intermediate",
        prompt:
          "Write a function truncate/3 that shortens a string to at most max_length graphemes. If truncated, append a suffix (default \"...\"). The suffix counts toward the max length. Don't break in the middle of a word if possible — cut at the last space before the limit.\n\nExample: truncate(\"The quick brown fox\", 15) should return \"The quick...\" (not \"The quick brown\" which is 15 chars, because adding \"...\" would exceed 15).",
        hints: [
          { text: "First check if the string is already short enough — return it unchanged." },
          { text: "Calculate how many characters of content you can keep: max_length - String.length(suffix)." },
          { text: "Use String.slice to get the allowed portion, then find the last space within it to avoid mid-word breaks." },
          { text: "String.trim_trailing/1 will clean up any trailing space before appending the suffix." },
        ],
        solution: `defmodule Truncator do
  def truncate(string, max_length, suffix \\\\ "...") do
    if String.length(string) <= max_length do
      string
    else
      content_length = max_length - String.length(suffix)
      truncated = String.slice(string, 0, content_length)

      # Try to break at a word boundary
      case String.last_index(truncated, " ") do
        nil -> truncated
        idx -> String.slice(truncated, 0, idx)
      end
      |> String.trim_trailing()
      |> Kernel.<>(suffix)
    end
  end

  # Helper since String doesn't have last_index
  defp String.last_index(string, char) do
    case :binary.matches(string, char) do
      [] -> nil
      matches -> matches |> List.last() |> elem(0)
    end
  end
end

Truncator.truncate("The quick brown fox", 15)
# => "The quick..."

Truncator.truncate("Hello", 10)
# => "Hello"

Truncator.truncate("Hello World", 8, "…")
# => "Hello…"`,
        walkthrough: [
          "First we check if the string already fits — no truncation needed.",
          "We calculate how much content we can keep: the max length minus the suffix length. This ensures the final result (content + suffix) fits within the limit.",
          "We slice to the content length, then look for the last space to find a word boundary. Breaking at a word boundary makes the output more readable.",
          "We use :binary.matches to find all occurrences of the space character, then take the last one. This is more efficient than splitting the string.",
          "Finally, we trim any trailing whitespace and append the suffix. The default suffix is \"...\" but callers can customize it.",
        ],
      },
      {
        title: "Binary Protocol Parser",
        difficulty: "advanced",
        prompt:
          "Write a function parse_packet/1 that parses a simple binary protocol. The binary format is:\n- First byte: version number (unsigned integer)\n- Next 2 bytes: payload length (unsigned big-endian 16-bit integer)\n- Next N bytes: the payload (a UTF-8 string, where N = payload length)\n- Last byte: checksum (XOR of all payload bytes)\n\nReturn {:ok, %{version: v, payload: p}} if valid, {:error, reason} if the checksum fails or the binary is malformed.",
        hints: [
          { text: "Use binary pattern matching: <<version::8, length::16, payload::binary-size(length), checksum::8>>." },
          { text: "The binary-size(n) modifier matches exactly n bytes." },
          { text: "Compute the checksum by reducing over the payload bytes with Bitwise.bxor/2 or the bxor operator." },
          { text: "Use :binary.bin_to_list/1 to get the list of bytes for XOR calculation." },
        ],
        solution: `defmodule Protocol do
  import Bitwise

  def parse_packet(<<version::8, length::16, payload::binary-size(length), checksum::8>>) do
    computed_checksum =
      payload
      |> :binary.bin_to_list()
      |> Enum.reduce(0, fn byte, acc -> bxor(acc, byte) end)

    if computed_checksum == checksum do
      {:ok, %{version: version, payload: payload}}
    else
      {:error, :invalid_checksum}
    end
  end

  def parse_packet(_), do: {:error, :malformed_packet}

  # Helper to build a valid packet
  def build_packet(version, payload) do
    length = byte_size(payload)
    checksum =
      payload
      |> :binary.bin_to_list()
      |> Enum.reduce(0, fn byte, acc -> bxor(acc, byte) end)

    <<version::8, length::16, payload::binary, checksum::8>>
  end
end

# Build and parse a valid packet
packet = Protocol.build_packet(1, "hello")
Protocol.parse_packet(packet)
# => {:ok, %{version: 1, payload: "hello"}}

# Malformed data
Protocol.parse_packet(<<1, 2>>)
# => {:error, :malformed_packet}`,
        walkthrough: [
          "The binary pattern <<version::8, length::16, payload::binary-size(length), checksum::8>> does all the heavy lifting. It extracts the version (1 byte), length (2 bytes big-endian), exactly length bytes of payload, and the checksum (1 byte).",
          "The binary-size(length) modifier is key — it uses the previously matched length variable to know how many bytes to extract for the payload. This is dynamic pattern matching on binaries.",
          "We compute the expected checksum by XORing all payload bytes together. :binary.bin_to_list converts the binary payload to a list of byte integers, then Enum.reduce folds them with bxor.",
          "If the pattern doesn't match at all (wrong number of bytes, etc.), the catch-all clause returns :malformed_packet. If the pattern matches but the checksum is wrong, we return :invalid_checksum.",
          "The build_packet helper shows the reverse operation — constructing a valid binary packet. This pattern of having paired parse/build functions is common in protocol implementations.",
        ],
      },
    ],
  },
};

export default stringsInDepth;
