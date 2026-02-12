import type { TopicContent } from "@/lib/types";

const macros: TopicContent = {
  meta: {
    slug: "macros",
    title: "Macros & Metaprogramming",
    description: "Quote, unquote, and compile-time code generation",
    number: 17,
    active: true,
  },

  eli5: {
    analogyTitle: "The Cookie Cutter Factory",
    analogy:
      "Imagine you bake cookies every day, and you notice you keep shaping the same designs by hand. So you build a machine that makes cookie cutters. Now instead of shaping each cookie, you stamp out a cutter once and use it to produce hundreds of perfectly shaped cookies. The machine doesn't make cookies directly — it makes the tools that make cookies.",
    items: [
      { label: "Macros", description: "The cookie cutter machine. They don't run your code — they generate code at compile time. You write a macro once, and everywhere you use it, it stamps out the right code for that situation." },
      { label: "Quote", description: "Taking a photo of the cookie dough before baking. It captures the shape of your code as data — a tree structure you can look at, modify, and rearrange before it becomes real running code." },
      { label: "Unquote", description: "Placing a real piece of dough into the photo. When you're building a code template, unquote lets you insert actual values or expressions into specific spots." },
      { label: "AST", description: "The blueprint of the cookie. Every piece of Elixir code is secretly a tree of nested three-element tuples. Macros work by reading and rewriting this tree before the compiler turns it into running code." },
    ],
    keyTakeaways: [
      "Macros transform code at compile time — they receive code as data (the AST) and return new code.",
      "quote converts code into its AST representation. unquote injects values into a quoted expression.",
      "The AST is made of three-element tuples: {function_name, metadata, arguments}.",
      "Most Elixir 'syntax' (if, def, defmodule, |>) is actually macros built on a tiny core language.",
      "The first rule of macros: don't write a macro when a function will do. Macros add complexity.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "AST (Abstract Syntax Tree)", color: "#6b46c1", examples: ["{:+, [], [1, 2]}", "{:def, [], [...]}", "three-element tuples"], description: "Every Elixir expression is represented as nested tuples of {name, metadata, args}. This is the data structure macros manipulate." },
      { name: "quote", color: "#2563eb", examples: ["quote do ... end", "code → AST", "captures structure"], description: "Converts Elixir code into its AST representation without evaluating it. The code becomes data you can inspect and transform." },
      { name: "unquote", color: "#d97706", examples: ["unquote(expr)", "injects values", "AST splicing"], description: "Inside a quote block, unquote inserts the value of an expression into the AST. Like string interpolation but for code." },
      { name: "defmacro", color: "#059669", examples: ["defmacro name do", "compile-time", "returns AST"], description: "Defines a macro. The macro receives AST as arguments and must return AST. The returned code replaces the macro call at compile time." },
      { name: "use / __using__", color: "#e11d48", examples: ["use Module", "__using__/1", "code injection"], description: "The use keyword calls a module's __using__ macro, which can inject code into the caller. This powers GenServer, Phoenix controllers, and more." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "The AST: Code as Data",
        prose: [
          "Every Elixir expression has a hidden structure — the Abstract Syntax Tree (AST). The AST represents code as nested three-element tuples: {name, metadata, arguments}. Simple literals like numbers, atoms, and strings represent themselves in the AST.",
          "Understanding the AST is the foundation of metaprogramming. When you see 1 + 2, Elixir sees {:+, [context: Elixir, ...], [1, 2]}. This representation is what makes macros possible — code is just data you can manipulate.",
        ],
        code: {
          title: "Inspecting the AST with quote",
          code: `# Simple expressions
quote do: 1 + 2
# => {:+, [context: Elixir, imports: [{1, Kernel}]], [1, 2]}

# Literals are themselves in the AST
quote do: 42        # => 42
quote do: :hello    # => :hello
quote do: "world"   # => "world"
quote do: [1, 2]    # => [1, 2]

# Function calls
quote do: String.upcase("hello")
# => {{:., [], [{:__aliases__, [], [:String]}, :upcase]},
#     [], ["hello"]}

# Variables
quote do: x
# => {:x, [], Elixir}

# Nested expressions
quote do: if true, do: :yes, else: :no
# => {:if, [context: Elixir, imports: [{2, Kernel}]],
#     [true, [do: :yes, else: :no]]}`,
          output: "{:+, [...], [1, 2]}",
        },
      },
      {
        title: "Quote and Unquote",
        prose: [
          "quote captures code as its AST without evaluating it. unquote does the opposite inside a quote block — it evaluates an expression and injects the result into the AST. Think of quote as creating a template and unquote as filling in the blanks.",
          "unquote_splicing is a variant that injects a list by expanding it inline, rather than inserting the list as a single element. This is useful when building argument lists or combining multiple expressions.",
        ],
        code: {
          title: "Building AST with quote and unquote",
          code: `# Without unquote — x is just an AST node
quote do: x + 1
# => {:+, [], [{:x, [], Elixir}, 1]}

# With unquote — the VALUE of x is injected
x = 5
quote do: unquote(x) + 1
# => {:+, [], [5, 1]}

# Building dynamic code
name = :hello
quote do
  def unquote(name)() do
    "world"
  end
end
# Generates: def hello(), do: "world"

# unquote_splicing expands a list inline
args = [1, 2, 3]
quote do: my_function(unquote_splicing(args))
# => {:my_function, [], [1, 2, 3]}
# Not: {:my_function, [], [[1, 2, 3]]}`,
          output: "{:my_function, [], [1, 2, 3]}",
        },
      },
      {
        title: "Writing Your First Macro",
        prose: [
          "A macro is defined with defmacro. It receives its arguments as AST (not evaluated values) and must return AST. The returned AST replaces the macro call site at compile time. This is called macro expansion.",
          "The key insight: macro arguments are not evaluated before being passed. If you write my_macro(1 + 2), the macro receives {:+, [], [1, 2]} — the AST of 1 + 2, not 3. This is what makes macros more powerful than functions — they can inspect and transform the structure of code, not just its values.",
        ],
        code: {
          title: "Defining and using macros",
          code: `defmodule MyMacros do
  # A simple logging macro that includes the expression text
  defmacro log(expr) do
    expr_string = Macro.to_string(expr)

    quote do
      result = unquote(expr)
      IO.puts("\#{unquote(expr_string)} = \#{inspect(result)}")
      result
    end
  end

  # A macro that creates a function
  defmacro define_greeter(name) do
    quote do
      def greet(unquote(name)) do
        "Hello, \#{unquote(name)}!"
      end
    end
  end
end

defmodule Example do
  require MyMacros

  # Using the log macro
  MyMacros.log(1 + 2 * 3)
  # Prints: "1 + 2 * 3 = 7"
  # Returns: 7
end`,
          output: "1 + 2 * 3 = 7",
        },
      },
      {
        title: "Macro Hygiene",
        prose: [
          "Elixir macros are hygienic by default. This means variables defined inside a macro don't leak into the caller's scope, and the caller's variables don't accidentally conflict with the macro's internal variables. The compiler renames variables behind the scenes to prevent collisions.",
          "Sometimes you intentionally want to inject a variable into the caller's scope. Use var!/1 to break hygiene — but do so sparingly. Unhygienic macros are harder to reason about and can cause subtle bugs.",
        ],
        code: {
          title: "Hygiene and var!",
          code: `defmodule HygieneDemo do
  # Hygienic: internal 'result' doesn't leak
  defmacro safe_double(expr) do
    quote do
      result = unquote(expr) * 2
      result
    end
  end

  # Unhygienic: injects 'doubled' into caller scope
  defmacro inject_doubled(expr) do
    quote do
      var!(doubled) = unquote(expr) * 2
    end
  end
end

defmodule Test do
  require HygieneDemo

  def example do
    result = "I won't be overwritten"
    x = HygieneDemo.safe_double(21)
    # result is still "I won't be overwritten"
    # x is 42

    HygieneDemo.inject_doubled(10)
    # Now 'doubled' exists in this scope = 20
    doubled
  end
end`,
          output: "20",
        },
      },
      {
        title: "use and __using__",
        prose: [
          "The use keyword is Elixir's way of injecting code from one module into another. When you write use GenServer, Elixir calls GenServer.__using__/1, which is a macro that returns AST to be injected into your module.",
          "This is how frameworks set up modules. use Phoenix.Controller injects routing helpers, action fallbacks, and plug pipelines. use Ecto.Schema injects schema-building macros. Under the hood, it's all __using__ macros returning quote blocks.",
        ],
        code: {
          title: "Building a use-able module",
          code: `defmodule Timestamps do
  defmacro __using__(_opts) do
    quote do
      # Inject functions into the using module
      def created_at do
        DateTime.utc_now()
      end

      def format_timestamp(dt) do
        Calendar.strftime(dt, "%Y-%m-%d %H:%M:%S")
      end
    end
  end
end

defmodule BlogPost do
  use Timestamps

  # created_at/0 and format_timestamp/1
  # are now available in BlogPost
end

BlogPost.format_timestamp(BlogPost.created_at())
# => "2024-01-15 14:30:22"

# use with options
defmodule Configurable do
  defmacro __using__(opts) do
    prefix = Keyword.get(opts, :prefix, "LOG")

    quote do
      def log(msg) do
        IO.puts("[\#{unquote(prefix)}] \#{msg}")
      end
    end
  end
end

defmodule MyApp do
  use Configurable, prefix: "APP"
end

MyApp.log("started")
# => "[APP] started"`,
          output: "[APP] started",
        },
      },
      {
        title: "When (Not) to Use Macros",
        prose: [
          "The golden rule: don't write a macro when a function will do. Functions are easier to understand, test, debug, and compose. Use macros only when you need compile-time code transformation — when a function literally can't do the job.",
          "Good reasons to use macros: DSLs (like Ecto schemas or test definitions), compile-time assertions, eliminating boilerplate that can't be abstracted with functions, and accessing caller context (like __MODULE__ or __ENV__). Bad reasons: 'it looks cool' or 'I want to save a few characters.'",
        ],
        code: {
          title: "Macros vs functions — choosing wisely",
          code: `# BAD: This should be a function
defmacro bad_add(a, b) do
  quote do: unquote(a) + unquote(b)
end

# GOOD: Just use a function
def add(a, b), do: a + b

# GOOD macro use: DSL that generates code
defmodule Router do
  defmacro get(path, handler) do
    quote do
      def handle(:get, unquote(path)) do
        unquote(handler).()
      end
    end
  end
end

defmodule MyRouter do
  require Router

  Router.get "/hello", fn -> "Hello!" end
  Router.get "/bye", fn -> "Goodbye!" end
end

MyRouter.handle(:get, "/hello")
# => "Hello!"

# GOOD macro use: compile-time validation
defmacro const(name, value) do
  unless is_atom(name) do
    raise ArgumentError, "const name must be an atom"
  end

  quote do
    def unquote(name)(), do: unquote(value)
  end
end`,
          output: "\"Hello!\"",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "What does quote do?",
        options: [
          { label: "Evaluates an expression and returns the result" },
          { label: "Converts code into its AST representation without evaluating it", correct: true },
          { label: "Creates a string from code" },
          { label: "Wraps code in a try/rescue block" },
        ],
        explanation:
          "quote takes Elixir code and returns its AST representation — nested three-element tuples — without evaluating anything. This lets you treat code as data that macros can inspect and transform.",
      },
      {
        question: "What does a macro receive as arguments?",
        options: [
          { label: "Evaluated values, just like a function" },
          { label: "The AST (quoted form) of the arguments, not their values", correct: true },
          { label: "Strings of the source code" },
          { label: "Binary-encoded bytecode" },
        ],
        explanation:
          "Unlike functions, macros receive the AST of their arguments. If you call my_macro(1 + 2), the macro gets {:+, [], [1, 2]} — the structure of the expression — not the value 3. This is what gives macros their power to transform code.",
      },
      {
        question: "What is macro hygiene?",
        options: [
          { label: "A tool that formats macro code" },
          { label: "Variables in macros don't leak into or conflict with the caller's scope", correct: true },
          { label: "A way to prevent macros from being called recursively" },
          { label: "Automatic memory cleanup after macro expansion" },
        ],
        explanation:
          "Hygienic macros automatically rename internal variables to avoid conflicts with the caller's code. A variable named result inside a macro won't overwrite a result variable in the calling module. Use var!/1 to intentionally break hygiene when needed.",
      },
      {
        question: "When should you use a macro instead of a function?",
        options: [
          { label: "Whenever you want better performance" },
          { label: "When you need compile-time code transformation that functions can't achieve", correct: true },
          { label: "Whenever you need to accept more than 3 arguments" },
          { label: "Always — macros are more powerful than functions" },
        ],
        explanation:
          "Macros should be a last resort, not a first choice. Use them only when you genuinely need compile-time code generation — like DSLs, eliminating boilerplate, or accessing compile-time information. Functions are simpler to understand, test, and debug.",
      },
      {
        question: "What does use MyModule actually do?",
        options: [
          { label: "Imports all functions from MyModule" },
          { label: "Creates an alias for MyModule" },
          { label: "Calls MyModule.__using__/1 which injects code via a macro", correct: true },
          { label: "Inherits from MyModule like a class" },
        ],
        explanation:
          "use MyModule is roughly equivalent to calling MyModule.__using__(opts) and injecting the returned AST into the current module. It's a macro-powered mechanism, not inheritance. Each use call can inject different code depending on options.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "Explore the AST",
        difficulty: "beginner",
        prompt:
          "Use quote to inspect the AST of the following expressions and predict their structure before checking: (1) 5 + 3, (2) div(10, 3), (3) if true, do: :yes. Then use Macro.to_string/1 to convert an AST back to source code.",
        hints: [
          { text: "Use quote do: <expression> to see the AST of any expression." },
          { text: "Function calls become {function_name, metadata, [args...]} tuples." },
          { text: "Macro.to_string/1 takes an AST and returns the equivalent source code as a string." },
        ],
        solution: `# 1. Arithmetic
quote do: 5 + 3
# => {:+, [context: Elixir, imports: [{1, Kernel}]], [5, 3]}

# 2. Function call
quote do: div(10, 3)
# => {:div, [context: Elixir, imports: [{2, Kernel}]], [10, 3]}

# 3. If expression (it's a macro too!)
quote do: if true, do: :yes
# => {:if, [context: Elixir, imports: [{2, Kernel}]],
#     [true, [do: :yes]]}

# Converting AST back to string
ast = quote do: Enum.map([1, 2, 3], &(&1 * 2))
Macro.to_string(ast)
# => "Enum.map([1, 2, 3], &(&1 * 2))"

# Building AST and converting it
custom_ast = {:+, [], [10, {:*, [], [3, 4]}]}
Macro.to_string(custom_ast)
# => "10 + 3 * 4"`,
        walkthrough: [
          "5 + 3 becomes {:+, metadata, [5, 3]} — the operator is the first element, and the two operands are in the arguments list.",
          "div(10, 3) follows the same {name, meta, args} pattern. Named functions and operators share the same AST structure.",
          "if is actually a macro in Kernel, so it also becomes an AST tuple. The do: :yes part is a keyword list in the args.",
          "Macro.to_string/1 is the inverse of quote — it takes AST data and reconstructs readable source code. Useful for debugging macros.",
        ],
      },
      {
        title: "Write a Debug Macro",
        difficulty: "intermediate",
        prompt:
          "Write a macro called debug/1 that takes an expression, prints the expression as text along with its result, and returns the result. For example, debug(2 + 3) should print \"2 + 3 = 5\" and return 5.",
        hints: [
          { text: "Use Macro.to_string/1 at compile time (inside the macro, outside the quote) to get the expression text." },
          { text: "Use quote and unquote to build the runtime code that evaluates the expression and prints." },
          { text: "Make sure to evaluate the expression only once by binding it to a variable inside the quote block." },
        ],
        solution: `defmodule Debug do
  defmacro debug(expr) do
    expr_string = Macro.to_string(expr)

    quote do
      result = unquote(expr)
      IO.puts(unquote(expr_string) <> " = " <> inspect(result))
      result
    end
  end
end

# Usage:
require Debug

Debug.debug(2 + 3)
# Prints: "2 + 3 = 5"
# Returns: 5

x = 10
Debug.debug(Enum.sum(1..x))
# Prints: "Enum.sum(1..x) = 55"
# Returns: 55

Debug.debug(String.upcase("hello"))
# Prints: "String.upcase(\\"hello\\") = \\"HELLO\\""
# Returns: "HELLO"`,
        walkthrough: [
          "Macro.to_string(expr) runs at compile time — it converts the AST of the argument into a string like \"2 + 3\". This happens before the code runs.",
          "Inside the quote block, unquote(expr) injects the original expression to be evaluated at runtime. We bind it to result to avoid evaluating it twice.",
          "unquote(expr_string) injects the compile-time string into the IO.puts call. At runtime, the string is already baked into the code.",
          "The macro returns result at the end, so Debug.debug(expr) can be used in place of expr without changing behaviour — it just adds the logging side effect.",
        ],
      },
      {
        title: "Build a Mini DSL",
        difficulty: "advanced",
        prompt:
          "Create a macro-based DSL for defining validators. The DSL should let you write: validate :name, :required and validate :age, :positive inside a module, generating a validate_field/2 function for each rule. A :required rule checks the value is not nil/empty, and :positive checks it's > 0.",
        hints: [
          { text: "Define a validate macro that takes a field name (atom) and a rule (atom)." },
          { text: "The macro should generate function clauses for validate_field/2 that pattern match on the field name." },
          { text: "Use defmacro and quote to generate def validate_field(field, value) clauses at compile time." },
        ],
        solution: `defmodule Validator do
  defmacro validate(field, :required) do
    quote do
      def validate_field(unquote(field), nil), do: {:error, "\#{unquote(field)} is required"}
      def validate_field(unquote(field), ""), do: {:error, "\#{unquote(field)} is required"}
      def validate_field(unquote(field), _value), do: :ok
    end
  end

  defmacro validate(field, :positive) do
    quote do
      def validate_field(unquote(field), value) when is_number(value) and value > 0, do: :ok
      def validate_field(unquote(field), _value), do: {:error, "\#{unquote(field)} must be positive"}
    end
  end
end

defmodule UserValidator do
  require Validator

  Validator.validate(:name, :required)
  Validator.validate(:age, :positive)
end

UserValidator.validate_field(:name, "Alice")  # => :ok
UserValidator.validate_field(:name, nil)       # => {:error, "name is required"}
UserValidator.validate_field(:name, "")        # => {:error, "name is required"}
UserValidator.validate_field(:age, 25)         # => :ok
UserValidator.validate_field(:age, -1)         # => {:error, "age must be positive"}`,
        walkthrough: [
          "The validate macro pattern matches on the rule atom (:required or :positive) at compile time. Each rule generates different function clauses.",
          "For :required, we generate three clauses: one for nil, one for empty string, and a catch-all that passes. The field name is unquoted into the pattern match position.",
          "For :positive, we use a guard clause (when is_number(value) and value > 0) in the generated function. The second clause catches everything else as invalid.",
          "At compile time, UserValidator ends up with multiple validate_field/2 clauses, just as if you'd written them by hand. The macro eliminated the boilerplate.",
          "This is a good use of macros — a function can't generate new function definitions at compile time. The DSL reads clearly and the generated code is straightforward.",
        ],
      },
    ],
  },
};

export default macros;
