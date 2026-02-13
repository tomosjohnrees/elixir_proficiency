import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What does ETS stand for in Erlang/Elixir?",
    options: [
      { label: "Erlang Term Storage", correct: true },
      { label: "Elixir Table System" },
      { label: "Erlang Transaction Service" },
      { label: "Elixir Term Store" },
    ],
    explanation:
      "ETS stands for Erlang Term Storage. It's a built-in in-memory storage system inherited from Erlang that can store large amounts of data with constant-time access.",
  },
  {
    question: "Which function creates a new ETS table?",
    options: [
      { label: ":ets.create/2" },
      { label: ":ets.new/2", correct: true },
      { label: ":ets.init/2" },
      { label: ":ets.start/2" },
    ],
    explanation:
      "You create a new ETS table with :ets.new/2, passing a name (atom) and a list of options. For example: :ets.new(:my_table, [:set, :named_table]).",
  },
  {
    question: "What happens to an ETS table when its owner process crashes?",
    options: [
      { label: "The table persists indefinitely" },
      { label: "The table is automatically transferred to the supervisor" },
      { label: "The table is deleted", correct: true },
      { label: "The table becomes read-only" },
    ],
    explanation:
      "ETS tables are owned by the process that created them. When the owner process dies, the table is automatically deleted and all its data is lost. You can use :ets.give_away/3 to transfer ownership or set up an heir with the :heir option.",
  },
  {
    question: "Which ETS table type allows multiple rows with the same key?",
    options: [
      { label: ":set" },
      { label: ":ordered_set" },
      { label: ":bag", correct: true },
      { label: ":unique_bag" },
    ],
    explanation:
      "A :bag table allows multiple rows with the same key, as long as the rows aren't completely identical. A :duplicate_bag goes further and allows fully identical rows too. Both :set and :ordered_set enforce unique keys.",
  },
  {
    question: "What is the default table type when creating an ETS table?",
    options: [
      { label: ":set", correct: true },
      { label: ":ordered_set" },
      { label: ":bag" },
      { label: ":duplicate_bag" },
    ],
    explanation:
      "The default table type is :set, which stores tuples where the first element is the key and keys must be unique. If you insert a tuple with an existing key, it replaces the old row.",
  },
  {
    question: "How do you look up a value by key in an ETS table?",
    options: [
      { label: ":ets.get(table, key)" },
      { label: ":ets.fetch(table, key)" },
      { label: ":ets.lookup(table, key)", correct: true },
      { label: ":ets.find(table, key)" },
    ],
    explanation:
      ":ets.lookup/2 returns a list of matching tuples. For a :set or :ordered_set table, this list will have at most one element. For :bag or :duplicate_bag, it can have multiple. An empty list means no match was found.",
  },
  {
    question: "What does :ets.lookup/2 return when no matching key is found?",
    options: [
      { label: "nil" },
      { label: ":error" },
      { label: "{:error, :not_found}" },
      { label: "An empty list []", correct: true },
    ],
    explanation:
      ":ets.lookup/2 always returns a list. When no match is found, it returns an empty list []. This is different from many Elixir APIs that return nil or {:error, reason}. You need to pattern match on the result to handle the empty case.",
  },
  {
    question: "Which option makes an ETS table accessible by its name atom instead of a reference?",
    options: [
      { label: ":public" },
      { label: ":named_table", correct: true },
      { label: ":registered" },
      { label: ":named" },
    ],
    explanation:
      "The :named_table option registers the table so it can be accessed by its name atom. Without this option, you must use the table reference returned by :ets.new/2. Named tables are convenient but the name must be unique across the node.",
  },
  {
    question: "What is the key difference between :set and :ordered_set?",
    options: [
      { label: ":ordered_set allows duplicate keys" },
      { label: ":ordered_set stores elements sorted by key", correct: true },
      { label: ":ordered_set is thread-safe while :set is not" },
      { label: ":ordered_set uses less memory" },
    ],
    explanation:
      "An :ordered_set table keeps its elements sorted by key, which means operations like :ets.first/1 and :ets.next/2 traverse keys in order. However, :ordered_set compares keys by value (==) rather than by match (===), so 1 and 1.0 are considered the same key.",
  },
  {
    question: "Which access mode allows any process to read from an ETS table but only the owner to write?",
    options: [
      { label: ":private" },
      { label: ":public" },
      { label: ":protected", correct: true },
      { label: ":read_only" },
    ],
    explanation:
      "The :protected access mode (the default) allows any process to read from the table, but only the owner process can write. :public allows any process to read and write. :private restricts both reads and writes to the owner.",
  },
  {
    question: "What does :ets.insert/2 return on success?",
    options: [
      { label: "{:ok, key}" },
      { label: "The inserted tuple" },
      { label: "true", correct: true },
      { label: ":ok" },
    ],
    explanation:
      ":ets.insert/2 returns true on success. This is an Erlang convention — many ETS operations return true rather than the :ok atom that's common in Elixir. If the operation fails (e.g., writing to a table you don't own), it raises an ArgumentError.",
  },
  {
    question: "How can you atomically update a counter stored in an ETS table?",
    options: [
      { label: "Use :ets.lookup then :ets.insert" },
      { label: "Use :ets.update_counter/3", correct: true },
      { label: "Use :ets.increment/3" },
      { label: "Atomic updates aren't possible with ETS" },
    ],
    explanation:
      ":ets.update_counter/3 atomically increments (or decrements) an integer value in a tuple. This is safe for concurrent access without locks. For example, :ets.update_counter(:my_table, :page_views, 1) atomically increments the counter by 1.",
  },
  {
    question: "What is the first element of a tuple used as in an ETS table by default?",
    options: [
      { label: "The value" },
      { label: "The key", correct: true },
      { label: "The table name" },
      { label: "The row ID" },
    ],
    explanation:
      "By default, the first element (position 1) of each tuple is used as the key. You can change this with the {:keypos, n} option when creating the table. For example, {:keypos, 2} would use the second element as the key.",
  },
  {
    question: "Which of these is NOT a valid ETS table type?",
    options: [
      { label: ":set" },
      { label: ":ordered_set" },
      { label: ":bag" },
      { label: ":sorted_bag", correct: true },
    ],
    explanation:
      "The four valid ETS table types are :set, :ordered_set, :bag, and :duplicate_bag. There is no :sorted_bag type. If you need a bag with ordered keys, you'd need to implement that logic yourself.",
  },
  {
    question: "What does :ets.tab2list/1 do?",
    options: [
      { label: "Converts a list into an ETS table" },
      { label: "Returns all rows in the table as a list", correct: true },
      { label: "Lists all ETS tables on the node" },
      { label: "Returns the table's configuration as a list" },
    ],
    explanation:
      ":ets.tab2list/1 returns all objects in the table as a list. Be careful with large tables — this loads everything into the calling process's memory at once. For large tables, use :ets.foldl/3 or match-based operations instead.",
  },
  {
    question: "When should you prefer ETS over a GenServer for storing state?",
    options: [
      { label: "When you need complex business logic around the data" },
      { label: "When you need transactional guarantees" },
      { label: "When many processes need fast concurrent reads", correct: true },
      { label: "When you need to persist data across node restarts" },
    ],
    explanation:
      "ETS excels when many processes need fast concurrent read access to shared data. A GenServer serializes all access through a single process, creating a bottleneck. ETS allows truly concurrent reads from any process, making it ideal for read-heavy caches and lookup tables.",
  },
  {
    question: "What does the :heir option do when creating an ETS table?",
    options: [
      { label: "Sets which process inherits the table if the owner dies", correct: true },
      { label: "Creates a backup copy of the table" },
      { label: "Sets the table to read-only mode" },
      { label: "Persists the table to disk" },
    ],
    explanation:
      "The :heir option designates a process that will inherit the table if the owner process dies. For example, :ets.new(:cache, [:set, {:heir, supervisor_pid, :cache_data}]). Without an heir, the table is deleted when the owner dies.",
  },
  {
    question: "What is a match specification in ETS?",
    options: [
      { label: "A regex pattern for matching string keys" },
      { label: "A compiled pattern for efficient filtering and transformation of rows", correct: true },
      { label: "A schema definition for table structure" },
      { label: "A way to match table names" },
    ],
    explanation:
      "Match specifications are compiled patterns used with functions like :ets.select/2. They let you filter and transform rows directly in ETS, which is much more efficient than fetching all rows and filtering in Elixir. You can build them manually or use :ets.fun2ms/1 in IEx.",
  },
  {
    question: "What is the time complexity of :ets.lookup/2 on a :set table?",
    options: [
      { label: "O(n)" },
      { label: "O(log n)" },
      { label: "O(1) on average", correct: true },
      { label: "O(n log n)" },
    ],
    explanation:
      "For :set, :bag, and :duplicate_bag tables, :ets.lookup/2 is O(1) on average because they use hash tables internally. For :ordered_set tables, it's O(log n) because they use a balanced tree (a variant of a B-tree).",
  },
  {
    question: "Can you store Elixir structs in an ETS table?",
    options: [
      { label: "No, ETS only stores primitive types" },
      { label: "Yes, but only if you convert them to maps first" },
      { label: "Yes, any Erlang term can be stored in ETS", correct: true },
      { label: "Yes, but only with the :struct option" },
    ],
    explanation:
      "ETS can store any Erlang term, including Elixir structs, maps, lists, and nested data structures. The data is stored as tuples, and any element of the tuple can be any term. For example: :ets.insert(:users, {1, %User{name: \"Alice\"}}).",
  },
];

export default questions;
