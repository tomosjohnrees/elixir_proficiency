import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What does @callback define in a behaviour?",
    options: [
      { label: "A private function only visible inside the module" },
      { label: "A function signature that implementing modules must provide", correct: true },
      { label: "A runtime hook that fires when the module loads" },
      { label: "A default implementation that can be overridden" },
    ],
    explanation:
      "@callback declares a required function signature — name, argument types, and return type. Any module that declares @behaviour for this module must implement all required callbacks or the compiler will warn.",
  },
  {
    question: "What happens if you forget to implement a required callback?",
    options: [
      { label: "A runtime error when the module is loaded" },
      { label: "A compile-time warning", correct: true },
      { label: "The module silently fails to compile" },
      { label: "Nothing — it's only checked at runtime" },
    ],
    explanation:
      "Elixir checks callbacks at compile time and issues a warning (not an error) if a required callback is missing. This catches mistakes early but still allows the code to compile, which is useful during development.",
  },
  {
    question: "What is the main difference between behaviours and protocols?",
    options: [
      { label: "Protocols are faster than behaviours" },
      { label: "Behaviours can only be used with structs" },
      { label: "Protocols dispatch on data type, behaviours dispatch on module", correct: true },
      { label: "Behaviours are checked at runtime, protocols at compile time" },
    ],
    explanation:
      "Protocols dispatch based on the type of the first argument — the data determines which code runs. Behaviours dispatch based on which module you call — you (or your config) choose the implementation explicitly.",
  },
  {
    question: "What does @impl true do?",
    options: [
      { label: "Makes a function public" },
      { label: "Marks a function as implementing a callback, enabling compile-time checks", correct: true },
      { label: "Automatically generates the function from the callback spec" },
      { label: "Makes the function overridable by child modules" },
    ],
    explanation:
      "@impl true tells the compiler 'this function is meant to implement a callback.' If the function doesn't match any callback (wrong name, wrong arity), the compiler warns you. It also serves as documentation for readers.",
  },
  {
    question: "Why are behaviours useful for testing?",
    options: [
      { label: "They make tests run faster" },
      { label: "They let you swap real implementations with mocks via configuration", correct: true },
      { label: "They automatically generate test cases" },
      { label: "They prevent side effects in production code" },
    ],
    explanation:
      "By depending on a behaviour (contract) rather than a specific module, you can configure a mock implementation in your test environment. The calling code doesn't change — it uses whichever module is configured.",
  },
  {
    question: "Which of the following is a built-in OTP behaviour that you implement when you write a GenServer module?",
    options: [
      { label: "GenServer is a protocol, not a behaviour" },
      { label: "GenServer is a behaviour that defines callbacks like init/1, handle_call/3, and handle_cast/2", correct: true },
      { label: "GenServer is a struct that you extend with custom fields" },
      { label: "GenServer is a macro that generates callbacks automatically without any behaviour contract" },
    ],
    explanation:
      "GenServer is one of the most common OTP behaviours. When you use GenServer, you're committing to implement callbacks like init/1, handle_call/3, and handle_cast/2. The use GenServer macro injects default implementations so you only need to override the callbacks you care about.",
  },
  {
    question: "What is the purpose of @optional_callback in a behaviour definition?",
    options: [
      { label: "It makes the callback available only in development mode" },
      { label: "It allows implementing modules to skip that callback without triggering a compiler warning", correct: true },
      { label: "It automatically provides a no-op default implementation" },
      { label: "It marks the callback as deprecated and scheduled for removal" },
    ],
    explanation:
      "@optional_callback tells the compiler that implementing modules are not required to define this function. Unlike required callbacks, omitting an optional one produces no warning. However, @optional_callback does not inject a default implementation — the implementing module simply doesn't have that function unless it defines one.",
  },
  {
    question: "What happens if you annotate a function with @impl true but the function does not match any callback in the declared behaviour?",
    options: [
      { label: "The function is silently ignored" },
      { label: "The compiler raises an error and halts compilation" },
      { label: "The compiler emits a warning that the function is not a callback", correct: true },
      { label: "The function is automatically added as a new callback to the behaviour" },
    ],
    explanation:
      "When @impl true is used on a function that doesn't correspond to any callback in the declared behaviour, the compiler issues a warning. This is one of the key benefits of @impl — it catches typos in function names or incorrect arities at compile time, acting as a safety net for your callback implementations.",
  },
  {
    question: "In a module that implements multiple behaviours, what is the recommended way to use @impl?",
    options: [
      { label: "You cannot implement multiple behaviours in a single module" },
      { label: "Use @impl BehaviourName to specify which behaviour each function implements", correct: true },
      { label: "Use @impl true and the compiler will figure out which behaviour each function belongs to" },
      { label: "Only annotate the first behaviour's callbacks with @impl" },
    ],
    explanation:
      "When a module implements multiple behaviours, you should use @impl BehaviourName (e.g., @impl GenServer) instead of @impl true. This makes it explicit which behaviour each callback belongs to, improves readability, and helps the compiler verify correctness when callback names might overlap between behaviours.",
  },
  {
    question: "How does defoverridable relate to behaviours when providing default implementations via a __using__ macro?",
    options: [
      { label: "defoverridable is required to declare callbacks in a behaviour" },
      { label: "defoverridable allows the using module to redefine functions that were injected by the __using__ macro", correct: true },
      { label: "defoverridable makes a behaviour optional for any module that uses it" },
      { label: "defoverridable is only needed for optional callbacks" },
    ],
    explanation:
      "When a __using__ macro injects default callback implementations, defoverridable marks those functions as safe to redefine. Without it, the implementing module could not override the defaults because Elixir would see a duplicate function definition. This is the mechanism that lets GenServer provide defaults you can selectively override.",
  },
  {
    question: "When would you choose a behaviour over a protocol for polymorphism?",
    options: [
      { label: "When you need polymorphism based on the data type of the first argument" },
      { label: "When you want to dispatch based on a struct's internal fields" },
      { label: "When you need interchangeable module-level implementations chosen by configuration or at runtime", correct: true },
      { label: "When you want to extend third-party types without modifying their source code" },
    ],
    explanation:
      "Behaviours are ideal when you want to swap entire module implementations — like choosing between an SMTP mailer and a console mailer via config. Protocols are better when the data itself should determine which implementation runs. Extending third-party types is a protocol strength, not a behaviour use case.",
  },
  {
    question: "What is the result of calling a function on a behaviour implementation stored in a variable, like `parser.parse(input)`, if parser is an atom representing a module?",
    options: [
      { label: "A compile-time error because Elixir doesn't support dynamic dispatch" },
      { label: "The function is called on the module stored in the variable at runtime", correct: true },
      { label: "The variable is pattern-matched against available modules" },
      { label: "It only works if the module is defined in the same file" },
    ],
    explanation:
      "In Elixir, module names are atoms, and you can store them in variables. Calling parser.parse(input) when parser holds a module atom (like JsonParser) invokes that module's parse/1 function at runtime. This dynamic dispatch is the foundation of behaviour-based polymorphism and is used extensively in configuration-driven architectures.",
  },
  {
    question: "Given a behaviour with `@callback handle(event :: term()) :: {:ok, term()} | {:error, String.t()}`, which implementation signature would NOT satisfy this callback?",
    options: [
      { label: "def handle(event), do: {:ok, event}" },
      { label: "def handle(%Event{} = event), do: {:ok, process(event)}" },
      { label: "def handle(event, opts), do: {:ok, {event, opts}}", correct: true },
      { label: "def handle(_event), do: {:error, \"not implemented\"}" },
    ],
    explanation:
      "The callback specifies handle/1 (one argument). A function with arity 2 like handle(event, opts) does not satisfy the handle/1 callback because Elixir distinguishes functions by name and arity. The compiler would warn that handle/1 is still missing, and the extra handle/2 would be treated as a separate, unrelated function.",
  },
  {
    question: "What compile-time guarantee does @behaviour provide that simply documenting 'modules must implement these functions' does not?",
    options: [
      { label: "It enforces argument types at compile time" },
      { label: "It guarantees the return types are correct" },
      { label: "It emits warnings when required callbacks are missing or when @impl annotations don't match", correct: true },
      { label: "It prevents the module from being compiled if any callback has a bug" },
    ],
    explanation:
      "@behaviour provides compile-time warnings for missing required callbacks and, when combined with @impl, for mismatched function names or arities. It does not enforce argument types or return types at compile time — those remain runtime concerns. The value is catching structural mistakes (forgotten functions, typos) before the code ever runs.",
  },
  {
    question: "In the context of Mox (a popular Elixir mocking library), why does Mox require that mocks are based on behaviours?",
    options: [
      { label: "Because Mox can only generate modules that use GenServer" },
      { label: "Because behaviours define a clear contract, ensuring mocks implement the same interface as the real module", correct: true },
      { label: "Because Mox uses protocols internally and behaviours are compiled into protocols" },
      { label: "Because Elixir forbids creating mock modules without a behaviour" },
    ],
    explanation:
      "Mox generates mock modules that implement the same behaviour as the real dependency. This guarantees that the mock has the exact same function signatures as the real implementation, preventing a common testing pitfall where mocks drift out of sync with the actual interface. The behaviour acts as a single source of truth for the contract.",
  },
  {
    question: "What is the difference between `@callback` and `@macrocallback` in a behaviour?",
    options: [
      { label: "@callback defines regular function signatures; @macrocallback defines macro signatures that implementing modules must provide", correct: true },
      { label: "@macrocallback is faster because macros are expanded at compile time" },
      { label: "@callback is for public functions; @macrocallback is for private functions" },
      { label: "There is no difference — they are aliases" },
    ],
    explanation:
      "@callback defines function signatures (def), while @macrocallback defines macro signatures (defmacro) that implementing modules must provide. @macrocallback is rare — it's used when a behaviour needs implementing modules to inject code at compile time rather than provide runtime functions. The `use` pattern with __using__/1 is a more common way to achieve compile-time code injection.",
  },
  {
    question: "How does dynamic dispatch work with behaviours in Elixir?",
    options: [
      { label: "The BEAM resolves the implementation at compile time based on type annotations" },
      { label: "You store the implementing module in a variable or config, then call module.callback(args) — dispatch happens at runtime based on the module value", correct: true },
      { label: "Behaviours use pattern matching on the first argument to dispatch, like protocols" },
      { label: "Dynamic dispatch isn't possible — you must hardcode the implementing module" },
    ],
    explanation:
      "Unlike protocols (which dispatch on data type), behaviours dispatch on the module itself. You typically store the module name in application config, a function parameter, or state, then call it dynamically: `impl = Application.get_env(:my_app, :storage_impl); impl.store(data)`. The compiler can't verify the call at compile time, but the behaviour contract ensures all implementations have the right functions. This pattern is fundamental for dependency injection and testing with Mox.",
  },
];

export default questions;
