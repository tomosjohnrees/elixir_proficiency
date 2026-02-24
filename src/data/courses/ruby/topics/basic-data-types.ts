import type { TopicContent } from "@/lib/types";
import questions from "./questions/basic-data-types";
import gotchas from "./gotchas/basic-data-types";

const basicDataTypes: TopicContent = {
  meta: {
    slug: "basic-data-types",
    title: "Basic Data Types & Variables",
    description:
      "Integers, floats, strings, booleans, nil, type conversion, and variable assignment",
    number: 1,
    active: true,
  },

  eli5: {
    analogyTitle: "The Toolbox Drawer",
    analogy:
      "Imagine Ruby gives you a toolbox with different drawers. Each drawer holds a different kind of thing — numbers, words, yes/no switches, and an empty drawer that means \"nothing here yet.\" The neat part is every single thing in your toolbox is a living object with its own skills. Even the number 5 can do tricks!",
    items: [
      {
        label: "Integers",
        description:
          "Whole number blocks — solid, exact, no fractions. 42, -17, 1_000_000. They can be as big as your memory allows.",
      },
      {
        label: "Floats",
        description:
          "Decimal rulers — numbers with a point in them. 3.14, -0.001, 2.0. Watch out for tiny rounding surprises.",
      },
      {
        label: "Strings",
        description:
          "Word chains — sequences of characters in quotes. \"hello\" with double quotes lets you embed values inside; 'hello' with single quotes takes everything literally.",
      },
      {
        label: "Booleans",
        description:
          "Light switches — either on (true) or off (false). Only two possible values.",
      },
      {
        label: "nil",
        description:
          "The empty drawer — it means \"nothing here.\" It's Ruby's way of saying a value doesn't exist yet.",
      },
      {
        label: "Symbols",
        description:
          "Name tags — lightweight labels like :ok or :error. They look like strings but are immutable and stored just once in memory.",
      },
    ],
    keyTakeaways: [
      "Everything in Ruby is an object — even integers, nil, and true/false have methods you can call.",
      "Ruby has exactly two falsy values: false and nil. Everything else is truthy, including 0 and empty strings.",
      "Integer division truncates: 10 / 3 gives 3, not 3.333. Use a float operand to get a decimal result.",
      "Variable names use sigils to show scope: no prefix (local), @ (instance), @@ (class), $ (global).",
      "Strings in double quotes support interpolation (\#{expr}) and escape sequences; single quotes are literal.",
    ],
  },

  visuals: {
    dataTypes: [
      {
        name: "Integer",
        color: "#6b46c1",
        examples: ["42", "-17", "1_000_000", "0xFF", "0b1010"],
        description:
          "Arbitrary-precision whole numbers. Underscores allowed as visual separators. Hex, octal, and binary prefixes supported.",
      },
      {
        name: "Float",
        color: "#2563eb",
        examples: ["3.14", "-0.001", "1.0e10", "2.0"],
        description:
          "64-bit double-precision IEEE 754 numbers. Must have a digit before and after the decimal point.",
      },
      {
        name: "String",
        color: "#059669",
        examples: ["\"hello\"", "'world'", "%q(raw)", "%Q(interpolated)"],
        description:
          "Mutable sequences of bytes. Double quotes support interpolation and escapes; single quotes are literal.",
      },
      {
        name: "Symbol",
        color: "#d97706",
        examples: [":ok", ":error", ":hello_world", ":\"with spaces\""],
        description:
          "Immutable, interned identifiers. Faster comparison than strings. Used extensively as hash keys.",
      },
      {
        name: "Boolean",
        color: "#e11d48",
        examples: ["true", "false"],
        description:
          "Instances of TrueClass and FalseClass. Only false and nil are falsy in Ruby.",
      },
      {
        name: "nil",
        color: "#6b7280",
        examples: ["nil"],
        description:
          "The sole instance of NilClass. Represents the absence of a value. Falsy in boolean context.",
      },
    ],
    operatorGroups: [
      {
        name: "Arithmetic",
        operators: [
          { symbol: "+", description: "Addition" },
          { symbol: "-", description: "Subtraction" },
          { symbol: "*", description: "Multiplication" },
          { symbol: "/", description: "Division (integer if both operands are integers)" },
          { symbol: "%", description: "Modulo (remainder)" },
          { symbol: "**", description: "Exponentiation" },
        ],
      },
      {
        name: "Comparison",
        operators: [
          { symbol: "==", description: "Value equality" },
          { symbol: "!=", description: "Not equal" },
          { symbol: "<=>", description: "Spaceship (combined comparison)" },
          { symbol: ">", description: "Greater than" },
          { symbol: "<", description: "Less than" },
          { symbol: ">=", description: "Greater than or equal" },
          { symbol: "<=", description: "Less than or equal" },
        ],
      },
      {
        name: "Logical",
        operators: [
          { symbol: "&&", description: "AND (high precedence)" },
          { symbol: "||", description: "OR (high precedence)" },
          { symbol: "!", description: "NOT" },
          { symbol: "and", description: "AND (low precedence, for flow control)" },
          { symbol: "or", description: "OR (low precedence, for flow control)" },
          { symbol: "not", description: "NOT (low precedence)" },
        ],
      },
      {
        name: "Assignment",
        operators: [
          { symbol: "=", description: "Simple assignment" },
          { symbol: "+=", description: "Add and assign" },
          { symbol: "-=", description: "Subtract and assign" },
          { symbol: "||=", description: "Assign if nil/false (conditional)" },
          { symbol: "&&=", description: "Assign if truthy" },
        ],
      },
    ],
  },

  deepDive: {
    sections: [
      {
        title: "Integers",
        prose: [
          "Ruby integers have arbitrary precision — they can grow as large as your memory allows. There's no overflow and no separate BigInteger class. Since Ruby 2.4, Fixnum and Bignum were unified into a single Integer class.",
          "You can use underscores as visual separators in large numbers, and write in different bases using prefixes: 0x for hex, 0o for octal, and 0b for binary. Every integer is an object, so you can call methods directly on number literals.",
        ],
        code: {
          title: "Integer examples",
          code: `# Standard integers
age = 42
big = 1_000_000_000

# Different bases
hex = 0xFF        # 255
octal = 0o777     # 511
binary = 0b1010   # 10

# Arbitrary precision — no overflow!
huge = 2 ** 1000  # a 302-digit number

# Everything is an object
42.even?          #=> true
-5.abs            #=> 5
3.times { |i| puts i }  # prints 0, 1, 2`,
          output: "0\n1\n2",
        },
      },
      {
        title: "Floats",
        prose: [
          "Floats in Ruby are 64-bit double-precision IEEE 754 numbers. They require a digit before and after the decimal point — 1.0 is valid, but 1. or .5 are not.",
          "Be aware of the usual floating-point pitfalls: 0.1 + 0.2 won't exactly equal 0.3. For money or precision-critical calculations, use the BigDecimal standard library or store amounts as integer cents.",
        ],
        code: {
          title: "Float examples",
          code: `pi = 3.14159
negative = -0.001
scientific = 1.0e10   # 10_000_000_000.0

# The classic floating-point trap
0.1 + 0.2 == 0.3    #=> false
0.1 + 0.2            #=> 0.30000000000000004

# Float methods
3.7.round    #=> 4
3.7.floor    #=> 3
3.7.ceil     #=> 4
3.7.truncate #=> 3

# Converting between types
42.to_f      #=> 42.0
3.14.to_i    #=> 3  (truncates, doesn't round)`,
          output: "3",
        },
      },
      {
        title: "Strings",
        prose: [
          "Ruby strings are mutable sequences of bytes. Double-quoted strings support interpolation with \#{} and escape sequences like \\n and \\t. Single-quoted strings treat everything literally except for \\\\ and \\'.",
          "Because strings are mutable, each string literal typically creates a new object. You can freeze strings with .freeze or enable frozen string literals globally with the magic comment # frozen_string_literal: true at the top of a file. Ruby also has heredocs for multi-line strings and %q/%Q for alternative delimiters.",
        ],
        code: {
          title: "String examples",
          code: `name = "Ruby"

# Interpolation (double quotes only)
"Hello, #{name}!"       #=> "Hello, Ruby!"
'Hello, #{name}!'       #=> "Hello, \#{name}!"

# Concatenation
"Hello, " + "world!"    #=> "Hello, world!"
"Hello, " << "world!"   # mutating append

# Useful methods
"hello".upcase           #=> "HELLO"
"hello".length           #=> 5
"hello world".split      #=> ["hello", "world"]
"hello".include?("ell")  #=> true
"hello".reverse          #=> "olleh"
"  hi  ".strip           #=> "hi"

# Multi-line heredoc
message = <<~HEREDOC
  This is a
  multi-line string
HEREDOC`,
          output: "\"This is a\\nmulti-line string\\n\"",
        },
      },
      {
        title: "Symbols",
        prose: [
          "Symbols are immutable, interned identifiers. They look like :name and are stored in a global symbol table so that every occurrence of :name is the exact same object in memory. This makes equality checks extremely fast (identity comparison vs character-by-character).",
          "Symbols are used extensively as hash keys, method names, and lightweight labels. Since Ruby 2.2, most dynamically created symbols are garbage collected, reducing the risk of memory leaks from dynamic symbol creation.",
        ],
        code: {
          title: "Symbol examples",
          code: `:hello
:error
:hello_world

# Same symbol = same object
:hello.object_id == :hello.object_id  #=> true

# Strings are different objects each time
"hello".object_id == "hello".object_id  #=> false

# Symbols as hash keys (idiomatic Ruby)
user = { name: "Alice", age: 30 }
user[:name]  #=> "Alice"

# Converting between strings and symbols
"hello".to_sym   #=> :hello
:hello.to_s      #=> "hello"`,
          output: "\"hello\"",
        },
      },
      {
        title: "Booleans & nil",
        prose: [
          "Ruby has exactly two falsy values: false and nil. Everything else is truthy — including 0, empty strings, and empty arrays. This is simpler than many other languages and reduces ambiguity.",
          "true is the sole instance of TrueClass, false is the sole instance of FalseClass, and nil is the sole instance of NilClass. Each is a full-fledged object with methods. The || and && operators return the value that determined the result, not necessarily true or false — this enables elegant default-value patterns.",
        ],
        code: {
          title: "Truthiness & boolean logic",
          code: `# Only false and nil are falsy
!!false    #=> false
!!nil      #=> false
!!0        #=> true  (0 is truthy!)
!!""       #=> true  (empty string is truthy!)
!![]       #=> true  (empty array is truthy!)

# || returns the first truthy value
nil || "default"     #=> "default"
false || "fallback"  #=> "fallback"
"first" || "second"  #=> "first"

# && returns the first falsy value, or the last value
nil && "hello"       #=> nil
"hi" && "hello"      #=> "hello"

# Common pattern: default values with ||=
username = nil
username ||= "Anonymous"  #=> "Anonymous"

# nil checking
nil.nil?    #=> true
false.nil?  #=> false
0.nil?      #=> false`,
          output: "false",
        },
      },
      {
        title: "Variables & Scope",
        prose: [
          "Ruby uses naming conventions enforced by the language to indicate variable scope. Local variables start with a lowercase letter or underscore, instance variables with @, class variables with @@, and global variables with $. Constants start with an uppercase letter.",
          "Local variables are scoped to the current method or block. Unlike many languages, Ruby doesn't require a keyword like let or var for declaration — simply assigning to a new name creates the variable. Parallel assignment (a, b = 1, 2) and swap syntax (a, b = b, a) are also supported.",
        ],
        code: {
          title: "Variable types and assignment",
          code: `# Local variables
name = "Ruby"
_private = "convention for unused"

# Multiple assignment
a, b, c = 1, 2, 3
first, *rest = [1, 2, 3, 4]  #=> first=1, rest=[2, 3, 4]

# Swap without temp variable
a, b = b, a

# Instance variables (per-object)
@name = "Alice"

# Class variables (shared across instances)
@@count = 0

# Global variables (avoid these!)
$debug = true

# Constants
MAX_SIZE = 100
PI = 3.14159

# Constants are not truly constant — just a warning
MAX_SIZE = 200  # warning: already initialized constant`,
          output: "200",
        },
      },
      {
        title: "Type Conversion",
        prose: [
          "Ruby provides two styles of type conversion: permissive methods (.to_i, .to_f, .to_s) that try their best and never raise errors, and strict kernel methods (Integer(), Float(), String()) that raise exceptions on invalid input.",
          "Understanding the difference is crucial. Permissive conversions can mask bugs: \"hello\".to_i silently returns 0, and nil.to_i also returns 0. Strict conversions with Integer() and Float() raise ArgumentError or TypeError, making them better for validating external input.",
        ],
        code: {
          title: "Conversion methods",
          code: `# Permissive (to_*) — best effort, never raises
"42".to_i        #=> 42
"3.14".to_f      #=> 3.14
"hello".to_i     #=> 0  (silently returns 0!)
nil.to_i         #=> 0
42.to_s          #=> "42"
nil.to_s         #=> ""

# Strict (Kernel methods) — raises on invalid input
Integer("42")    #=> 42
Integer("hello") #=> ArgumentError!
Float("3.14")    #=> 3.14
Float(nil)       #=> TypeError!

# Integer() understands bases
Integer("0xFF")  #=> 255
Integer("0b1010") #=> 10

# Type checking
42.is_a?(Integer)    #=> true
42.is_a?(Numeric)    #=> true  (parent class)
"hi".is_a?(String)   #=> true
nil.is_a?(NilClass)  #=> true`,
          output: "true",
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
        title: "Type Explorer",
        difficulty: "beginner",
        prompt:
          "For each of the following values, predict what .class will return: 42, 3.14, \"hello\", :world, true, nil, [1,2,3]. Then predict what 42.is_a?(Numeric) returns and explain why.",
        hints: [
          {
            text: "Remember that since Ruby 2.4, Fixnum and Bignum were unified into Integer.",
          },
          {
            text: ".class returns the most specific class, while .is_a? checks the entire inheritance chain.",
          },
          {
            text: "Integer inherits from Numeric, so is_a?(Numeric) checks if Integer is a descendant.",
          },
        ],
        solution: `# .class returns the specific class
42.class       #=> Integer
3.14.class     #=> Float
"hello".class  #=> String
:world.class   #=> Symbol
true.class     #=> TrueClass
nil.class      #=> NilClass
[1,2,3].class  #=> Array

# .is_a? checks the full inheritance chain
42.is_a?(Integer)  #=> true  (exact class)
42.is_a?(Numeric)  #=> true  (parent class)
42.is_a?(Object)   #=> true  (grandparent)
42.is_a?(Float)    #=> false (sibling, not ancestor)

# You can see the full chain with .ancestors
Integer.ancestors
#=> [Integer, Numeric, Comparable, Object, Kernel, BasicObject]`,
        walkthrough: [
          "42 is an Integer — the unified integer class since Ruby 2.4.",
          "3.14 is a Float — 64-bit double-precision floating point.",
          "\"hello\" is a String — a mutable sequence of characters.",
          ":world is a Symbol — an immutable, interned identifier.",
          "true is a TrueClass, not Boolean — Ruby has no Boolean class.",
          "nil is a NilClass — the sole instance representing absence.",
          "[1,2,3] is an Array — an ordered, integer-indexed collection.",
          "42.is_a?(Numeric) returns true because Integer inherits from Numeric. The .is_a? method walks up the ancestor chain.",
        ],
      },
      {
        title: "String Manipulation Challenge",
        difficulty: "beginner",
        prompt:
          "Create a variable `greeting` that contains your name and age using string interpolation. Then create the same string using concatenation (the + operator). What extra step do you need for concatenation that interpolation handles automatically?",
        hints: [
          {
            text: "String interpolation uses \#{} inside double-quoted strings.",
          },
          {
            text: "The + operator requires both sides to be strings. How do you convert an integer?",
          },
          {
            text: "Interpolation automatically calls .to_s on non-string values.",
          },
        ],
        solution: `name = "Alice"
age = 30

# Way 1: Interpolation (preferred)
greeting = "Hi, I'm #{name} and I'm #{age} years old!"

# Way 2: Concatenation (must convert age manually)
greeting = "Hi, I'm " + name + " and I'm " + age.to_s + " years old!"

# Without .to_s, you'd get:
# "Hi, I'm " + name + " and I'm " + age + " years old!"
# => TypeError: no implicit conversion of Integer into String`,
        walkthrough: [
          "First, we set name to a String and age to an Integer.",
          "Interpolation with \#{} automatically calls .to_s on the value, so \#{age} converts 30 to \"30\" for us.",
          "With concatenation using +, every piece must already be a String. Since age is an Integer, we must call .to_s explicitly.",
          "Forgetting .to_s with + raises a TypeError — Ruby won't implicitly convert types in concatenation.",
          "Interpolation is generally preferred: it's more readable, faster, and handles type conversion automatically.",
        ],
      },
      {
        title: "Truthiness Detective",
        difficulty: "intermediate",
        prompt:
          "Predict the result of each expression, then verify your understanding:\n1. nil || \"hello\"\n2. false && \"hello\"\n3. 0 && \"hello\"\n4. \"\" || \"default\"\n5. nil.to_i + false.to_i\n6. Integer(nil) rescue \"caught\"",
        hints: [
          {
            text: "Remember: only false and nil are falsy in Ruby. 0 and \"\" are truthy!",
          },
          {
            text: "|| returns the first truthy value. && returns the first falsy value, or the last value if all are truthy.",
          },
          {
            text: "false.to_i? Think about what TrueClass and FalseClass respond to. Hint: they don't have .to_i by default.",
          },
        ],
        solution: `# 1. nil is falsy, so || returns the right side
nil || "hello"
#=> "hello"

# 2. false is falsy, so && short-circuits
false && "hello"
#=> false

# 3. 0 is truthy! So && evaluates the right side
0 && "hello"
#=> "hello"

# 4. "" is truthy! So || returns the left side
"" || "default"
#=> ""

# 5. nil.to_i is 0, but false has no .to_i method
nil.to_i + false.to_i
#=> NoMethodError: undefined method 'to_i' for false:FalseClass

# 6. Integer(nil) raises TypeError, rescued inline
Integer(nil) rescue "caught"
#=> "caught"`,
        walkthrough: [
          "nil || \"hello\" — nil is falsy, so || moves to the right side and returns \"hello\".",
          "false && \"hello\" — false is falsy, so && short-circuits and returns false.",
          "0 && \"hello\" — 0 is truthy in Ruby! So && evaluates the right side and returns \"hello\".",
          "\"\" || \"default\" — empty string is truthy in Ruby! So || returns \"\" (the left side).",
          "nil.to_i returns 0, but false doesn't have a .to_i method — this raises a NoMethodError. Unlike nil, false is not designed to convert to numeric types.",
          "Integer(nil) raises a TypeError, but the inline rescue catches it and returns \"caught\". This shows the difference between strict conversion (Integer()) and permissive conversion (nil.to_i).",
        ],
      },
    ],
  },
};

export default basicDataTypes;
