import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "@impl Is Optional but Strongly Recommended",
    description:
      "Adding @impl true before a callback implementation is optional — your code compiles without it. But without @impl, the compiler can't warn you about typos in function names or wrong arities. With @impl, if you accidentally define a function that doesn't match any callback, the compiler catches it immediately.",
    code: `defmodule MyServer do
  use GenServer

  # WITHOUT @impl — typo compiles silently
  def handle_cll(msg, _from, state) do  # typo: "cll"
    {:reply, msg, state}
  end
  # No warning! This is just a regular unused function.

  # WITH @impl — compiler catches the typo
  @impl true
  def handle_cll(msg, _from, state) do
    {:reply, msg, state}
  end
  # ** (CompileError) got "@impl true" for function
  # handle_cll/3 but no behaviour specifies such callback
end`,
  },
  {
    title: "Callback Functions Must Match Exact Arity",
    description:
      "When implementing a behaviour callback, your function must have the exact arity specified by the @callback declaration. Default arguments don't count as separate arities for behaviour purposes. If the callback expects arity 2, a function with 3 parameters where one has a default won't satisfy it.",
    code: `defmodule Parser do
  @callback parse(binary(), keyword()) :: {:ok, term()} | {:error, term()}
end

# WRONG: arity 3 with a default is not arity 2
defmodule JSONParser do
  @behaviour Parser

  @impl true
  def parse(data, opts, extra \\\\ nil) do
    # This defines parse/3 with a default, which also
    # generates parse/2 — but the compiler may still warn
    # about confusing behaviour implementation
    {:ok, data}
  end
end

# CORRECT: match the exact callback arity
defmodule JSONParser do
  @behaviour Parser

  @impl true
  def parse(data, opts) do
    {:ok, Jason.decode!(data)}
  end
end`,
  },
  {
    title: "@optional_callbacks Exist but Are Rarely Used",
    description:
      "You can mark callbacks as optional with @optional_callbacks, meaning implementing modules won't get a compiler warning if they skip them. This sounds convenient but can lead to runtime errors if you call an optional callback without checking whether the module implements it. Most libraries use default implementations via __using__ macros instead.",
    code: `defmodule Plugin do
  @callback required_function() :: :ok
  @callback optional_hook() :: :ok

  @optional_callbacks optional_hook: 0
end

defmodule MyPlugin do
  @behaviour Plugin

  @impl true
  def required_function, do: :ok
  # No warning about missing optional_hook/0
end

# But calling it at runtime crashes:
MyPlugin.optional_hook()
#=> ** (UndefinedFunctionError)

# You must guard the call:
if function_exported?(MyPlugin, :optional_hook, 0) do
  MyPlugin.optional_hook()
end`,
  },
  {
    title: "@behaviour Must Come Before Function Definitions",
    description:
      "Module attributes like @behaviour are processed at compile time in the order they appear. If you place @behaviour after your function definitions, the compiler won't associate those functions with the behaviour and won't generate proper warnings for missing callbacks or incorrect @impl annotations.",
    code: `# WRONG: @behaviour after function definitions
defmodule MyServer do
  def init(state) do
    {:ok, state}
  end

  def handle_call(:ping, _from, state) do
    {:reply, :pong, state}
  end

  @behaviour GenServer  # too late — functions above
                        # aren't checked against callbacks
end

# CORRECT: @behaviour at the top
defmodule MyServer do
  @behaviour GenServer

  @impl true
  def init(state), do: {:ok, state}

  @impl true
  def handle_call(:ping, _from, state) do
    {:reply, :pong, state}
  end
end`,
  },
];

export default gotchas;
