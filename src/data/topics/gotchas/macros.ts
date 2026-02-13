import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Macro Hygiene: Variables Don't Leak by Default",
    description:
      "Elixir macros are hygienic — variables defined inside a macro don't leak into the caller's scope, and vice versa. This prevents accidental name collisions but can be confusing when you intentionally want a macro to inject a variable into the caller's context. Use var!/2 to explicitly break hygiene when needed.",
    code: `defmodule MyMacros do
  defmacro hygienic do
    quote do
      x = 42  # this x is scoped to the macro
    end
  end

  defmacro unhygienic do
    quote do
      var!(x) = 42  # this x IS injected into caller's scope
    end
  end
end

# Usage:
require MyMacros

MyMacros.hygienic()
x  #=> ** (CompileError) undefined variable "x"

MyMacros.unhygienic()
x  #=> 42`,
  },
  {
    title: "Quote/Unquote Confusion with Nested Levels",
    description:
      "When writing macros that generate other macros, you need multiple levels of quoting and unquoting. Each quote adds a level of AST wrapping, and each unquote peels one level off. Getting the nesting wrong produces confusing compile errors or unexpected behavior. Use Macro.escape/1 for injecting complex data structures.",
    code: `defmacro define_getter(name, value) do
  quote do
    def unquote(name)() do
      # unquote(value) works for simple values
      unquote(value)
    end
  end
end

# For complex values, you may need Macro.escape:
defmacro define_getter(name, value) do
  escaped = Macro.escape(value)
  quote do
    def unquote(name)() do
      unquote(escaped)
    end
  end
end

# Without Macro.escape, passing a struct or map
# with complex data may fail or produce wrong AST`,
  },
  {
    title: "Macros Run at Compile Time — Runtime Values Aren't Available",
    description:
      "Macros are expanded at compile time, before your application runs. This means you cannot use runtime values (like function return values, database queries, or environment variables read at runtime) directly in macro arguments. The macro only sees the literal AST of what you pass it.",
    code: `defmodule Config do
  defmacro feature(name) do
    quote do
      def unquote(name)(), do: true
    end
  end
end

defmodule MyApp do
  require Config

  # WORKS: atom literal known at compile time
  Config.feature(:dark_mode)

  # FAILS: variable is not available at compile time
  name = String.to_atom(System.get_env("FEATURE"))
  Config.feature(name)
  #=> The macro receives the AST for the variable 'name',
  #   not the value it holds at runtime`,
  },
  {
    title: "Overusing Macros When Functions Would Suffice",
    description:
      "Macros are powerful but add complexity: they're harder to debug, don't appear in stack traces clearly, and can't be passed as arguments to higher-order functions. If a regular function can accomplish the same goal, prefer it. Reserve macros for cases where you genuinely need compile-time code generation, DSLs, or AST transformation.",
    code: `# UNNECESSARY macro — a function does the same thing:
defmacro double(x) do
  quote do
    unquote(x) * 2
  end
end

# Just use a function instead:
def double(x), do: x * 2

# JUSTIFIED macro — generates code at compile time:
defmacro defroutes(routes) do
  for {path, handler} <- routes do
    quote do
      def handle(unquote(path)), do: unquote(handler).call()
    end
  end
end

# Rule of thumb: Can you do it with a function?
# If yes, use a function. Macros are a last resort.`,
  },
];

export default gotchas;
