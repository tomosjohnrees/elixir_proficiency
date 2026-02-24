import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What does \"let it crash\" mean in Elixir?",
    options: [
      { label: "Don't write any error handling code" },
      { label: "Write happy-path code and let supervisors handle unexpected failures", correct: true },
      { label: "Intentionally crash your application to test resilience" },
      { label: "Catch all errors and log them" },
    ],
    explanation:
      "\"Let it crash\" doesn't mean ignore errors. You still handle expected cases (invalid input, missing files). But for unexpected failures — bugs, network issues, corrupted state — you let the process crash and trust the supervisor to restart it in a clean state. This is simpler and more reliable than trying to recover from every possible error inline.",
  },
  {
    question: "Which restart strategy restarts ALL children when any one crashes?",
    options: [
      { label: ":one_for_one" },
      { label: ":one_for_all", correct: true },
      { label: ":rest_for_one" },
      { label: ":all_for_one" },
    ],
    explanation:
      ":one_for_all terminates and restarts every child when any single child crashes. Use it when children are tightly coupled and would be in an inconsistent state if only one restarted. Note: :all_for_one doesn't exist — it's :one_for_all.",
  },
  {
    question: "What happens when a child crashes more than max_restarts times in max_seconds?",
    options: [
      { label: "The child is permanently stopped" },
      { label: "The supervisor itself shuts down", correct: true },
      { label: "The supervisor ignores further crashes" },
      { label: "The application crashes" },
    ],
    explanation:
      "If a child exceeds the crash threshold (default: 3 times in 5 seconds), the supervisor considers it unrecoverable and shuts itself down. If this supervisor has a parent supervisor, that parent will then handle the restart at a higher level. This prevents infinite crash-restart loops.",
  },
  {
    question: "What does the :transient restart option mean?",
    options: [
      { label: "Always restart the child" },
      { label: "Never restart the child" },
      { label: "Restart only on abnormal exit, not on normal exit", correct: true },
      { label: "Restart after a random delay" },
    ],
    explanation:
      ":transient means the child is only restarted if it exits abnormally (crashes). If it exits with reason :normal or :shutdown, it stays down. This is ideal for one-off tasks that should be retried on failure but not re-run after successful completion.",
  },
  {
    question: "What is a supervision tree?",
    options: [
      { label: "A data structure for storing process PIDs" },
      { label: "A hierarchy where supervisors supervise other supervisors and workers", correct: true },
      { label: "A binary tree used for load balancing" },
      { label: "A visualization tool for debugging" },
    ],
    explanation:
      "A supervision tree is a hierarchical structure where supervisors can supervise both workers and other supervisors. Each level handles failures it can, escalating to the parent if it can't cope. This is the backbone of fault-tolerance in OTP applications.",
  },
  {
    question: "Which restart option should you use for a GenServer that runs a one-time data migration and should not be restarted after it completes successfully?",
    options: [
      { label: ":permanent" },
      { label: ":temporary" },
      { label: ":transient", correct: true },
      { label: ":one_for_one" },
    ],
    explanation:
      ":transient is the correct choice because it only restarts the child on abnormal exit (crashes), not on normal exit. A data migration that finishes successfully exits with :normal, so it won't be restarted. :temporary would also not restart it, but :temporary never restarts even on crashes, which means you'd lose automatic retry if the migration fails partway through.",
  },
  {
    question: "You have three children under a supervisor: A (database connection), B (cache that depends on A), and C (API server that depends on B). Which strategy ensures that if B crashes, both B and C are restarted but A keeps running?",
    options: [
      { label: ":one_for_one" },
      { label: ":one_for_all" },
      { label: ":rest_for_one", correct: true },
      { label: ":simple_one_for_one" },
    ],
    explanation:
      ":rest_for_one restarts the crashed child and all children started after it in the child list. Since children are started in order (A, B, C), if B crashes, B and C are restarted while A keeps running. This perfectly models a sequential dependency chain. :one_for_one would only restart B, leaving C connected to a stale cache. :one_for_all would unnecessarily restart A.",
  },
  {
    question: "What is the default max_restarts and max_seconds configuration for a Supervisor?",
    options: [
      { label: "1 restart in 10 seconds" },
      { label: "3 restarts in 5 seconds", correct: true },
      { label: "5 restarts in 10 seconds" },
      { label: "10 restarts in 60 seconds" },
    ],
    explanation:
      "The default crash intensity is 3 restarts within 5 seconds. If a child process crashes more than 3 times in a 5-second window, the supervisor considers it unrecoverable and shuts itself down. You can tune these values based on your use case — a network-dependent service might need a higher threshold to ride out brief connectivity issues.",
  },
  {
    question: "When should you use DynamicSupervisor instead of a regular Supervisor?",
    options: [
      { label: "When you need the :one_for_all strategy" },
      { label: "When child processes need to be started and stopped at runtime on demand", correct: true },
      { label: "When you have more than 10 child processes" },
      { label: "When children need different restart strategies" },
    ],
    explanation:
      "DynamicSupervisor is designed for cases where children are started dynamically at runtime — for example, one process per connected user or per uploaded file. Regular Supervisor declares its children upfront in init/1. DynamicSupervisor starts with no children and you add them with DynamicSupervisor.start_child/2. It only supports the :one_for_one strategy.",
  },
  {
    question: "A supervisor with strategy :one_for_one has children [A, B, C]. Child C crashes 4 times in 3 seconds with the default max_restarts/max_seconds settings. What happens?",
    options: [
      { label: "Only C is permanently stopped; A and B keep running" },
      { label: "The supervisor shuts down, terminating A, B, and C", correct: true },
      { label: "C is restarted a 4th time and the failure count resets" },
      { label: "The supervisor logs a warning but continues operating" },
    ],
    explanation:
      "The default max_restarts is 3 in 5 seconds. After the 4th crash within 3 seconds, the threshold is exceeded and the supervisor itself shuts down, taking all its children (A, B, and C) with it. If this supervisor has a parent supervisor, that parent will then attempt to restart it. This cascading behavior prevents infinite crash loops from consuming resources.",
  },
  {
    question: "What is the purpose of the :shutdown option in a child specification?",
    options: [
      { label: "It determines how long the supervisor waits for the child to terminate gracefully before forcefully killing it", correct: true },
      { label: "It specifies whether the child should be started automatically" },
      { label: "It sets the order in which children are shut down" },
      { label: "It controls whether the child can be restarted" },
    ],
    explanation:
      "The :shutdown option specifies how many milliseconds the supervisor waits for a child to terminate after sending it a shutdown signal. The default is 5000ms for workers. If the child doesn't stop in time, it's forcefully killed. You can also set it to :brutal_kill for immediate termination or :infinity for supervisors that need time to shut down their own children.",
  },
  {
    question: "You're building a chat application where each connected user gets their own process. Which supervision approach is most appropriate?",
    options: [
      { label: "A regular Supervisor with :one_for_all strategy" },
      { label: "A DynamicSupervisor with :one_for_one strategy", correct: true },
      { label: "A regular Supervisor with :rest_for_one strategy" },
      { label: "No supervisor needed — just spawn processes directly" },
    ],
    explanation:
      "DynamicSupervisor is ideal here because user processes come and go at runtime as users connect and disconnect. You can't declare them upfront in a static child list. DynamicSupervisor.start_child/2 lets you add a new process for each connection, and when a user's process crashes, only that one is restarted (one_for_one). Spawning without supervision would mean crashed user processes are lost silently.",
  },
  {
    question: "In a supervision tree, what happens when a child supervisor exceeds its max_restarts threshold?",
    options: [
      { label: "It keeps running but stops restarting its children" },
      { label: "It shuts down and its parent supervisor handles the failure according to the parent's strategy", correct: true },
      { label: "The entire application terminates immediately" },
      { label: "It resets its restart counter and continues" },
    ],
    explanation:
      "When a child supervisor exceeds its max_restarts, it shuts itself down with an abnormal exit. Its parent supervisor then treats this like any other child crash and applies its own strategy — restarting just that sub-tree (one_for_one), all children (one_for_all), or the crashed one and later children (rest_for_one). This cascading recovery is how supervision trees provide layered fault tolerance.",
  },
  {
    question: "Why is the order of children in a Supervisor's child list significant?",
    options: [
      { label: "It only affects logging output" },
      { label: "Children are started in order and shut down in reverse order, which matters for dependencies", correct: true },
      { label: "The first child always gets priority for CPU time" },
      { label: "It determines which child the supervisor monitors most closely" },
    ],
    explanation:
      "Supervisors start children top-to-bottom and shut them down bottom-to-top (reverse order). This is critical for dependencies: if a cache depends on a database connection, the database should be listed first so it starts before the cache and shuts down after it. This ordering also affects :rest_for_one strategy behavior, where only children listed after the crashed child are restarted.",
  },
  {
    question: "A supervisor has max_restarts: 5 and max_seconds: 30. Child A crashes at t=0, t=10, t=20, t=25, and t=29. What happens on the 5th crash?",
    options: [
      { label: "The supervisor shuts down because 5 crashes have occurred" },
      { label: "Child A is restarted normally because only 4 crashes fall within the 30-second window at the time of the 5th crash" },
      { label: "The supervisor shuts down because there have been 5 crashes within 30 seconds", correct: true },
      { label: "The crash counter resets after 30 seconds from the first crash" },
    ],
    explanation:
      "The max_restarts/max_seconds threshold uses a sliding window. At t=29 when the 5th crash occurs, all 5 crashes (at t=0, t=10, t=20, t=25, t=29) fall within the 30-second window. Since 5 restarts have been attempted within 30 seconds and the limit is 5, the supervisor determines the child is unrecoverable and shuts itself down. The window slides forward in time — it doesn't reset from the first crash.",
  },
  {
    question: "What is `child_spec/1` and why is it important?",
    options: [
      { label: "A function that returns the module's supervision configuration — it tells the supervisor how to start, restart, and shut down the child", correct: true },
      { label: "A compile-time macro that validates supervisor configuration" },
      { label: "A callback that the supervisor calls on each restart to reinitialize state" },
      { label: "A debugging tool that prints the child process specification" },
    ],
    explanation:
      "child_spec/1 returns a map with keys like :id, :start, :restart, :shutdown, and :type that tells the supervisor everything it needs to know about managing the child. When you write `use GenServer`, a default child_spec/1 is generated automatically. You can override it to customize restart behavior, shutdown timeout, and other options. When adding children to a supervisor, you typically pass the module name, and the supervisor calls Module.child_spec(arg) to get the specification.",
  },
  {
    question: "What is the difference between `:temporary`, `:transient`, and `:permanent` restart strategies?",
    options: [
      { label: ":temporary never restarts; :transient restarts on abnormal exit; :permanent always restarts", correct: true },
      { label: "They control how quickly the child is restarted: immediately, after a delay, or never" },
      { label: ":temporary and :transient are the same; :permanent adds persistence to disk" },
      { label: ":temporary restarts once; :transient restarts 3 times; :permanent restarts indefinitely" },
    ],
    explanation:
      ":permanent (the default) restarts the child no matter how it exits — even with :normal. :transient only restarts on abnormal exit (crashes), leaving the child down after :normal or :shutdown exits. :temporary never restarts the child regardless of the exit reason. Choose based on the child's nature: long-running services are :permanent, one-off tasks that should retry on failure are :transient, and fire-and-forget tasks are :temporary.",
  },
  {
    question: "What does `Supervisor.which_children/1` return?",
    options: [
      { label: "A list of PIDs of all children" },
      { label: "A list of tuples containing each child's id, pid (or :restarting/:undefined), type, and modules", correct: true },
      { label: "A map from child names to their current states" },
      { label: "The count of running vs crashed children" },
    ],
    explanation:
      "Supervisor.which_children/1 returns a list of {id, child, type, modules} tuples for each child. The child element is the PID if the process is running, :restarting if it's being restarted, or :undefined if it's not started. This is the primary introspection tool for understanding what a supervisor is managing at runtime, useful for debugging and monitoring.",
  },
  {
    question: "You write `children = [{MyGenServer, arg}]` in a supervisor's init/1. How does the supervisor know how to start MyGenServer?",
    options: [
      { label: "It calls MyGenServer.start_link(arg) directly" },
      { label: "It calls MyGenServer.child_spec(arg) to get the full specification, which includes the start function", correct: true },
      { label: "It looks up MyGenServer in the application config" },
      { label: "It pattern matches on the module name to determine the start strategy" },
    ],
    explanation:
      "When you pass {MyGenServer, arg} as a child, the supervisor calls MyGenServer.child_spec(arg) to get a map like %{id: MyGenServer, start: {MyGenServer, :start_link, [arg]}, ...}. The :start key tells the supervisor exactly which function to call. This is why `use GenServer` defines a default child_spec/1 — without it, the supervisor wouldn't know how to start your module.",
  },
  {
    question: "What happens if a `:permanent` child's `init/1` returns `:ignore`?",
    options: [
      { label: "The supervisor crashes because a permanent child must start successfully" },
      { label: "The child is recorded but has no running process — the supervisor does not attempt to restart it", correct: true },
      { label: "The supervisor retries init/1 up to max_restarts times" },
      { label: "The child is removed from the supervisor's children list" },
    ],
    explanation:
      "When init/1 returns :ignore, start_link returns :ignore and no process is created. The supervisor records the child with pid :undefined but does not treat this as a failure — it won't attempt restarts. This is useful for children that conditionally decide not to start (e.g., a feature is disabled via config). The child specification remains in the supervisor, so it can be restarted later with Supervisor.restart_child/2 if needed.",
  },
];

export default questions;
