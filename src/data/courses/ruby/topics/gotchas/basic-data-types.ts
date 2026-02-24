import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Integer Division Truncates Silently",
    description:
      "Dividing two integers always returns an integer in Ruby, truncating the decimal. This is different from languages like Python 3 or Elixir where / returns a float. If you want a float result, make at least one operand a float.",
    code: `# Integer division — decimal is silently dropped
10 / 3
#=> 3  (not 3.333...)

# To get a float, use a float operand
10.0 / 3
#=> 3.3333333333333335

# Or convert with .to_f
10.to_f / 3
#=> 3.3333333333333335`,
  },
  {
    title: "Single vs Double Quotes Are Not Interchangeable",
    description:
      "Single-quoted strings don't support interpolation or most escape sequences. Only \\\\ and \\' are recognized in single quotes. This catches people who habitually alternate between quote styles — interpolation silently won't work.",
    code: `name = "Ruby"

# Double quotes — interpolation works
"Hello, #{name}!"
#=> "Hello, Ruby!"

# Single quotes — interpolation is treated as literal text
'Hello, #{name}!'
#=> "Hello, \#{name}!"

# Escape sequences differ too
"line1\\nline2"  #=> "line1\\nline2" (actual newline)
'line1\\nline2'  #=> "line1\\\\nline2" (literal \\n)`,
  },
  {
    title: "nil.to_i Returns 0, Not an Error",
    description:
      "Ruby's permissive conversion methods (.to_i, .to_f, .to_s) return default values for nil instead of raising errors. This can mask bugs where nil propagates silently through calculations. Use strict conversions (Integer(), Float()) when you need to catch invalid data.",
    code: `# Permissive — nil converts to defaults
nil.to_i   #=> 0
nil.to_f   #=> 0.0
nil.to_s   #=> ""
nil.to_a   #=> []

# Strict — nil raises an error
Integer(nil)
#=> TypeError: can't convert nil into Integer

# This bug is hard to spot:
user_input = nil
total = user_input.to_i * 5  #=> 0 (no error!)`,
  },
  {
    title: "Mutable Strings Can Cause Unexpected Aliasing",
    description:
      "Ruby strings are mutable by default, but assignment doesn't copy them — it creates a reference. Mutating one variable's string can affect another variable pointing to the same object. Use .dup or .freeze to avoid this.",
    code: `a = "hello"
b = a          # b points to the SAME object
b << " world"  # mutates the shared object

a  #=> "hello world"  — surprise!
b  #=> "hello world"

# Fix: use .dup to create a copy
a = "hello"
b = a.dup
b << " world"
a  #=> "hello"  — a is unchanged

# Or use .freeze to prevent mutation
a = "hello".freeze
a << " world"
#=> FrozenError: can't modify frozen String`,
  },
  {
    title: "Variable Scope with Blocks Can Surprise You",
    description:
      "Ruby blocks (do..end / {}) share the local scope of the surrounding code. A variable first assigned inside a block leaks into the outer scope. Block parameters, however, are block-local. This differs from many other languages where blocks create their own scope.",
    code: `# Variable created inside a block leaks out
3.times do |i|
  message = "hello"
end
message  #=> "hello"  — still accessible!

# But block parameters are local
3.times do |i|
  # i is block-local
end
i  #=> NameError: undefined local variable 'i'

# Shadow outer variables with semicolon syntax
x = "outer"
3.times do |i; x|
  x = "inner"
end
x  #=> "outer"  — shadowed, not overwritten`,
  },
];

export default gotchas;
