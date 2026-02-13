import type { TopicContent } from "@/lib/types";

const basicDataTypes: TopicContent = {
  meta: {
    slug: "basic-data-types",
    title: "Basic Data Types & Operators",
    description: "Integers, floats, atoms, strings, booleans, nil, and arithmetic/comparison operators",
    number: 1,
    active: true,
  },

  eli5: {
    analogyTitle: "The LEGO Brick Box",
    analogy:
      "Imagine Elixir gives you a big LEGO brick box. Each type of brick has a different shape and purpose. You can't jam a round peg into a square hole — but that's a feature, not a bug! Knowing which brick is which lets you build amazing things without surprises.",
    items: [
      { label: "Integers", description: "Square bricks — solid, exact, no fractions. Like counting LEGO studs: 1, 2, 42, 1_000_000." },
      { label: "Floats", description: "Hinge bricks — they have a decimal point that lets them bend. 3.14, 0.5, -2.7." },
      { label: "Atoms", description: "Name-tag stickers — the name IS the value. :ok, :error, :hello. You read them, you know what they mean." },
      { label: "Strings", description: "Letter chains — sequences of characters snapped together in double quotes. \"hello world\"." },
      { label: "Booleans", description: "Light-switch bricks — they're either on (true) or off (false). That's it." },
      { label: "nil", description: "An empty slot — it means \"nothing here\". Like a LEGO baseplate with no bricks on it." },
    ],
    keyTakeaways: [
      "Elixir has distinct types for whole numbers (integers), decimal numbers (floats), labels (atoms), text (strings), and yes/no values (booleans).",
      "true, false, and nil are actually atoms under the hood — :true, :false, and :nil.",
      "Elixir is dynamically typed: you don't declare types, but values always know what type they are.",
      "Division with / always returns a float. Use div/2 and rem/2 for integer division.",
      "The === operator checks value AND type, while == allows number coercion.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "Integer", color: "#6b46c1", examples: ["42", "-17", "1_000_000", "0xFF", "0b1010"], description: "Arbitrary-precision whole numbers. Underscores allowed as visual separators." },
      { name: "Float", color: "#2563eb", examples: ["3.14", "-0.001", "1.0e10"], description: "64-bit double-precision floating point. Always need a digit on each side of the dot." },
      { name: "Atom", color: "#d97706", examples: [":ok", ":error", ":hello_world", "true", "false", "nil"], description: "Constants where the name is the value. Booleans and nil are atoms too." },
      { name: "String", color: "#059669", examples: ["\"hello\"", "\"Elixir\"", "\"multi\\nline\""], description: "UTF-8 encoded binaries in double quotes. Support interpolation with #{}." },
      { name: "Boolean", color: "#e11d48", examples: ["true", "false"], description: "Just two values. Aliases for the atoms :true and :false." },
      { name: "nil", color: "#6b7280", examples: ["nil"], description: "Represents absence of a value. Alias for the atom :nil." },
    ],
    operatorGroups: [
      {
        name: "Arithmetic",
        operators: [
          { symbol: "+", description: "Addition" },
          { symbol: "-", description: "Subtraction" },
          { symbol: "*", description: "Multiplication" },
          { symbol: "/", description: "Division (always returns float)" },
          { symbol: "div", description: "Integer division" },
          { symbol: "rem", description: "Remainder (modulo)" },
        ],
      },
      {
        name: "Comparison",
        operators: [
          { symbol: "==", description: "Equal (with number coercion)" },
          { symbol: "===", description: "Strict equal (type matters)" },
          { symbol: "!=", description: "Not equal" },
          { symbol: ">", description: "Greater than" },
          { symbol: "<", description: "Less than" },
          { symbol: ">=", description: "Greater than or equal" },
          { symbol: "<=", description: "Less than or equal" },
        ],
      },
      {
        name: "Boolean",
        operators: [
          { symbol: "and", description: "Strict AND (expects boolean)" },
          { symbol: "or", description: "Strict OR (expects boolean)" },
          { symbol: "not", description: "Strict NOT (expects boolean)" },
          { symbol: "&&", description: "Relaxed AND (any truthy/falsy)" },
          { symbol: "||", description: "Relaxed OR (any truthy/falsy)" },
          { symbol: "!", description: "Relaxed NOT (any truthy/falsy)" },
        ],
      },
      {
        name: "String",
        operators: [
          { symbol: "<>", description: "String concatenation" },
          { symbol: "\#{}", description: "String interpolation (inside \"\")" },
        ],
      },
    ],
  },

  deepDive: {
    sections: [
      {
        title: "Integers",
        prose: [
          "Elixir integers have arbitrary precision — they can be as large as your memory allows. No overflow, no BigInteger class needed. Under the hood, the BEAM VM handles the switch from small to big integers automatically.",
          "You can use underscores as visual separators in large numbers, and write in different bases using prefixes: 0x for hex, 0o for octal, and 0b for binary.",
        ],
        code: {
          title: "Integer examples",
          code: `# Decimal
age = 42
big = 1_000_000_000

# Different bases
hex = 0xFF        # 255
octal = 0o777     # 511
binary = 0b1010   # 10

# Arbitrary precision — no overflow!
huge = 999_999_999_999_999_999_999`,
          output: "999999999999999999999",
        },
      },
      {
        title: "Floats",
        prose: [
          "Floats in Elixir are 64-bit double-precision IEEE 754 numbers. They require a digit before and after the decimal point — 1.0 is valid, but 1. or .5 are not.",
          "Be aware of the usual floating-point pitfalls: 0.1 + 0.2 won't exactly equal 0.3. For money or other precision-critical calculations, use a library like Decimal.",
        ],
        code: {
          title: "Float examples",
          code: `pi = 3.14159
negative = -0.001
scientific = 1.0e10   # 10_000_000_000.0

# The classic floating-point trap
0.1 + 0.2  # => 0.30000000000000004

# Float functions
round(3.7)    # => 4
trunc(3.7)    # => 3
ceil(3.2)     # => 4
floor(3.7)    # => 3`,
          output: "0.30000000000000004",
        },
      },
      {
        title: "Atoms",
        prose: [
          "Atoms are constants where the name is the value itself. They're similar to symbols in Ruby or enums in other languages. Atoms are stored in a global atom table and are compared by identity, making equality checks extremely fast.",
          "Booleans true and false are actually the atoms :true and :false. Similarly, nil is the atom :nil. Module names like String or Enum are also atoms — they're just atoms that start with Elixir. (e.g., String is really :\"Elixir.String\").",
          "Warning: atoms are not garbage collected. Don't dynamically create atoms from user input — this can exhaust the atom table and crash the VM.",
        ],
        code: {
          title: "Atom examples",
          code: `:ok
:error
:hello_world

# Booleans are atoms
true == :true     # => true
false == :false   # => true
nil == :nil       # => true

# Atoms with special characters need quotes
:"atoms with spaces"
:"Elixir.String"

# Commonly used in tagged tuples
{:ok, "success"}
{:error, "not found"}`,
          output: "{:error, \"not found\"}",
        },
      },
      {
        title: "Strings",
        prose: [
          "Strings in Elixir are UTF-8 encoded binaries, wrapped in double quotes. They support interpolation with \#{} and common escape sequences like \\n and \\t.",
          "Single-quoted values like 'hello' are NOT strings — they're charlists (lists of character codepoints). This is a common source of confusion for newcomers. Always use double quotes for strings.",
        ],
        code: {
          title: "String examples",
          code: `name = "Elixir"

# Interpolation
"Hello, \#{name}!"  # => "Hello, Elixir!"

# Concatenation with <>
"Hello, " <> "world!"  # => "Hello, world!"

# Multi-line
multi = "line one
line two"

# String functions
String.length("hello")     # => 5
String.upcase("hello")     # => "HELLO"
String.split("a,b,c", ",") # => ["a", "b", "c"]
String.contains?("hello", "ell")  # => true`,
          output: "true",
        },
      },
      {
        title: "Booleans & nil",
        prose: [
          "Elixir has three \"falsy\" values: false, nil, and nothing else. Every other value is truthy — including 0, empty strings, and empty lists. This is different from many other languages.",
          "The strict boolean operators (and, or, not) require their first argument to be a boolean. The relaxed operators (&&, ||, !) work with any value — they return the value that determined the result, not necessarily true or false.",
        ],
        code: {
          title: "Truthiness & boolean operators",
          code: `# Strict operators — first arg must be boolean
true and true    # => true
false or true    # => true
not false        # => true

# Relaxed operators — work with any value
nil && "hello"   # => nil
"hi" && "hello"  # => "hello"
nil || "default" # => "default"
0 || "fallback"  # => 0  (0 is truthy!)

# Common pattern: default values
username = nil
display = username || "Anonymous"  # => "Anonymous"`,
          output: "\"Anonymous\"",
        },
      },
      {
        title: "Arithmetic & Comparison Operators",
        prose: [
          "The / operator always returns a float, even when both operands are integers. Use div/2 for integer division and rem/2 for the remainder. This catches many beginners off guard.",
          "Elixir has two equality operators: == does number coercion (1 == 1.0 is true), while === checks type and value (1 === 1.0 is false). For comparisons across different types, Elixir has a defined ordering: number < atom < reference < function < port < pid < tuple < map < list < bitstring.",
        ],
        code: {
          title: "Operators in action",
          code: `# Division gotcha
10 / 3      # => 3.3333333333333335
div(10, 3)  # => 3
rem(10, 3)  # => 1

# Equality vs strict equality
1 == 1.0    # => true  (number coercion)
1 === 1.0   # => false (different types!)

# Comparison across types works!
1 < :atom   # => true (number < atom)

# Chaining comparisons
x = 5
x > 0 and x < 10  # => true`,
          output: "true",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "What does 10 / 3 return in Elixir?",
        options: [
          { label: "3" },
          { label: "3.3333333333333335", correct: true },
          { label: "3.33" },
          { label: "An error" },
        ],
        explanation:
          "The / operator in Elixir always returns a float, even when both operands are integers. To get integer division, use div(10, 3) which returns 3.",
      },
      {
        question: "Which of these is NOT an atom?",
        options: [
          { label: ":hello" },
          { label: "true" },
          { label: "\"ok\"", correct: true },
          { label: "nil" },
        ],
        explanation:
          "\"ok\" is a string (double-quoted), not an atom. :hello is an atom, and true and nil are special atoms (:true and :nil under the hood).",
      },
      {
        question: "What does 1 === 1.0 evaluate to?",
        options: [
          { label: "true" },
          { label: "false", correct: true },
          { label: "An error" },
          { label: "nil" },
        ],
        explanation:
          "The === operator checks both value and type. 1 is an integer and 1.0 is a float — different types, so it returns false. The == operator would return true because it allows number coercion.",
      },
      {
        question: "Which value is truthy in Elixir?",
        options: [
          { label: "false" },
          { label: "nil" },
          { label: "0", correct: true },
          { label: "All of the above are falsy" },
        ],
        explanation:
          "In Elixir, only false and nil are falsy. Everything else is truthy — including 0, empty strings \"\", and empty lists []. This differs from languages like JavaScript or Python.",
      },
      {
        question: "How do you concatenate two strings in Elixir?",
        options: [
          { label: "\"a\" + \"b\"" },
          { label: "\"a\" ++ \"b\"" },
          { label: "\"a\" <> \"b\"", correct: true },
          { label: "concat(\"a\", \"b\")" },
        ],
        explanation:
          "The <> operator is used for string concatenation in Elixir. The + operator is for numbers, ++ is for list concatenation, and there's no built-in concat function for strings.",
      },
      {
        question: "What is the result of is_atom(true) in Elixir?",
        options: [
          { label: "false" },
          { label: "true", correct: true },
          { label: "An ArgumentError" },
          { label: ":true" },
        ],
        explanation:
          "In Elixir, booleans are atoms under the hood. true is actually the atom :true and false is the atom :false. Therefore is_atom(true) returns true, and is_boolean(:true) also returns true.",
      },
      {
        question: "What does the expression 'hello' represent in Elixir?",
        options: [
          { label: "A string, same as \"hello\"" },
          { label: "A charlist (list of character codepoints)", correct: true },
          { label: "An atom" },
          { label: "A syntax error" },
        ],
        explanation:
          "Single-quoted values in Elixir are charlists, not strings. A charlist is a list of integer codepoints, so 'hello' is equivalent to [104, 101, 108, 108, 111]. Double-quoted values like \"hello\" are UTF-8 encoded binaries (strings). Confusing the two is a common mistake for newcomers.",
      },
      {
        question: "What does div(-7, 2) return in Elixir?",
        options: [
          { label: "-4" },
          { label: "-3", correct: true },
          { label: "-3.5" },
          { label: "3" },
        ],
        explanation:
          "Elixir's div/2 performs truncated integer division, meaning it rounds toward zero rather than toward negative infinity. So div(-7, 2) returns -3, not -4. This is important to understand when working with negative numbers and integer division.",
      },
      {
        question: "What happens when you evaluate the expression: not 0",
        options: [
          { label: "true, because 0 is falsy" },
          { label: "false, because 0 is truthy" },
          { label: "An ArgumentError, because not requires a boolean", correct: true },
          { label: "nil" },
        ],
        explanation:
          "The strict boolean operator not requires its argument to be an actual boolean (true or false). Passing 0 raises an ArgumentError. If you want to negate a truthy/falsy value, use the relaxed operator ! instead — !0 returns false because 0 is truthy in Elixir.",
      },
      {
        question: "Which of the following correctly describes Elixir's cross-type comparison ordering?",
        options: [
          { label: "Comparing different types always raises an error" },
          { label: "number < atom < reference < function < port < pid < tuple < map < list < bitstring", correct: true },
          { label: "atom < number < list < tuple < map < bitstring" },
          { label: "Types are compared alphabetically by their type name" },
        ],
        explanation:
          "Elixir defines a global term ordering that allows values of different types to be compared. The ordering is: number < atom < reference < function < port < pid < tuple < map < list < bitstring. This means 1 < :atom and {:a} < [1] are both true. This is essential knowledge for understanding how Enum.sort works on heterogeneous collections.",
      },
      {
        question: "What is the result of String.length(\"café\")?",
        options: [
          { label: "5" },
          { label: "4", correct: true },
          { label: "6" },
          { label: "An error because of the non-ASCII character" },
        ],
        explanation:
          "String.length/1 counts Unicode graphemes, not bytes. The string \"café\" contains 4 graphemes (c, a, f, é), so it returns 4. However, byte_size(\"café\") would return 5 because the é character takes 2 bytes in UTF-8 encoding. This distinction between grapheme count and byte size is critical when working with internationalized text.",
      },
      {
        question: "What does the expression 1.0e309 evaluate to in Elixir?",
        options: [
          { label: "A very large float" },
          { label: "Infinity" },
          { label: "A compile-time error due to float overflow", correct: true },
          { label: "0.0" },
        ],
        explanation:
          "Unlike some languages that return Infinity for float overflow, Elixir (via the BEAM) raises a compile-time error (TokenMissingError or equivalent) because 1.0e309 exceeds the maximum representable 64-bit IEEE 754 double-precision float. Elixir does not have Infinity or NaN as valid float values.",
      },
      {
        question: "What does nil && \"hello\" return?",
        options: [
          { label: "\"hello\"" },
          { label: "false" },
          { label: "nil", correct: true },
          { label: "An ArgumentError" },
        ],
        explanation:
          "The relaxed && operator short-circuits on falsy values. Since nil is falsy, it returns nil immediately without evaluating the right-hand side. Note that && returns the actual value that determined the result, not necessarily a boolean. This is different from the strict and operator, which would raise an ArgumentError because nil is not a boolean.",
      },
      {
        question: "What is the maximum size of an integer in Elixir?",
        options: [
          { label: "2^63 - 1 (same as a 64-bit signed integer)" },
          { label: "2^128 - 1" },
          { label: "There is no fixed maximum — integers have arbitrary precision", correct: true },
          { label: "It depends on the OS architecture (32-bit vs 64-bit)" },
        ],
        explanation:
          "Elixir integers have arbitrary precision, meaning they can grow as large as available memory allows. The BEAM VM automatically transitions between small integers (fitting in a machine word) and big integers (heap-allocated) transparently. There is no overflow and no need for a special BigInteger type.",
      },
      {
        question: "What does the expression \"hello\" > :world evaluate to?",
        options: [
          { label: "true", correct: true },
          { label: "false" },
          { label: "An ArgumentError because you can't compare strings and atoms" },
          { label: "nil" },
        ],
        explanation:
          "Elixir allows comparison between any types using the global term ordering: number < atom < reference < function < port < pid < tuple < map < list < bitstring. Since strings are bitstrings and atoms come before bitstrings in the ordering, \"hello\" > :world evaluates to true. This cross-type comparison capability is used internally by sorting functions.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "Type Detective",
        difficulty: "beginner",
        prompt:
          "For each of the following values, predict what i/0 (the IEx helper to show info) would report as the type: 42, 3.14, :banana, \"hello\", true, nil. Then verify by thinking about what you learned in the deep dive.",
        hints: [
          { text: "Remember that true, false, and nil are atoms under the hood." },
          { text: "Strings in Elixir are binaries (UTF-8 encoded), not charlists." },
          { text: "There's no separate boolean type — booleans are atoms." },
        ],
        solution: `# 42 → integer
i(42)       # Integer

# 3.14 → float
i(3.14)     # Float

# :banana → atom
i(:banana)  # Atom

# "hello" → string (binary)
i("hello")  # BitString (binary, UTF-8)

# true → atom (boolean)
i(true)     # Atom
is_boolean(true)   # => true
is_atom(true)      # => true

# nil → atom
i(nil)      # Atom
is_atom(nil)       # => true`,
        walkthrough: [
          "42 is a straightforward integer — whole number, no decimal point.",
          "3.14 has a decimal point, making it a float (64-bit double precision).",
          ":banana starts with a colon, so it's an atom.",
          "\"hello\" is in double quotes, making it a string (which is a UTF-8 binary in Elixir).",
          "true is a boolean, but booleans ARE atoms. is_boolean(true) and is_atom(true) both return true.",
          "nil is also an atom (:nil). It represents the absence of a value.",
        ],
      },
      {
        title: "String Builder",
        difficulty: "beginner",
        prompt:
          "Write an expression that takes a person's name and age (as variables) and produces the string: \"Hi, I'm <name> and I'm <age> years old!\". Do it two ways: once with interpolation and once with concatenation.",
        hints: [
          { text: "String interpolation uses \#{} inside double-quoted strings." },
          { text: "For concatenation, remember you need to convert the integer age to a string. Check out Integer.to_string/1." },
          { text: "The <> operator concatenates strings." },
        ],
        solution: `name = "José"
age = 30

# Way 1: Interpolation (preferred)
"Hi, I'm \#{name} and I'm \#{age} years old!"

# Way 2: Concatenation
"Hi, I'm " <> name <> " and I'm " <> Integer.to_string(age) <> " years old!"`,
        walkthrough: [
          "First, we bind the variables name and age.",
          "Interpolation with \#{} automatically calls to_string on non-string values, so \#{age} just works even though age is an integer.",
          "With concatenation using <>, every piece must be a string. Since age is an integer, we must convert it with Integer.to_string(age) first.",
          "Interpolation is generally preferred in Elixir for readability and performance.",
        ],
      },
      {
        title: "Truthiness Tester",
        difficulty: "intermediate",
        prompt:
          "Predict the result of each expression, then verify your understanding:\n1. nil || \"hello\"\n2. false && \"hello\"\n3. 0 && \"hello\"\n4. \"\" || \"default\"\n5. not nil\n6. !nil",
        hints: [
          { text: "Remember: only false and nil are falsy. 0 and \"\" are truthy!" },
          { text: "The strict operators (and, or, not) require boolean first arguments. What happens with nil?" },
          { text: "Relaxed operators (&&, ||, !) return the value that determined the result, not necessarily a boolean." },
        ],
        solution: `# 1. nil is falsy, so || returns the right side
nil || "hello"     # => "hello"

# 2. false is falsy, so && short-circuits
false && "hello"   # => false

# 3. 0 is truthy! So && evaluates the right side
0 && "hello"       # => "hello"

# 4. "" is truthy! So || returns the left side
"" || "default"    # => ""

# 5. not requires a boolean — nil is not a boolean!
not nil            # => ** (ArgumentError)

# 6. ! works with any value — nil is falsy
!nil               # => true`,
        walkthrough: [
          "nil || \"hello\" → nil is falsy, so || moves to the right operand and returns \"hello\".",
          "false && \"hello\" → false is falsy, so && short-circuits and returns false without evaluating the right side.",
          "0 && \"hello\" → 0 is truthy in Elixir! So && evaluates the right side and returns \"hello\".",
          "\"\" || \"default\" → empty string is truthy in Elixir! So || returns \"\" (the left side).",
          "not nil → the strict not operator requires a boolean. nil is an atom, not a boolean, so this raises an ArgumentError.",
          "!nil → the relaxed ! operator works with any value. nil is falsy, so !nil returns true.",
        ],
      },
    ],
  },
};

export default basicDataTypes;
