import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "ETS Tables Are Owned by the Creating Process",
    description:
      "When a process creates an ETS table, it becomes the table's owner. If that process dies, the table is automatically deleted and all data is lost. This is a common source of data loss in production — if you create a table in a short-lived process or a process that might crash, the table disappears with it. Always create ETS tables in a supervised process (like a GenServer) or use the heir option.",
    code: `# Dangerous: table created in a temporary process
spawn(fn ->
  :ets.new(:cache, [:named_table, :public])
  :ets.insert(:cache, {:key, "value"})
  # Process exits here — table is destroyed!
end)

Process.sleep(100)
:ets.lookup(:cache, :key)
#=> ** (ArgumentError) table :cache does not exist

# Safe: create in a supervised GenServer
defmodule CacheServer do
  use GenServer

  def init(_) do
    table = :ets.new(:cache, [:named_table, :public])
    {:ok, table}
  end
end

# Or use the :heir option to transfer ownership on death
:ets.new(:cache, [:named_table, {:heir, survivor_pid, :gift}])`,
  },
  {
    title: "Default Table Type Is :set — Only One Value per Key",
    description:
      "If you don't specify a table type, ETS defaults to :set, which stores only one row per key. Inserting a new row with an existing key silently overwrites the old one without warning. If you need multiple values per key, use :bag (allows duplicate keys, unique rows) or :duplicate_bag (allows fully duplicate rows).",
    code: `table = :ets.new(:demo, [:set])

:ets.insert(table, {:user, "Alice"})
:ets.insert(table, {:user, "Bob"})

:ets.lookup(table, :user)
#=> [{:user, "Bob"}]  — Alice is silently gone!

# Use :bag to keep multiple values per key
table = :ets.new(:demo, [:bag])

:ets.insert(table, {:user, "Alice"})
:ets.insert(table, {:user, "Bob"})

:ets.lookup(table, :user)
#=> [{:user, "Alice"}, {:user, "Bob"}]`,
  },
  {
    title: ":public Tables Allow Any Process to Read and Write",
    description:
      "ETS tables with the :public access mode let any process on the node read from and write to the table — there is no access control. This is convenient but can lead to hard-to-debug issues where unexpected processes modify your data. Use :protected (the default) for owner-writes/all-read, or :private to restrict access to the owning process only.",
    code: `# :public — any process can read AND write
:ets.new(:shared, [:named_table, :public])

# Any random process can corrupt your data
spawn(fn ->
  :ets.delete_all_objects(:shared)  # Oops!
end)

# :protected (default) — owner writes, all read
:ets.new(:safer, [:named_table, :protected])

# Other processes can read but not write:
spawn(fn ->
  :ets.lookup(:safer, :key)   # OK
  :ets.insert(:safer, {:key, "val"})  # ** (ArgumentError)
end)

# :private — only the owning process can access
:ets.new(:locked, [:named_table, :private])`,
  },
  {
    title: "ETS Is Not Persisted to Disk",
    description:
      "ETS tables exist purely in memory. When the BEAM VM shuts down or the owning process dies, all ETS data is gone. If you need persistence, use DETS (disk-based ETS) for simple cases, :persistent_term for read-heavy configuration that survives process crashes (but not VM restarts), or an actual database for durable storage.",
    code: `# ETS — in-memory only, lost on restart
:ets.new(:cache, [:named_table, :public])
:ets.insert(:cache, {:key, "value"})
# If the VM restarts, this data is gone

# DETS — persisted to disk, but slower
{:ok, table} = :dets.open_file(:disk_cache, [type: :set])
:dets.insert(table, {:key, "value"})
:dets.close(table)
# Data survives VM restarts

# :persistent_term — optimized for read-heavy data
:persistent_term.put(:app_config, %{feature_flag: true})
:persistent_term.get(:app_config)
#=> %{feature_flag: true}
# Survives process crashes but NOT VM restarts
# Warning: updates are expensive (triggers GC on all processes)`,
  },
];

export default gotchas;
