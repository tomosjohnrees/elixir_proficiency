import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Dialyzer Is Optimistic — Only Reports Definite Errors",
    description:
      "Unlike traditional type checkers that reject anything they can't prove correct, Dialyzer uses 'success typing' and only reports errors it can definitively prove will always fail. If there's any possible execution path where the code could succeed, Dialyzer stays silent. This means passing Dialyzer does not guarantee your code is type-safe — it only means there are no guaranteed crashes.",
    code: `# Dialyzer will NOT warn about this — it could succeed
@spec add(integer(), integer()) :: integer()
def add(a, b), do: a + b

# Called with a string sometimes:
add(1, "two")  # Dialyzer may not catch this if the
                # call site isn't provably always wrong

# Dialyzer WILL warn about this — it always fails
@spec always_fails() :: integer()
def always_fails do
  "not an integer"  # Provably never returns an integer
end`,
  },
  {
    title: "@spec Is Documentation, Not Enforcement",
    description:
      "Type specifications in Elixir are metadata annotations, not runtime type checks. The BEAM VM completely ignores @spec at runtime. Writing an incorrect @spec won't cause a compilation error or a runtime crash — it will just mislead developers and tools. Only Dialyzer (a static analysis tool) uses specs, and even it is optimistic about them.",
    code: `defmodule Math do
  # This spec is wrong — function returns a float for division
  @spec divide(number(), number()) :: integer()
  def divide(a, b), do: a / b
end

# No error at compile time
# No error at runtime
Math.divide(10, 3)
#=> 3.3333...  (a float, not an integer)

# The wrong spec only causes problems when:
# 1. Another developer trusts it and writes code expecting integer
# 2. Dialyzer might catch it (but see: optimistic analysis)
# 3. Documentation tools display incorrect type info`,
  },
  {
    title: "Typespecs Don't Prevent Runtime Errors",
    description:
      "Even with perfect typespecs and a clean Dialyzer run, your code can still crash at runtime. Specs don't add any guards or validation — they are purely static analysis hints. If you need runtime type checking, you must add explicit guards, pattern matches, or validation logic yourself.",
    code: `@spec greet(String.t()) :: String.t()
def greet(name) do
  "Hello, " <> name
end

# Spec says String.t() but nothing stops this at runtime:
greet(42)
#=> ** (ArgumentError) expected binary argument in <> operator

# If you need runtime safety, add guards:
@spec greet(String.t()) :: String.t()
def greet(name) when is_binary(name) do
  "Hello, " <> name
end

def greet(_), do: {:error, :invalid_name}`,
  },
  {
    title: "Dialyzer's First Run Is Very Slow — PLT Building",
    description:
      "The first time you run Dialyzer (typically via mix dialyzer with the Dialyxir package), it builds a Persistent Lookup Table (PLT) containing type information for Erlang/OTP, Elixir stdlib, and your dependencies. This can take 10-30 minutes depending on your project. Subsequent runs are fast because the PLT is cached. Don't interrupt the first run or you'll have to start over.",
    code: `# First run: builds the PLT (be patient!)
$ mix dialyzer
Finding suitable PLTs
Compiling 1 file (.ex)
Creating PLT...  # This takes 10-30 minutes
Starting Dialyzer
[... eventually finishes ...]

# Subsequent runs: much faster (seconds to minutes)
$ mix dialyzer
Starting Dialyzer
done in 0m 45s
done (passed successfully)

# If PLT gets corrupted, rebuild:
$ mix dialyzer --plt`,
  },
  {
    title: "Success Typing vs Traditional Type Checking",
    description:
      "Dialyzer's 'success typing' approach is fundamentally different from type systems in languages like TypeScript, Haskell, or Rust. It doesn't require annotations and won't reject code that might work. It infers the broadest type that could succeed and only warns when something will definitely fail. This means fewer false positives but also more missed bugs than a traditional type system would catch.",
    code: `# Traditional type system would reject this:
def flexible(x) do
  if is_integer(x) do
    x + 1
  else
    String.upcase(x)
  end
end

# Dialyzer infers: x is integer() | String.t()
# and is perfectly happy — both branches can succeed

# A stricter type system would demand:
# - A union type annotation, or
# - Separate functions for each type
# Dialyzer just says: "this could work, carry on"`,
  },
];

export default gotchas;
