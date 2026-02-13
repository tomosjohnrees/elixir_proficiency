import type { TopicContent } from "@/lib/types";
import questions from "./questions/ets";

const ets: TopicContent = {
  meta: {
    slug: "ets",
    title: "ETS (Erlang Term Storage)",
    description: "In-memory storage, table types, concurrent access, and match specifications",
    number: 27,
    active: true,
  },

  eli5: {
    analogyTitle: "The Shared Whiteboard",
    analogy:
      "Imagine your office has a giant whiteboard in the hallway. Anyone walking by can read what's on it instantly — no need to ask permission or wait in line. The person who put the whiteboard up is in charge of erasing and updating it, but reading is free for everyone. That whiteboard is ETS.",
    items: [
      { label: "The Whiteboard", description: "An ETS table — a big shared surface where data is written as rows. Any process can walk up and read it without waiting." },
      { label: "The Owner", description: "The person who hung the whiteboard. They're responsible for it. If they leave the building, the whiteboard gets taken down unless they hand it off to someone else." },
      { label: "Table Types", description: "Different whiteboard layouts. A 'set' has one sticky note per label. A 'bag' lets you stack multiple notes under the same label. An 'ordered set' keeps labels in alphabetical order." },
      { label: "Named Tables", description: "Like putting a nameplate on the whiteboard so everyone knows it as 'The Sales Board' — instead of pointing at it, you just say its name." },
    ],
    keyTakeaways: [
      "ETS is in-memory storage built into the BEAM VM — no external dependencies needed.",
      "Tables are owned by a process and are deleted if the owner crashes (unless an heir is set).",
      "Reads are concurrent and fast — no single-process bottleneck like GenServer state.",
      "There are four table types: set, ordered_set, bag, and duplicate_bag.",
      "ETS is ideal for read-heavy shared data like caches, counters, and lookup tables.",
    ],
  },

  visuals: {
    dataTypes: [
      {
        name: "Set",
        color: "#6b46c1",
        examples: ["{:alice, 30}", "{:bob, 25}", "{:carol, 35}"],
        description: "One row per key. Inserting a duplicate key replaces the old row. The default type.",
      },
      {
        name: "Ordered Set",
        color: "#2563eb",
        examples: ["{1, :first}", "{2, :second}", "{3, :third}"],
        description: "Like a set, but keys are kept in sorted order. Uses == for key comparison, so 1 and 1.0 are the same key.",
      },
      {
        name: "Bag",
        color: "#d97706",
        examples: ["{:tag, :elixir}", "{:tag, :erlang}", "{:tag, :beam}"],
        description: "Multiple rows can share a key, as long as the full tuples are different.",
      },
      {
        name: "Duplicate Bag",
        color: "#059669",
        examples: ["{:log, :info}", "{:log, :info}", "{:log, :error}"],
        description: "Like a bag, but even fully identical rows are allowed. Useful for event logs.",
      },
      {
        name: "Access Modes",
        color: "#e11d48",
        examples: [":public", ":protected", ":private"],
        description: "Controls who can read/write. Protected (default): any process reads, only owner writes. Public: anyone reads/writes. Private: owner only.",
      },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "Creating and Configuring Tables",
        prose: [
          "You create an ETS table with :ets.new/2, passing a name atom and a list of options. The function returns a table reference (an integer) that you use for subsequent operations. If you pass the :named_table option, you can also access the table by its name.",
          "Common options include the table type (:set, :ordered_set, :bag, :duplicate_bag), the access mode (:public, :protected, :private), and :named_table. You can also set {:keypos, n} to change which tuple element is used as the key (default is position 1).",
          "Remember: the process that calls :ets.new/2 becomes the table's owner. If that process dies, the table is deleted. For long-lived tables, create them in a supervised process like a GenServer or your application's supervision tree.",
        ],
        code: {
          title: "Creating ETS tables",
          code: `# Basic set table (returns a reference)
ref = :ets.new(:cache, [:set])

# Named table — accessible by atom :users
:ets.new(:users, [:set, :named_table])

# Ordered set with public access
:ets.new(:leaderboard, [:ordered_set, :named_table, :public])

# Bag table with custom key position
:ets.new(:index, [:bag, :named_table, {:keypos, 2}])

# Table with an heir — survives owner death
:ets.new(:important, [
  :set,
  :named_table,
  {:heir, supervisor_pid, :table_data}
])`,
          output: ":important",
        },
      },
      {
        title: "Basic CRUD Operations",
        prose: [
          "ETS operations follow Erlang conventions, so they feel a bit different from typical Elixir code. Inserts return true, lookups return lists, and errors raise ArgumentError rather than returning error tuples.",
          "The :ets.insert/2 function adds one or more tuples. For :set and :ordered_set tables, inserting a tuple with an existing key replaces the old row. The :ets.lookup/2 function returns a list of matching tuples — an empty list means no match. Use :ets.delete/2 to remove rows by key.",
          "For atomic counter updates, :ets.update_counter/3 is invaluable. It increments or decrements an integer element in a tuple without any race conditions, making it perfect for things like hit counters or rate limiters.",
        ],
        code: {
          title: "CRUD operations",
          code: `:ets.new(:people, [:set, :named_table])

# Insert single tuple
:ets.insert(:people, {"alice", 30, :engineer})

# Insert multiple tuples at once
:ets.insert(:people, [
  {"bob", 25, :designer},
  {"carol", 35, :manager}
])

# Lookup by key — returns a list
:ets.lookup(:people, "alice")
# => [{"alice", 30, :engineer}]

# Lookup missing key — empty list
:ets.lookup(:people, "dave")
# => []

# Delete by key
:ets.delete(:people, "bob")

# Delete entire table
:ets.delete(:people)

# Atomic counter example
:ets.new(:stats, [:set, :named_table])
:ets.insert(:stats, {:page_views, 0})
:ets.update_counter(:stats, :page_views, 1)  # => 1
:ets.update_counter(:stats, :page_views, 1)  # => 2
:ets.update_counter(:stats, :page_views, 5)  # => 7`,
          output: "7",
        },
      },
      {
        title: "Table Types in Depth",
        prose: [
          "The four table types serve different use cases. A :set is the workhorse — one row per key, constant-time lookup via hashing. Think of it as a hash map. An :ordered_set keeps keys in sorted order using a balanced tree, so traversal is ordered but lookup is O(log n) instead of O(1).",
          "A :bag allows multiple rows with the same key, as long as the complete tuples are different. This is useful for indexes where one key maps to many values. A :duplicate_bag goes further and allows completely identical rows, which is useful for append-only logs or event streams.",
          "One subtle gotcha: :ordered_set uses value comparison (==) for keys, meaning 1 and 1.0 are considered the same key. The other three types use exact match (===), so 1 and 1.0 would be different keys. This can cause surprising behavior if you mix integer and float keys.",
        ],
        code: {
          title: "Table type behavior",
          code: `# :set — last insert wins
:ets.new(:config, [:set, :named_table])
:ets.insert(:config, {:theme, "dark"})
:ets.insert(:config, {:theme, "light"})
:ets.lookup(:config, :theme)
# => [{:theme, "light"}]  — replaced!

# :bag — multiple values per key
:ets.new(:tags, [:bag, :named_table])
:ets.insert(:tags, {:post_1, "elixir"})
:ets.insert(:tags, {:post_1, "erlang"})
:ets.insert(:tags, {:post_1, "elixir"})  # ignored, duplicate
:ets.lookup(:tags, :post_1)
# => [{:post_1, "elixir"}, {:post_1, "erlang"}]

# :ordered_set — keys sorted, == comparison
:ets.new(:scores, [:ordered_set, :named_table])
:ets.insert(:scores, {1, "alice"})
:ets.insert(:scores, {1.0, "bob"})   # replaces! 1 == 1.0
:ets.lookup(:scores, 1)
# => [{1.0, "bob"}]`,
          output: "[{1.0, \"bob\"}]",
        },
      },
      {
        title: "Match Specifications and Select",
        prose: [
          "While :ets.lookup/2 finds rows by key, match specifications let you query rows by any criteria — like a mini query language built into ETS. The :ets.match/2 and :ets.select/2 functions use patterns to filter and extract data directly inside ETS, which is far more efficient than pulling all rows into your process.",
          "The :ets.match/2 function uses simple patterns with :_ for wildcards and :\"$1\", :\"$2\" etc. for capture variables. The :ets.select/2 function uses full match specifications — a list of {pattern, guards, result} triples — giving you guard-level filtering power.",
          "For complex match specifications, you can use :ets.fun2ms/1 in IEx to convert an anonymous function into a match spec. This is much more readable than writing match specs by hand. Just remember that fun2ms is a parse transform and only works in IEx or with the :ms_transform compile option.",
        ],
        code: {
          title: "Querying with match and select",
          code: `:ets.new(:employees, [:set, :named_table])
:ets.insert(:employees, [
  {:alice, :engineering, 95_000},
  {:bob, :design, 85_000},
  {:carol, :engineering, 105_000},
  {:dave, :marketing, 75_000}
])

# Match pattern — :_ is wildcard, :"$1" captures
:ets.match(:employees, {:"$1", :engineering, :_})
# => [[:alice], [:carol]]

# match_object returns full tuples
:ets.match_object(:employees, {:_, :engineering, :_})
# => [{:alice, :engineering, 95000}, {:carol, :engineering, 105000}]

# select with match specification
# Find names of employees earning > 90_000
ms = [
  {{:"$1", :"$2", :"$3"},        # pattern
   [{:>, :"$3", 90_000}],         # guards
   [{{:"$1", :"$3"}}]}            # result
]
:ets.select(:employees, ms)
# => [{:alice, 95000}, {:carol, 105000}]`,
          output: "[{:alice, 95000}, {:carol, 105000}]",
        },
      },
      {
        title: "Ownership, Heirs, and Table Lifecycle",
        prose: [
          "ETS tables are tied to their owner process. When the owner dies — whether from a crash, a normal exit, or being killed — the table is deleted. This is the most common source of data loss with ETS and something you must plan for.",
          "There are two strategies to handle this. First, you can use the :heir option to designate a backup process. When the owner dies, the table is transferred to the heir, which receives a message {:ETS-TRANSFER, table, from_pid, data}. Second, you can use :ets.give_away/3 to explicitly transfer ownership to another process at any time.",
          "A common pattern is to create ETS tables in a dedicated GenServer whose sole job is to own the table. This GenServer lives in your supervision tree, so if it crashes, the supervisor restarts it. You can combine this with the :heir option pointing to the supervisor for extra safety.",
        ],
        code: {
          title: "Ownership and transfer",
          code: `defmodule CacheOwner do
  use GenServer

  def start_link(opts) do
    GenServer.start_link(__MODULE__, opts, name: __MODULE__)
  end

  def init(_opts) do
    table = :ets.new(:app_cache, [
      :set,
      :named_table,
      :public,
      read_concurrency: true
    ])
    {:ok, %{table: table}}
  end

  # If this GenServer receives ownership via heir transfer
  def handle_info({:"ETS-TRANSFER", table, _from, _data}, state) do
    {:noreply, %{state | table: table}}
  end
end

# In your application supervision tree:
children = [
  CacheOwner,
  # ... other workers that read from :app_cache
]`,
          output: ":ok",
        },
      },
      {
        title: "Concurrency and Performance",
        prose: [
          "ETS tables live in their own memory space, separate from any process heap. This means reading from ETS involves copying the data into the calling process's memory. For small values this is negligible, but for large values (big lists, deeply nested maps) the copy cost can add up.",
          "The read_concurrency: true option optimizes the table for concurrent reads by using reader-writer locks internally. This is ideal for read-heavy workloads like caches. Conversely, write_concurrency: true optimizes for concurrent writes by using fine-grained locking. You can enable both if your workload is mixed.",
          "ETS is often the right choice over a GenServer when you have a read-heavy, write-light pattern — like a configuration cache or a routing table. A GenServer serializes all requests through its mailbox, so 1000 concurrent readers would queue up. With a :public ETS table and read_concurrency: true, all 1000 reads happen in parallel with no bottleneck.",
        ],
        code: {
          title: "Performance-tuned ETS",
          code: `# Read-heavy cache: many readers, rare writes
:ets.new(:route_cache, [
  :set,
  :named_table,
  :public,
  read_concurrency: true
])

# Write-heavy counter: many writers
:ets.new(:metrics, [
  :set,
  :named_table,
  :public,
  write_concurrency: true
])

# Mixed workload
:ets.new(:sessions, [
  :set,
  :named_table,
  :public,
  read_concurrency: true,
  write_concurrency: true
])

# Check table info
:ets.info(:route_cache, :size)      # number of rows
:ets.info(:route_cache, :memory)    # memory in words
:ets.info(:route_cache, :type)      # :set

# Efficient iteration with :ets.foldl
total = :ets.foldl(
  fn {_key, amount}, acc -> acc + amount end,
  0,
  :metrics
)`,
          output: "0",
        },
      },
    ],
  },

  quiz: {
    questions,
  },

  practice: {
    problems: [
      {
        title: "Simple Key-Value Cache",
        difficulty: "beginner",
        prompt:
          "Create a module called KVCache that wraps an ETS table. Implement start/0 (creates a named :set table), put/2 (stores a key-value pair), get/1 (returns {:ok, value} or :error), and delete/1 (removes a key). Use a :named_table so you don't need to pass a reference around.",
        hints: [
          { text: "Use :ets.new/2 with [:set, :named_table] to create the table." },
          { text: "Store data as {key, value} tuples. Remember :ets.lookup/2 returns a list." },
          { text: "Pattern match on the :ets.lookup/2 result: [{_key, value}] means found, [] means not found." },
        ],
        solution: `defmodule KVCache do
  @table :kv_cache

  def start do
    :ets.new(@table, [:set, :named_table, :public])
    :ok
  end

  def put(key, value) do
    :ets.insert(@table, {key, value})
    :ok
  end

  def get(key) do
    case :ets.lookup(@table, key) do
      [{^key, value}] -> {:ok, value}
      [] -> :error
    end
  end

  def delete(key) do
    :ets.delete(@table, key)
    :ok
  end
end`,
        walkthrough: [
          "We define a module attribute @table to hold the table name, keeping it consistent across all functions.",
          "start/0 creates a :set table with :named_table so all functions can reference it by name. We use :public access so any process can read and write.",
          "put/2 inserts a {key, value} tuple. For a :set table, if the key already exists, the old row is replaced.",
          "get/1 uses :ets.lookup/2 which returns a list. We pattern match: a single-element list means we found it, an empty list means the key doesn't exist. The pin operator ^key ensures we match the exact key.",
          "delete/1 removes the row by key. :ets.delete/2 returns true whether or not the key existed.",
        ],
      },
      {
        title: "Rate Limiter",
        difficulty: "intermediate",
        prompt:
          "Build a rate limiter using ETS and :ets.update_counter/3. Implement a RateLimiter module with: start/0, allow?/2 (takes a client_id and max_requests_per_window), and reset/1 (resets a client's counter). The rate window should be 60 seconds. Track both the count and the window start time. Hint: use System.monotonic_time(:second) for timestamps.",
        hints: [
          { text: "Store tuples like {client_id, count, window_start}. Use {:keypos, 1}." },
          { text: "When checking a request, first see if the client exists and whether their window has expired. If expired, reset the counter." },
          { text: "Use :ets.update_counter/3 for atomic increments. The third argument can be {position, increment} to specify which element to increment." },
          { text: "Consider using :ets.insert_new/2 for the first request from a new client — it only inserts if the key doesn't exist." },
        ],
        solution: `defmodule RateLimiter do
  @table :rate_limiter
  @window_seconds 60

  def start do
    :ets.new(@table, [:set, :named_table, :public])
    :ok
  end

  def allow?(client_id, max_requests) do
    now = System.monotonic_time(:second)

    case :ets.lookup(@table, client_id) do
      [{^client_id, count, window_start}]
        when now - window_start < @window_seconds ->
        if count < max_requests do
          :ets.update_counter(@table, client_id, {2, 1})
          true
        else
          false
        end

      _ ->
        # New client or expired window — start fresh
        :ets.insert(@table, {client_id, 1, now})
        true
    end
  end

  def reset(client_id) do
    :ets.delete(@table, client_id)
    :ok
  end
end`,
        walkthrough: [
          "We store each client as a {client_id, count, window_start} tuple in a :set table.",
          "allow?/2 first gets the current monotonic time, then looks up the client. We use a guard (when now - window_start < @window_seconds) to check if the window is still active.",
          "If the window is active and count is below the limit, we atomically increment the counter with :ets.update_counter/3. The {2, 1} tuple means 'increment element at position 2 by 1'.",
          "If the window has expired or the client is new (the _ catch-all), we insert a fresh row with count 1 and the current timestamp. This effectively resets their window.",
          "reset/1 simply deletes the client's entry, so their next request starts a fresh window.",
        ],
      },
      {
        title: "Indexed Lookup Table",
        difficulty: "advanced",
        prompt:
          "Build a UserDirectory module that stores user records and supports lookup by both ID and email. Use two ETS tables: a primary :set table keyed by user_id, and a secondary :bag index table keyed by email. Implement: start/0, insert/1 (takes a map with :id, :name, :email), lookup_by_id/1, lookup_by_email/1, and delete/1 (by id, must also clean up the index). Handle the case where a user's email changes on re-insert.",
        hints: [
          { text: "Create two named tables: :users (primary, :set) and :users_by_email (:set for 1:1 email mapping)." },
          { text: "When inserting, first check if the user already exists so you can remove their old email from the index." },
          { text: "For the email index, store {email, user_id} tuples so you can look up the email, get the id, then fetch the full record." },
          { text: "In delete/1, fetch the user first to get their email, then delete from both tables." },
        ],
        solution: `defmodule UserDirectory do
  @primary :users
  @email_index :users_by_email

  def start do
    :ets.new(@primary, [:set, :named_table, :public])
    :ets.new(@email_index, [:set, :named_table, :public])
    :ok
  end

  def insert(%{id: id, name: name, email: email}) do
    # Clean up old email index if user exists
    case :ets.lookup(@primary, id) do
      [{^id, _name, old_email}] ->
        :ets.delete(@email_index, old_email)
      [] ->
        :ok
    end

    :ets.insert(@primary, {id, name, email})
    :ets.insert(@email_index, {email, id})
    :ok
  end

  def lookup_by_id(id) do
    case :ets.lookup(@primary, id) do
      [{^id, name, email}] ->
        {:ok, %{id: id, name: name, email: email}}
      [] ->
        :error
    end
  end

  def lookup_by_email(email) do
    case :ets.lookup(@email_index, email) do
      [{^email, id}] -> lookup_by_id(id)
      [] -> :error
    end
  end

  def delete(id) do
    case :ets.lookup(@primary, id) do
      [{^id, _name, email}] ->
        :ets.delete(@email_index, email)
        :ets.delete(@primary, id)
        :ok
      [] ->
        :error
    end
  end
end`,
        walkthrough: [
          "We use two ETS tables: a primary table keyed by user ID and a secondary index keyed by email. This gives us O(1) lookups on both fields.",
          "insert/1 first checks if the user already exists. If so, it removes the old email from the index before inserting — this handles the case where a user changes their email address.",
          "lookup_by_email/1 is a two-step process: look up the email in the index to get the user ID, then fetch the full record from the primary table. This is a common pattern for secondary indexes.",
          "delete/1 must clean up both tables. We fetch the user first to get their email, delete from the email index, then delete from the primary table. If the user doesn't exist, we return :error.",
          "This pattern mirrors how databases implement secondary indexes, but in pure in-memory ETS. For production use, you'd want to wrap this in a GenServer to ensure the two tables stay consistent.",
        ],
      },
    ],
  },
};

export default ets;
