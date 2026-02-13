import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Integer Division Returns a Float",
    description:
      "Using the / operator on two integers returns a float, not an integer. This surprises developers from languages like Python 3 (which has // for integer division) or Java. Use div/2 and rem/2 for integer division and remainder.",
    code: `# This returns a float, not an integer
10 / 2
#=> 5.0

# Use div/2 for integer division
div(10, 3)
#=> 3

# Use rem/2 for the remainder
rem(10, 3)
#=> 1`,
  },
  {
    title: "Atoms Are Never Garbage Collected",
    description:
      "Atoms are stored in a global atom table and are never garbage collected. Creating atoms dynamically (e.g., via String.to_atom/1 from user input) can exhaust the atom table and crash the VM. The default limit is 1,048,576 atoms. Always use String.to_existing_atom/1 when converting untrusted input.",
    code: `# DANGEROUS - creates new atoms from user input
user_input = "some_random_value"
String.to_atom(user_input)

# SAFE - only converts to atoms that already exist
String.to_existing_atom("ok")
#=> :ok

String.to_existing_atom("nonexistent")
#=> ** (ArgumentError) argument error`,
  },
  {
    title: "Charlists vs Strings Confusion",
    description:
      "Single-quoted literals like 'hello' are charlists (lists of integer codepoints), not strings. Double-quoted literals like \"hello\" are UTF-8 encoded binaries. They are completely different types and most String module functions only work with binaries.",
    code: `# This is a charlist (list of integers)
'hello'
#=> ~c"hello"

# This is a string (binary)
"hello"
#=> "hello"

is_list('hello')    #=> true
is_binary("hello")  #=> true

# They are NOT equal
'hello' == "hello"
#=> false`,
  },
  {
    title: "Booleans Are Just Atoms",
    description:
      "In Elixir, true and false are actually the atoms :true and :false. This means they can be used anywhere atoms are expected, but it also means is_atom(true) returns true, which can be surprising when pattern matching or checking types.",
    code: `true === :true
#=> true

false === :false
#=> true

is_atom(true)
#=> true

is_boolean(:true)
#=> true`,
  },
  {
    title: "Comparison Across Types Has a Fixed Ordering",
    description:
      "Elixir allows comparing values of different types without raising an error. The types follow a fixed sort order: number < atom < reference < function < port < pid < tuple < map < list < bitstring. This can lead to surprising results if you accidentally compare mismatched types.",
    code: `# These all return true — and may not be what you expect
1 < :atom
#=> true

:atom < "string"
#=> true

{1, 2} < [1, 2]
#=> true

# Sorting mixed types uses this ordering
Enum.sort([3, :b, "a", 1])
#=> [1, 3, :b, "a"]`,
  },
];

export default gotchas;
