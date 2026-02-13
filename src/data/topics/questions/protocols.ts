import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What does defprotocol define?",
    options: [
      { label: "A module with default function implementations" },
      { label: "Function signatures that types must implement", correct: true },
      { label: "A struct with enforced keys" },
      { label: "A behaviour with callbacks" },
    ],
    explanation:
      "defprotocol defines function heads (signatures) without bodies. It creates a contract — any type that wants to work with this protocol must provide implementations of those functions via defimpl.",
  },
  {
    question: "How does Elixir decide which protocol implementation to use?",
    options: [
      { label: "By the return type of the function" },
      { label: "By the module where the call is made" },
      { label: "By the data type of the first argument", correct: true },
      { label: "By a priority ranking you define" },
    ],
    explanation:
      "Protocol dispatch is based on the type of the first argument. When you call Describable.describe(42), Elixir sees an Integer and routes to the defimpl Describable, for: Integer implementation.",
  },
  {
    question: "Can you implement a protocol for a type you didn't define?",
    options: [
      { label: "No, you can only implement protocols for your own structs" },
      { label: "Yes, but only in the module that defines the protocol" },
      { label: "Yes, you can implement protocols for any type anywhere", correct: true },
      { label: "Only if the type explicitly allows it" },
    ],
    explanation:
      "This is a key advantage of protocols over inheritance. You can implement a protocol for any type — built-in types like Integer or List, third-party structs, or your own types — from any module.",
  },
  {
    question: "What does @fallback_to_any true do in a protocol?",
    options: [
      { label: "Makes the protocol optional" },
      { label: "Automatically generates implementations for all types" },
      { label: "Uses the defimpl for: Any when no specific implementation exists", correct: true },
      { label: "Disables compile-time protocol consolidation" },
    ],
    explanation:
      "With @fallback_to_any true, if a type hasn't implemented the protocol, Elixir falls back to the Any implementation instead of raising Protocol.UndefinedError. You still need to provide a defimpl for: Any.",
  },
  {
    question: "What is protocol consolidation?",
    options: [
      { label: "Merging all implementations into one module" },
      { label: "Precomputing the dispatch table at compile time for faster calls", correct: true },
      { label: "Removing unused protocol implementations" },
      { label: "Converting protocols to behaviours in production" },
    ],
    explanation:
      "Protocol consolidation is a compile-time optimization. Elixir precomputes which types implement which protocols, turning runtime lookups into direct function calls. This happens automatically when building releases.",
  },
  {
    question:
      "What happens if you call a protocol function on a type that has no implementation and @fallback_to_any is not set?",
    options: [
      { label: "It returns nil" },
      { label: "It raises Protocol.UndefinedError", correct: true },
      { label: "It silently falls back to the Any implementation" },
      { label: "It raises an ArgumentError" },
    ],
    explanation:
      "Without @fallback_to_any true, calling a protocol function on a type with no implementation raises Protocol.UndefinedError. Elixir does not silently swallow the missing implementation — you must either provide one or explicitly enable the Any fallback.",
  },
  {
    question:
      "Which of the following correctly implements the String.Chars protocol for a struct?",
    options: [
      {
        label:
          'defimpl String.Chars, for: MyStruct do\n  def to_string(s), do: s.name\nend',
        correct: true,
      },
      {
        label:
          'defprotocol String.Chars, for: MyStruct do\n  def to_string(s), do: s.name\nend',
      },
      {
        label:
          'defimpl MyStruct, for: String.Chars do\n  def to_string(s), do: s.name\nend',
      },
      {
        label:
          'defimpl String.Chars do\n  def to_string(s), do: s.name\nend',
      },
    ],
    explanation:
      "The correct syntax is defimpl ProtocolName, for: TypeName. The protocol name comes first, then the for: option specifies the target type. Using defprotocol would attempt to redefine the protocol itself, and omitting for: is invalid.",
  },
  {
    question:
      "What is the key difference between protocols and behaviours in Elixir?",
    options: [
      {
        label:
          "Protocols are faster than behaviours",
      },
      {
        label:
          "Behaviours dispatch on the module, protocols dispatch on data type",
        correct: true,
      },
      {
        label:
          "Protocols can only be used with structs, behaviours work with any module",
      },
      {
        label:
          "Behaviours are deprecated in favor of protocols",
      },
    ],
    explanation:
      "The fundamental difference is the dispatch mechanism. Protocols dispatch based on the data type of the first argument (data polymorphism), while behaviours define a set of callbacks that a module must implement and you call the specific module directly. Behaviours are for module-level contracts; protocols are for type-level polymorphism.",
  },
  {
    question:
      "What does @derive [Inspect] do when placed before a defstruct?",
    options: [
      { label: "It removes the Inspect implementation for the struct" },
      {
        label:
          "It auto-generates an Inspect implementation using a default strategy",
        correct: true,
      },
      { label: "It copies the Inspect implementation from the parent module" },
      { label: "It makes the struct invisible to IO.inspect/1" },
    ],
    explanation:
      "The @derive attribute tells Elixir to automatically generate an implementation of the specified protocol for the struct being defined. For Inspect, this produces a representation based on the struct's fields. You can also pass options like {Inspect, only: [:name]} to customize which fields are shown.",
  },
  {
    question:
      "When protocols are consolidated in a release build, what happens if you try to dynamically define a new implementation at runtime?",
    options: [
      { label: "It works normally, just like in development" },
      { label: "It raises a compilation error" },
      {
        label:
          "The new implementation is ignored because the dispatch table is already frozen",
        correct: true,
      },
      { label: "It triggers an automatic recompilation of the protocol" },
    ],
    explanation:
      "After protocol consolidation, the dispatch table is precomputed and embedded in the compiled code. New implementations added at runtime will not be picked up because the consolidated module does not perform dynamic lookups. This is a trade-off for the performance gains of consolidation.",
  },
  {
    question:
      "Which built-in protocol must you implement to make Enum functions work with a custom data structure?",
    options: [
      { label: "Collectable" },
      { label: "Enumerable", correct: true },
      { label: "String.Chars" },
      { label: "Inspect" },
    ],
    explanation:
      "The Enumerable protocol is what powers all Enum and Stream functions. By implementing reduce/3, count/1, member?/2, and slice/1 for your custom type, you unlock the full suite of 70+ Enum functions automatically. Collectable is the inverse — it lets you collect values into your type using Enum.into/2.",
  },
  {
    question:
      "If a protocol has @fallback_to_any true and you implement it for both Any and Map, which implementation is used for a bare map (not a struct)?",
    options: [
      { label: "The Any implementation, because it's the fallback" },
      {
        label:
          "The Map implementation, because specific implementations take precedence",
        correct: true,
      },
      { label: "It raises an ambiguity error" },
      { label: "It depends on which was defined first" },
    ],
    explanation:
      "Specific implementations always take precedence over the Any fallback. The Any implementation is only used when no specific implementation exists for the given type. This means you can have a sensible default via Any while still providing optimized or customized behavior for specific types.",
  },
  {
    question:
      "Why do structs not automatically use the Map protocol implementation, even though structs are built on top of maps?",
    options: [
      { label: "Structs and maps use completely different data structures internally" },
      {
        label:
          "Each struct is its own distinct type for protocol dispatch purposes",
        correct: true,
      },
      { label: "Map implementations are only for the literal %{} syntax" },
      { label: "Structs use a faster dispatch mechanism that bypasses protocols" },
    ],
    explanation:
      "Although structs are implemented as maps with a __struct__ key, Elixir treats each struct as its own unique type for protocol dispatch. A protocol implementation for Map will not match %User{} — you need either a specific defimpl for: User, a defimpl for: Any fallback, or @derive to generate one.",
  },
  {
    question:
      "What is the purpose of the Collectable protocol?",
    options: [
      { label: "It defines how to count elements in a collection" },
      { label: "It defines how to convert a collection to a string" },
      {
        label:
          "It defines how to insert elements into a data structure, enabling Enum.into/2",
        correct: true,
      },
      { label: "It defines how to sort elements within a collection" },
    ],
    explanation:
      "Collectable is the counterpart to Enumerable. While Enumerable defines how to pull elements out of a data structure, Collectable defines how to push elements into one. This is what makes Enum.into/2 and for comprehensions with into: work with maps, lists, MapSets, and other collectible types.",
  },
  {
    question:
      "What happens if you define two defimpl blocks for the same protocol and the same type in a project?",
    options: [
      { label: "Both implementations are merged together" },
      { label: "The first one defined takes precedence" },
      {
        label:
          "A compiler warning is emitted and the last one defined wins",
        correct: true,
      },
      { label: "A compile error prevents the project from building" },
    ],
    explanation:
      "Elixir will emit a compiler warning about the protocol being reimplemented, and the last defimpl to be compiled wins. This is by design — it allows libraries to provide default implementations that downstream code can override, but the warning ensures you are aware of the conflict.",
  },
];

export default questions;
