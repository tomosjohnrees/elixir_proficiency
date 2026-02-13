import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What happens when you use %{map | key: value} with a key that doesn't exist in the map?",
    options: [
      { label: "It adds the new key to the map" },
      { label: "It returns nil" },
      { label: "It raises a KeyError", correct: true },
      { label: "It silently ignores the update" },
    ],
    explanation:
      "The pipe update syntax %{map | key: value} only works for existing keys. If the key doesn't exist, it raises a KeyError. Use Map.put/3 to add new keys.",
  },
  {
    question: "What is a struct in Elixir?",
    options: [
      { label: "A completely different data type from maps" },
      { label: "A map with a fixed set of atom keys and a module name", correct: true },
      { label: "A mutable object with methods" },
      { label: "A tuple with named fields" },
    ],
    explanation:
      "A struct is a map under the hood — it has a special __struct__ key with the module name and a fixed set of atom keys defined by defstruct. It's not a separate data type.",
  },
  {
    question: "What does map[:missing_key] return when the key doesn't exist?",
    options: [
      { label: "An error" },
      { label: "false" },
      { label: "nil", correct: true },
      { label: ":error" },
    ],
    explanation:
      "Bracket access map[:key] returns nil for missing keys. This is different from dot access map.key, which raises a KeyError. This is why bracket access is safer for keys you're not sure about.",
  },
  {
    question: "What does @enforce_keys do in a struct definition?",
    options: [
      { label: "Makes those keys immutable" },
      { label: "Requires those keys when creating the struct", correct: true },
      { label: "Validates the types of those keys" },
      { label: "Makes those keys private to the module" },
    ],
    explanation:
      "@enforce_keys lists keys that must be provided when creating the struct. If you try to create one without them, you get an ArgumentError. It doesn't do type validation — just presence checking.",
  },
  {
    question: "How do you update a deeply nested value in %{a: %{b: %{c: 1}}}?",
    options: [
      { label: "data.a.b.c = 2" },
      { label: "Map.put(data, :a, :b, :c, 2)" },
      { label: "put_in(data, [:a, :b, :c], 2)", correct: true },
      { label: "data |> Map.deep_put(:c, 2)" },
    ],
    explanation:
      "put_in/3 accepts a data structure and a list of keys as a path, then sets the value at that path. There's no assignment operator or Map.deep_put in Elixir — data is immutable.",
  },
  {
    question: "What is the value of `%User{name: \"Jo\"}.__struct__` for a struct defined with `defmodule User do defstruct [:name] end`?",
    options: [
      { label: ":user" },
      { label: "\"User\"" },
      { label: "User", correct: true },
      { label: "%User{}" },
    ],
    explanation:
      "Every struct carries a __struct__ key whose value is the module atom that defined it. For a struct defined in `defmodule User`, the value is the atom `User` (which is really `Elixir.User` under the hood). This is how Elixir identifies which module a struct belongs to at runtime.",
  },
  {
    question: "What does `Map.fetch(%{a: 1}, :b)` return?",
    options: [
      { label: "nil" },
      { label: "{:ok, nil}" },
      { label: ":error", correct: true },
      { label: "Raises a KeyError" },
    ],
    explanation:
      "Map.fetch/2 returns {:ok, value} when the key exists and :error when it doesn't. This is different from Map.get/2 (which returns nil) and map.key (which raises). The fetch pattern is idiomatic in Elixir for distinguishing between a missing key and a key set to nil.",
  },
  {
    question: "Given `m = %{\"name\" => \"Jo\"}`, what does `m.name` return?",
    options: [
      { label: "\"Jo\"" },
      { label: "nil" },
      { label: "It raises a KeyError", correct: true },
      { label: "It raises an ArgumentError" },
    ],
    explanation:
      "Dot access (m.name) looks for the atom key :name, not the string key \"name\". Since the map only has the string key \"name\", dot access raises a KeyError. This is a common gotcha when working with JSON-decoded data, which uses string keys. Use m[\"name\"] or Map.get(m, \"name\") instead.",
  },
  {
    question: "Can you pattern match a struct using plain map syntax like `%{name: name} = %User{name: \"Jo\"}`?",
    options: [
      { label: "No — structs and maps are different types" },
      { label: "Yes — it matches and binds name to \"Jo\"", correct: true },
      { label: "Yes — but only if you use Access syntax" },
      { label: "No — you must use %User{name: name}" },
    ],
    explanation:
      "Since structs are maps under the hood, you can pattern match them with plain map syntax. %{name: name} will match any map (including structs) that has a :name key. However, the reverse is not true — %User{} will not match a plain map, because it also checks the __struct__ key.",
  },
  {
    question: "What happens when you call `Map.keys(%User{name: \"Jo\", age: 25})`?",
    options: [
      { label: "It raises because Map functions don't work on structs" },
      { label: "[:name, :age]" },
      { label: "[:__struct__, :age, :name]", correct: true },
      { label: "[:name, :age, :__struct__] in insertion order" },
    ],
    explanation:
      "Map module functions do work on structs because structs are maps. Map.keys/1 returns all keys including the hidden __struct__ key. The keys are returned in alphabetical/sorted order for atom keys, which is why :__struct__ comes first. This is important to remember when iterating over struct fields.",
  },
  {
    question: "What does `get_in(%{a: %{b: 1}}, [:a, :c])` return?",
    options: [
      { label: "Raises a KeyError" },
      { label: ":error" },
      { label: "nil", correct: true },
      { label: "%{}" },
    ],
    explanation:
      "get_in/2 returns nil when any key in the path is missing, rather than raising an error. This makes it safe for exploring nested structures where intermediate keys might not exist. If you need to distinguish between a nil value and a missing key, use Kernel.get_in with Access.fetch/1.",
  },
  {
    question: "What does `update_in(%{counters: %{views: 10}}, [:counters, :views], &(&1 + 1))` return?",
    options: [
      { label: "%{counters: %{views: 10}}" },
      { label: "%{counters: %{views: 11}}", correct: true },
      { label: "11" },
      { label: "It raises because &(&1 + 1) is invalid" },
    ],
    explanation:
      "update_in/3 navigates to the nested value at the given path and applies the function to it. Here &(&1 + 1) is a capture shorthand for fn x -> x + 1 end, which increments the :views counter from 10 to 11. The entire nested structure is reconstructed immutably with the new value.",
  },
  {
    question: "Given `defmodule Cat do defstruct [:name] end`, what does `%Cat{} == %{__struct__: Cat, name: nil}` evaluate to?",
    options: [
      { label: "false — structs and maps are never equal" },
      { label: "true — they have identical key-value pairs", correct: true },
      { label: "false — the map is missing internal metadata" },
      { label: "It raises a CompileError" },
    ],
    explanation:
      "A struct is literally a map with a __struct__ key, so if you manually construct a map with the same keys and values (including __struct__), they are equal. This demonstrates that structs have no hidden runtime metadata beyond __struct__ — the distinction is primarily a compile-time concept with pattern matching benefits.",
  },
  {
    question: "Which of these correctly uses Access.at/1 to update the second element in a nested list?",
    options: [
      { label: "put_in(data, [:items, Access.at(1), :name], \"new\")", correct: true },
      { label: "put_in(data, [:items, 1, :name], \"new\")" },
      { label: "put_in(data.items[1].name, \"new\")" },
      { label: "update_in(data, [:items, Access.elem(1), :name], \"new\")" },
    ],
    explanation:
      "Access.at/1 is the correct accessor for reaching into a list by index within a nested path. Plain integers don't work as path components — you must wrap them with Access.at/1. Access.elem/1 is for tuples, not lists. The macro syntax (data.items[1].name) doesn't work because lists don't support bracket access by default.",
  },
  {
    question: "What does `Map.merge(%{a: 1, b: 2}, %{b: 3, c: 4})` return?",
    options: [
      { label: "%{a: 1, b: 2, c: 4}" },
      { label: "%{a: 1, b: 3, c: 4}", correct: true },
      { label: "%{a: 1, b: [2, 3], c: 4}" },
      { label: "It raises due to the key conflict on :b" },
    ],
    explanation:
      "Map.merge/2 combines two maps, and when there are conflicting keys, the value from the second (right) map wins. So :b gets the value 3 from the second map. If you need custom conflict resolution (like summing values), use Map.merge/3 which accepts a resolver function called for each conflicting key.",
  },
];

export default questions;
