import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Restart Intensity Defaults Can Cause Rapid Restart Loops",
    description:
      "The default restart intensity is 3 restarts within 5 seconds. If a child crashes on startup (e.g., database not available), the supervisor will restart it 3 times in quick succession, then terminate itself. This cascading failure can take down your entire application. Tune max_restarts and max_seconds based on your use case.",
    code: `# Default: 3 restarts in 5 seconds, then supervisor dies
children = [MyWorker]
Supervisor.start_link(children, strategy: :one_for_one)

# Customized: allow more breathing room
Supervisor.start_link(children,
  strategy: :one_for_one,
  max_restarts: 10,
  max_seconds: 60
)`,
  },
  {
    title: ":transient Only Restarts on Abnormal Exit",
    description:
      "A child with restart: :transient is only restarted if it exits abnormally (i.e., with a reason other than :normal or :shutdown). If the process exits with :normal, the supervisor does not restart it. This is useful for one-off tasks, but can be confusing if your process exits :normal when you expected it to keep running.",
    code: `# This child will NOT be restarted if it exits :normal
children = [
  %{
    id: MyWorker,
    start: {MyWorker, :start_link, [[]]},
    restart: :transient
  }
]

# :permanent (default) — always restart
# :transient — restart only on abnormal exit
# :temporary — never restart`,
  },
  {
    title: ":one_for_all Restarts ALL Children",
    description:
      "With the :one_for_all strategy, if any single child crashes, the supervisor terminates and restarts every child. This is correct when children are tightly coupled and can't function without each other, but it's overkill for independent workers. Using it by mistake causes unnecessary restarts and potential data loss.",
    code: `# If WorkerC crashes, WorkerA and WorkerB are also
# terminated and restarted
children = [WorkerA, WorkerB, WorkerC]
Supervisor.start_link(children, strategy: :one_for_all)

# Use :one_for_one if children are independent
Supervisor.start_link(children, strategy: :one_for_one)

# Use :rest_for_one if later children depend on earlier ones
Supervisor.start_link(children, strategy: :rest_for_one)`,
  },
  {
    title: "Supervisor Child Order Matters for Dependencies",
    description:
      "Supervisors start children in the order they are listed and shut them down in reverse order. If WorkerB depends on WorkerA, WorkerA must be listed first. With :rest_for_one, a crash in WorkerA restarts WorkerA and everything after it — but not anything before it. Getting the order wrong leads to startup failures or dependency errors.",
    code: `# CORRECT: Database starts before the cache that uses it
children = [
  {Database, []},       # starts first, stops last
  {Cache, []},          # starts second, depends on Database
  {WebEndpoint, []}     # starts last, depends on both
]
Supervisor.start_link(children, strategy: :rest_for_one)

# WRONG: Cache starts before its dependency
children = [
  {Cache, []},          # starts first but needs Database!
  {Database, []},
  {WebEndpoint, []}
]`,
  },
];

export default gotchas;
