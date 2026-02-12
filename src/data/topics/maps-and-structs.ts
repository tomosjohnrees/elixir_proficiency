import type { TopicContent } from "@/lib/types";

const mapsAndStructs: TopicContent = {
  meta: {
    slug: "maps-and-structs",
    title: "Maps & Structs",
    description: "Key-value maps, struct definitions, and nested updates",
    number: 4,
    active: true,
  },

  eli5: {
    analogyTitle: "The Filing Cabinet",
    analogy:
      "Imagine a filing cabinet where each drawer has a label and holds exactly one thing. You look up what you need by reading the labels — no need to open every drawer. That's a map. Now imagine a special filing cabinet that comes with a fixed set of labelled drawers built in, and you can't add or remove drawers — only change what's inside them. That's a struct.",
    items: [
      { label: "Maps", description: "A filing cabinet with labelled drawers. Any label works — strings, atoms, numbers. You can add or remove drawers whenever you want." },
      { label: "Structs", description: "A pre-built filing cabinet with a fixed set of labelled drawers. The labels are always atoms, and the cabinet knows exactly which drawers it should have." },
      { label: "Keys", description: "The labels on the drawers. In maps they can be anything. In structs they're always atoms defined up front." },
      { label: "Updating", description: "You never change the cabinet itself — you build a new one with the drawer contents swapped. The old cabinet stays exactly as it was." },
    ],
    keyTakeaways: [
      "Maps are Elixir's go-to key-value data structure. They allow any type as a key and are efficient at any size.",
      "Structs are maps with a fixed set of atom keys, a name, and compile-time guarantees.",
      "The update syntax %{map | key: new_value} only works for keys that already exist — it won't add new keys.",
      "Nested updates are common and can be done with put_in/3, update_in/3, or get_and_update_in/3.",
      "Structs provide a __struct__ field that identifies their module, enabling pattern matching on type.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "Map (atom keys)", color: "#2563eb", examples: ["%{name: \"Jo\", age: 30}", "%{ok: true}"], description: "When all keys are atoms, you get a shorthand syntax and dot access." },
      { name: "Map (mixed keys)", color: "#7c3aed", examples: ["%{\"name\" => \"Jo\"}", "%{1 => :one}"], description: "Any term can be a key using the => arrow syntax." },
      { name: "Struct", color: "#d97706", examples: ["%User{name: \"Jo\"}", "%URI{host: \"ex.com\"}"], description: "Named map with fixed atom keys. Defined with defstruct inside a module." },
      { name: "Nested Structure", color: "#059669", examples: ["%{user: %{address: %{city: \"NYC\"}}}"], description: "Maps and structs can nest freely. Use put_in/update_in for deep updates." },
    ],
    operatorGroups: [
      {
        name: "Map Operations",
        operators: [
          { symbol: "%{}", description: "Create a new map" },
          { symbol: "map.key", description: "Dot access (atom keys only, raises on missing)" },
          { symbol: "map[:key]", description: "Bracket access (returns nil on missing)" },
          { symbol: "%{map | key: val}", description: "Update existing key (raises if key missing)" },
          { symbol: "Map.put", description: "Add or update a key" },
          { symbol: "Map.merge", description: "Merge two maps (right wins)" },
        ],
      },
      {
        name: "Nested Access",
        operators: [
          { symbol: "get_in", description: "Read a value at a nested path" },
          { symbol: "put_in", description: "Set a value at a nested path" },
          { symbol: "update_in", description: "Apply a function at a nested path" },
        ],
      },
    ],
  },

  deepDive: {
    sections: [
      {
        title: "Creating and Reading Maps",
        prose: [
          "Maps are created with the %{} syntax. When all keys are atoms, you get a nice shorthand: %{name: \"Jo\"} instead of %{:name => \"Jo\"}. Both forms are identical under the hood.",
          "For atom-keyed maps you can use dot notation (map.name) which raises a KeyError if the key is missing, or bracket notation (map[:name]) which returns nil. For non-atom keys, use Map.get/2 or pattern matching.",
        ],
        code: {
          title: "Map basics",
          code: `# Atom keys — shorthand syntax
user = %{name: "José", language: "Elixir", age: 30}

# Access
user.name       # => "José"
user[:language]  # => "Elixir"

# Mixed keys — arrow syntax required
lookup = %{"one" => 1, "two" => 2}
lookup["one"]   # => 1

# Map.get with default
Map.get(user, :email, "n/a")   # => "n/a"

# Pattern matching on maps
%{name: name} = user
name   # => "José"

# You only need to match the keys you care about
%{age: age} = user
age   # => 30`,
          output: "30",
        },
      },
      {
        title: "Updating Maps",
        prose: [
          "Maps are immutable — every \"update\" returns a new map. The pipe syntax %{map | key: value} is the most common way to update existing keys. It's important to know this only works for keys that already exist — it will raise if the key is missing.",
          "To add a new key, use Map.put/3. To remove a key, use Map.delete/2. To merge two maps, use Map.merge/2 where the second map's values win on conflicts.",
        ],
        code: {
          title: "Updating maps",
          code: `user = %{name: "José", age: 30}

# Update existing key — pipe syntax
%{user | age: 31}   # => %{name: "José", age: 31}

# This raises! :email doesn't exist
# %{user | email: "j@ex.com"}  => ** (KeyError)

# Add a new key
Map.put(user, :email, "j@ex.com")
# => %{age: 30, email: "j@ex.com", name: "José"}

# Remove a key
Map.delete(user, :age)   # => %{name: "José"}

# Merge two maps (right wins)
defaults = %{role: "user", active: true}
overrides = %{role: "admin"}
Map.merge(defaults, overrides)
# => %{role: "admin", active: true}`,
          output: "%{role: \"admin\", active: true}",
        },
      },
      {
        title: "Structs",
        prose: [
          "A struct is a map with a fixed set of atom keys defined at compile time. You define one inside a module using defstruct. Structs give you default values, compile-time key validation, and a named type you can pattern match on.",
          "Under the hood, a struct is just a map with a special __struct__ key holding the module name. But you can't use map functions like Map.get directly on structs without explicitly converting — this is intentional, to encourage using the struct's module API.",
        ],
        code: {
          title: "Defining and using structs",
          code: `defmodule User do
  defstruct name: "", email: "", age: 0, active: true
end

# Create a struct
jose = %User{name: "José", email: "j@ex.com", age: 30}

# Access fields — same as maps
jose.name      # => "José"
jose.active    # => true

# Update fields — pipe syntax
%User{jose | age: 31}

# Pattern match on struct type
case jose do
  %User{name: name} -> "User: \#{name}"
  _ -> "Not a user"
end
# => "User: José"

# Unknown keys are caught at compile time!
# %User{height: 180}  => ** (KeyError)`,
          output: "\"User: José\"",
        },
      },
      {
        title: "Struct Defaults and Enforcement",
        prose: [
          "defstruct lets you set default values for fields. Fields without a default get nil. If you need to require certain fields (no default allowed), use @enforce_keys — the struct will refuse to compile without those keys.",
          "This is a powerful way to catch mistakes early. If your User must always have a name, enforce it and you'll get a compile-time error instead of a runtime bug.",
        ],
        code: {
          title: "Enforced keys and defaults",
          code: `defmodule Article do
  @enforce_keys [:title]
  defstruct title: nil, body: "", published: false, tags: []
end

# This works — :title is provided
%Article{title: "Elixir Maps"}
# => %Article{title: "Elixir Maps", body: "", published: false, tags: []}

# This fails at compile time!
# %Article{body: "no title"}
# => ** (ArgumentError) the following keys must also be given
#    when building struct Article: [:title]

# Defaults fill in the rest
%Article{title: "Hello", tags: ["elixir", "maps"]}
# => %Article{title: "Hello", body: "", published: false,
#             tags: ["elixir", "maps"]}`,
          output: "%Article{title: \"Hello\", body: \"\", published: false, tags: [\"elixir\", \"maps\"]}",
        },
      },
      {
        title: "Nested Access and Updates",
        prose: [
          "Real-world data is often nested — a user has an address, which has a city. Elixir provides put_in/2, get_in/2, and update_in/2 for working with nested structures without tedious manual unpacking.",
          "These functions accept a list of keys as a path. For maps with atom keys, you can also use the macro versions with Access-style syntax for a cleaner look.",
        ],
        code: {
          title: "Working with nested data",
          code: `data = %{
  user: %{
    name: "José",
    address: %{city: "Kraków", country: "Poland"}
  }
}

# Read nested value
get_in(data, [:user, :address, :city])
# => "Kraków"

# Set nested value
put_in(data, [:user, :address, :city], "Warsaw")
# => %{user: %{name: "José", address: %{city: "Warsaw", ...}}}

# Update with a function
update_in(data, [:user, :name], &String.upcase/1)
# => %{user: %{name: "JOSÉ", address: %{...}}}

# Macro syntax (atom keys only)
put_in(data.user.address.city, "Wrocław")
# => %{user: %{name: "José", address: %{city: "Wrocław", ...}}}`,
          output: "%{user: %{name: \"José\", address: %{city: \"Wrocław\", country: \"Poland\"}}}",
        },
      },
      {
        title: "Maps vs Keyword Lists vs Structs",
        prose: [
          "Knowing when to use which is a key Elixir skill. Maps are the default for key-value data — use them unless you have a reason not to. Keyword lists are for options and when you need duplicate keys or ordering. Structs are for domain entities with a known shape.",
          "A common pattern: function options are keyword lists (so callers can use the nice bare syntax), but internal data structures are maps or structs. You'll often see Enum.into(keyword_list, %{}) to convert options to a map for easier handling inside the function.",
        ],
        code: {
          title: "Choosing the right structure",
          code: `# Keyword list — for function options
String.split("a.b.c", ".", trim: true, parts: 2)

# Map — for general key-value data
scores = %{"Alice" => 95, "Bob" => 87}
Map.values(scores)   # => [95, 87]

# Struct — for domain entities
defmodule Player do
  defstruct name: "", score: 0, level: 1
end

player = %Player{name: "Alice", score: 95}
%Player{player | score: player.score + 10}
# => %Player{name: "Alice", score: 105, level: 1}

# Converting keyword list to map
opts = [timeout: 5000, retries: 3]
Map.new(opts)   # => %{retries: 3, timeout: 5000}`,
          output: "%{retries: 3, timeout: 5000}",
        },
      },
    ],
  },

  quiz: {
    questions: [
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
    ],
  },

  practice: {
    problems: [
      {
        title: "Map Explorer",
        difficulty: "beginner",
        prompt:
          "Given the map %{name: \"Elixir\", year: 2012, creator: \"José Valim\"}, write expressions to:\n1. Get the :name value using dot access\n2. Get the :version value safely (it doesn't exist)\n3. Add a :version key with value \"1.16\"\n4. Update the :year to 2011\n5. Remove the :creator key",
        hints: [
          { text: "Dot access (map.key) raises on missing keys. Bracket access (map[:key]) returns nil." },
          { text: "Map.put/3 adds or updates a key. The pipe syntax %{map | key: val} only updates existing keys." },
          { text: "Map.delete/2 removes a key from a map." },
        ],
        solution: `lang = %{name: "Elixir", year: 2012, creator: "José Valim"}

# 1. Dot access
lang.name   # => "Elixir"

# 2. Safe access for missing key
lang[:version]   # => nil
# or: Map.get(lang, :version, "unknown")  => "unknown"

# 3. Add a new key
Map.put(lang, :version, "1.16")
# => %{name: "Elixir", year: 2012, creator: "José Valim", version: "1.16"}

# 4. Update existing key
%{lang | year: 2011}
# => %{name: "Elixir", year: 2011, creator: "José Valim"}

# 5. Remove a key
Map.delete(lang, :creator)
# => %{name: "Elixir", year: 2012}`,
        walkthrough: [
          "Dot access (lang.name) is clean and readable, but raises KeyError if the key is missing. Use it when you're certain the key exists.",
          "Bracket access (lang[:version]) returns nil for missing keys, making it safe for optional fields. Map.get/3 lets you provide a default.",
          "Map.put/3 is the way to add new keys. The pipe syntax %{lang | version: \"1.16\"} would raise because :version doesn't exist yet.",
          "The pipe syntax %{lang | year: 2011} is perfect for updating existing keys — it's clear and will catch typos by raising on missing keys.",
          "Map.delete/2 returns a new map without the specified key. The original map is untouched.",
        ],
      },
      {
        title: "Struct Designer",
        difficulty: "beginner",
        prompt:
          "Define a Book struct with the following requirements:\n- :title is required (enforced)\n- :author is required (enforced)\n- :pages defaults to 0\n- :published defaults to false\n- :tags defaults to an empty list\n\nThen create two books and demonstrate pattern matching to extract the author from a book.",
        hints: [
          { text: "Use @enforce_keys before defstruct to require certain fields." },
          { text: "defstruct takes a keyword list where the values are the defaults." },
          { text: "Pattern match with %Book{author: author} to extract the author." },
        ],
        solution: `defmodule Book do
  @enforce_keys [:title, :author]
  defstruct title: nil, author: nil, pages: 0, published: false, tags: []
end

# Create books
elixir_in_action = %Book{
  title: "Elixir in Action",
  author: "Saša Jurić",
  pages: 384,
  published: true,
  tags: ["elixir", "programming"]
}

programming_phoenix = %Book{
  title: "Programming Phoenix",
  author: "Chris McCord",
  pages: 356
}

# Pattern match to extract author
%Book{author: author} = elixir_in_action
author   # => "Saša Jurić"

# Pattern match in a function
defmodule Library do
  def by?(book, name) do
    match?(%Book{author: ^name}, book)
  end
end

Library.by?(elixir_in_action, "Saša Jurić")   # => true`,
        walkthrough: [
          "@enforce_keys [:title, :author] ensures these fields must always be provided — omitting them raises an ArgumentError.",
          "The defaults in defstruct fill in any fields not provided at creation time. programming_phoenix gets pages: 0, published: false, tags: [] automatically.",
          "Pattern matching with %Book{author: author} extracts just the field you need. You don't have to match every field.",
          "The match?/2 macro combined with the pin operator (^name) lets you check if a struct field matches a specific value without extracting it.",
        ],
      },
      {
        title: "Nested Data Transformer",
        difficulty: "intermediate",
        prompt:
          "Given this nested data:\n%{company: %{name: \"Dashbit\", team: [%{name: \"José\", role: \"founder\"}, %{name: \"Marlus\", role: \"developer\"}]}}\n\nWrite expressions to:\n1. Get the company name\n2. Change the company name to \"Dashbit Inc.\"\n3. Uppercase José's name in the team list\n4. Add a new team member %{name: \"Andrea\", role: \"developer\"}",
        hints: [
          { text: "get_in/2 and put_in/3 work great for nested paths. The path is a list of keys." },
          { text: "For updating inside a list at a specific index, use Access.at/1 in the path." },
          { text: "For appending to a nested list, get the list, append, then put it back." },
        ],
        solution: `data = %{
  company: %{
    name: "Dashbit",
    team: [
      %{name: "José", role: "founder"},
      %{name: "Marlus", role: "developer"}
    ]
  }
}

# 1. Get the company name
get_in(data, [:company, :name])   # => "Dashbit"

# 2. Change the company name
put_in(data, [:company, :name], "Dashbit Inc.")

# 3. Uppercase José's name (first team member)
update_in(data, [:company, :team, Access.at(0), :name], &String.upcase/1)
# => %{company: %{name: "Dashbit", team: [%{name: "JOSÉ", ...}, ...]}}

# 4. Add a new team member
new_member = %{name: "Andrea", role: "developer"}
update_in(data, [:company, :team], fn team -> team ++ [new_member] end)`,
        walkthrough: [
          "get_in/2 walks the path [:company, :name] to reach the nested value — much cleaner than data.company.name for dynamic paths.",
          "put_in/3 creates a new nested structure with the value replaced at the specified path. All intermediate maps are reconstructed immutably.",
          "Access.at(0) tells update_in to target the element at index 0 in the list. Combined with :name, it reaches into the first team member's name.",
          "For appending, we use update_in with a function that takes the current team list and concatenates the new member. There's no built-in path accessor for appending.",
        ],
      },
      {
        title: "Config Registry",
        difficulty: "advanced",
        prompt:
          "Build a ConfigRegistry module that manages a nested map of configuration settings. Implement:\n1. new/0 — returns an empty config map\n2. set/3 — takes a config, a path (list of keys), and a value; sets the value at that path\n3. get/3 — takes a config, a path, and a default; returns the value at the path or the default\n4. merge/2 — deep-merges two config maps (second wins on conflicts)\n\nExample: ConfigRegistry.set(%{}, [:db, :host], \"localhost\") should return %{db: %{host: \"localhost\"}}",
        hints: [
          { text: "put_in/3 won't work for paths where intermediate keys don't exist yet. You'll need to build them." },
          { text: "For set/3, consider building the nested map from the path in reverse, or using Enum.reduce." },
          { text: "For deep merge, recursively merge when both values are maps; otherwise the second value wins." },
        ],
        solution: `defmodule ConfigRegistry do
  def new, do: %{}

  def set(config, [key], value) do
    Map.put(config, key, value)
  end

  def set(config, [key | rest], value) do
    inner = Map.get(config, key, %{})
    Map.put(config, key, set(inner, rest, value))
  end

  def get(config, path, default \\\\ nil) do
    case get_in(config, path) do
      nil -> default
      value -> value
    end
  end

  def merge(base, override) when is_map(base) and is_map(override) do
    Map.merge(base, override, fn
      _key, v1, v2 when is_map(v1) and is_map(v2) -> merge(v1, v2)
      _key, _v1, v2 -> v2
    end)
  end
end

config = ConfigRegistry.new()
  |> ConfigRegistry.set([:db, :host], "localhost")
  |> ConfigRegistry.set([:db, :port], 5432)
  |> ConfigRegistry.set([:app, :name], "MyApp")

# => %{app: %{name: "MyApp"}, db: %{host: "localhost", port: 5432}}

ConfigRegistry.get(config, [:db, :host], "127.0.0.1")   # => "localhost"
ConfigRegistry.get(config, [:db, :user], "postgres")     # => "postgres"

other = %{db: %{host: "prod.db.com", pool: 10}}
ConfigRegistry.merge(config, other)
# => %{app: %{name: "MyApp"}, db: %{host: "prod.db.com", port: 5432, pool: 10}}`,
        walkthrough: [
          "set/3 uses pattern matching on the path: a single-key path is the base case (just Map.put), while a multi-key path recurses into the nested map.",
          "Map.get(config, key, %{}) is crucial — if the intermediate key doesn't exist yet, we start with an empty map rather than crashing.",
          "get/3 delegates to the built-in get_in/2 and falls back to the default when the result is nil.",
          "merge/2 uses Map.merge/3 with a conflict resolver. When both values are maps, it recurses for a deep merge. Otherwise, the override value wins.",
          "The three-argument form of Map.merge takes a function called on key conflicts: fn key, value1, value2 -> resolved_value end.",
        ],
      },
    ],
  },
};

export default mapsAndStructs;
