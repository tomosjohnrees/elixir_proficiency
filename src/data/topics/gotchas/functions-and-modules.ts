import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Captured Functions vs Anonymous Functions Syntax",
    description:
      "There are two function capture syntaxes that look similar but work differently. &Module.fun/arity captures a named function, while &(&1 + 1) creates a shorthand anonymous function. Mixing them up or nesting captures leads to confusing compile errors.",
    code: `# Capturing a named function
fun = &String.upcase/1
fun.("hello")
#=> "HELLO"

# Shorthand anonymous function
add_one = &(&1 + 1)
add_one.(5)
#=> 6

# You CANNOT nest captures
# &(&1 + &(&2))  #=> ** (CompileError)

# Named function must include arity
# fun = &String.upcase  #=> ** (CompileError)
fun = &String.upcase/1  # correct

# Anonymous functions use dot to call
fun = fn x -> x + 1 end
fun.(5)    #=> 6
# fun(5)  #=> ** (CompileError) — missing dot`,
  },
  {
    title: "Module Attributes Are Compile-Time Constants",
    description:
      "Module attributes like @my_value are resolved at compile time, not at runtime. If you set an attribute to a function call, that function runs during compilation and the result is baked into the module. This means they won't change between calls or reflect runtime state.",
    code: `defmodule MyApp do
  # This runs at COMPILE TIME, not runtime
  @timestamp DateTime.utc_now()

  def get_timestamp do
    # Always returns the same value — when the module was compiled
    @timestamp
  end
end

# Every call returns the same compile-time value
MyApp.get_timestamp()
#=> ~U[2024-01-15 10:30:00Z]  (always the same)

# For runtime values, use a function instead
defmodule MyApp do
  def get_timestamp, do: DateTime.utc_now()
end`,
  },
  {
    title: "Default Arguments Create Multiple Function Heads",
    description:
      "When you define default arguments with \\\\, Elixir generates multiple function clauses behind the scenes. If you also have multiple explicit clauses, you need a separate header without a body to declare the defaults, or you'll get a compile error.",
    code: `# This seems fine...
defmodule Greeter do
  def greet(name, greeting \\\\ "Hello")

  def greet(name, greeting) when is_binary(name) do
    "\#{greeting}, \#{name}!"
  end

  def greet(name, greeting) do
    "\#{greeting}, \#{inspect(name)}!"
  end
end

# Without the header, this WON'T compile:
defmodule Greeter do
  # def greet(name, greeting \\\\ "Hello") when is_binary(name) do
  #   ...
  # end
  # def greet(name, greeting) do  # => warning/error about defaults
  #   ...
  # end
end`,
  },
  {
    title: "Naming Collisions with Imported Functions",
    description:
      "Importing a module brings its functions into your namespace, which can collide with local function definitions or Kernel functions. Elixir raises a CompileError on ambiguous calls. Use only: or except: to import selectively.",
    code: `defmodule MyModule do
  # This imports ALL of List's functions
  import List

  # If you define your own flatten/1, it conflicts
  # def flatten(data), do: ...
  #=> ** (CompileError) function flatten/1 imported from both
  #     List and MyModule

  # Import selectively to avoid collisions
  import List, only: [flatten: 1]

  # Or exclude specific functions
  import List, except: [flatten: 1]
end`,
  },
];

export default gotchas;
