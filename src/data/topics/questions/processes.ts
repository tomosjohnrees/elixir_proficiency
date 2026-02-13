import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "How much memory does a new Elixir process typically use?",
    options: [
      { label: "About 2 KB", correct: true },
      { label: "About 1 MB" },
      { label: "About 8 MB (like an OS thread)" },
      { label: "It varies based on the function size" },
    ],
    explanation:
      "Elixir processes are extremely lightweight — about 2 KB each. This is why you can run millions of them. They're managed by the BEAM VM's scheduler, not the OS, so they don't have the overhead of OS threads (which typically use 1-8 MB for their stack).",
  },
  {
    question: "What does `send(pid, :hello)` return?",
    options: [
      { label: ":ok" },
      { label: "The message :hello", correct: true },
      { label: "The PID of the receiver" },
      { label: "true if delivered, false otherwise" },
    ],
    explanation:
      "send always returns the message itself — in this case, :hello. It's fire-and-forget: the message is placed in the receiver's mailbox asynchronously. send doesn't tell you whether the process exists or received the message. Even sending to a dead PID succeeds silently.",
  },
  {
    question: "What happens to unmatched messages in a `receive` block?",
    options: [
      { label: "They're discarded" },
      { label: "They cause an error" },
      { label: "They stay in the mailbox for future receives", correct: true },
      { label: "They're sent back to the sender" },
    ],
    explanation:
      "Messages that don't match any pattern in receive stay in the mailbox. They'll be available for future receive calls. This is important to understand — a growing mailbox of unmatched messages can consume memory. Always handle or discard messages you don't need.",
  },
  {
    question: "What's the difference between a link and a monitor?",
    options: [
      { label: "Links are faster than monitors" },
      { label: "Links are bidirectional and crash both; monitors are one-way notifications", correct: true },
      { label: "Links work across nodes; monitors don't" },
      { label: "There is no difference — they're aliases" },
    ],
    explanation:
      "Links are bidirectional: if either linked process dies abnormally, both die. Monitors are one-way: the monitoring process receives a :DOWN message but doesn't crash. Use links for parent-child relationships (supervision), monitors for observation without coupling.",
  },
  {
    question: "How do you prevent a linked process's crash from killing the current process?",
    options: [
      { label: "Use try/rescue around the spawn_link call" },
      { label: "Set Process.flag(:trap_exit, true) before linking", correct: true },
      { label: "Use spawn instead of spawn_link" },
      { label: "You can't — linked processes always crash together" },
    ],
    explanation:
      "Setting Process.flag(:trap_exit, true) converts exit signals from linked processes into {:EXIT, pid, reason} messages instead of propagating the crash. This is exactly how supervisors work — they trap exits from their children and restart them as needed.",
  },
  {
    question: "What happens when you call `send/2` with a PID of a process that has already exited?",
    options: [
      { label: "It raises a :noproc error" },
      { label: "It returns :error" },
      { label: "It silently succeeds and the message is discarded", correct: true },
      { label: "It blocks until a new process claims that PID" },
    ],
    explanation:
      "Sending a message to a dead process does not raise an error — send/2 always returns the message itself, even if the target PID no longer exists. The message is simply discarded. This is by design: send is fire-and-forget, and the caller must use monitors or other mechanisms if delivery confirmation is needed.",
  },
  {
    question: "In a `receive` block with multiple clauses, how does Elixir decide which message to process?",
    options: [
      { label: "It picks the message that arrived most recently (LIFO)" },
      { label: "It scans the mailbox from oldest to newest and picks the first message matching any clause", correct: true },
      { label: "It matches each clause in order against only the newest message" },
      { label: "It randomly selects a matching message for fairness" },
    ],
    explanation:
      "Selective receive scans the mailbox starting from the oldest message. For each message, it tries all clauses in order. The first message (oldest first) that matches any clause is removed from the mailbox and processed. This means older matching messages are always handled before newer ones, but non-matching messages are skipped and remain in the mailbox.",
  },
  {
    question: "What is the key difference between `spawn_link/1` and calling `spawn/1` followed by `Process.link/1`?",
    options: [
      { label: "spawn_link is atomic — the process is linked before it starts running, so no crash can be missed", correct: true },
      { label: "spawn_link is just syntactic sugar — there is no functional difference" },
      { label: "spawn_link creates a unidirectional link, while Process.link creates a bidirectional one" },
      { label: "spawn_link automatically sets trap_exit on the parent process" },
    ],
    explanation:
      "spawn_link/1 atomically spawns and links in a single operation. If you use spawn/1 followed by Process.link/1, there is a tiny window where the new process could crash before the link is established, meaning the parent would never know. spawn_link eliminates this race condition, which is why it's preferred in practice.",
  },
  {
    question: "When a process with `Process.flag(:trap_exit, true)` receives an exit signal from a linked process that exited with reason `:normal`, what happens?",
    options: [
      { label: "Nothing — :normal exits are not delivered even when trapping" },
      { label: "The trapping process receives {:EXIT, pid, :normal}", correct: true },
      { label: "The trapping process also exits with :normal" },
      { label: "It raises a BadArg exception" },
    ],
    explanation:
      "When trapping exits, ALL exit signals are converted to messages, including :normal exits. The process receives {:EXIT, pid, :normal} in its mailbox. Without trap_exit, :normal exits from linked processes are silently ignored, but trap_exit changes the behavior to deliver every signal as a message.",
  },
  {
    question: "What is the process dictionary, and why is its use generally discouraged?",
    options: [
      { label: "A shared global dictionary accessible by all processes — discouraged because of race conditions" },
      { label: "A per-process mutable key-value store accessed via Process.get/put — discouraged because it introduces hidden mutable state", correct: true },
      { label: "An ETS table automatically created for each process — discouraged because of memory overhead" },
      { label: "A registry mapping names to PIDs — discouraged because it doesn't survive restarts" },
    ],
    explanation:
      "The process dictionary is a per-process mutable key-value store accessed via Process.get/1 and Process.put/2. It's discouraged because it breaks the functional programming model by introducing hidden mutable state that doesn't appear in function arguments or return values, making code harder to reason about, test, and debug. It's occasionally used in libraries like Logger for per-process metadata.",
  },
  {
    question: "If a process's mailbox grows very large with unmatched messages, what is the primary consequence?",
    options: [
      { label: "The BEAM automatically drops old messages to prevent overflow" },
      { label: "The process crashes with a :mailbox_overflow error" },
      { label: "Each receive becomes slower because the process must scan through all unmatched messages, and memory usage grows", correct: true },
      { label: "The sender processes are suspended until the mailbox drains" },
    ],
    explanation:
      "The BEAM does not impose a mailbox size limit — unmatched messages accumulate indefinitely. Each receive call scans from the beginning of the mailbox, so performance degrades linearly as unmatched messages pile up. This also consumes increasing amounts of memory. This is a common source of production issues in Elixir systems and why it's important to always handle or discard unexpected messages.",
  },
  {
    question: "What does `Process.exit(pid, :kill)` do, and can it be trapped?",
    options: [
      { label: "It sends a :kill message to the process's mailbox, which can be pattern matched in receive" },
      { label: "It forcefully terminates the process — :kill signals cannot be trapped even with trap_exit", correct: true },
      { label: "It sends an {:EXIT, pid, :kill} signal that can be trapped like any other exit" },
      { label: "It is equivalent to Process.exit(pid, :normal) but with a different label" },
    ],
    explanation:
      "Process.exit(pid, :kill) sends an untrappable exit signal. Even if the target process has set Process.flag(:trap_exit, true), a :kill signal forces immediate termination. This is the 'last resort' mechanism for stopping a process that won't respond to normal exit signals. Linked processes of the killed process receive {:EXIT, pid, :killed} (note: :killed, not :kill).",
  },
  {
    question: "When monitoring a process with `Process.monitor/1`, what message do you receive if the monitored process exits?",
    options: [
      { label: "{:EXIT, pid, reason}" },
      { label: "{:DOWN, ref, :process, pid, reason}", correct: true },
      { label: "{:monitor, :down, pid, reason}" },
      { label: "{:process_exit, pid, reason}" },
    ],
    explanation:
      "Monitors deliver {:DOWN, ref, :process, pid, reason} messages. The ref is the monitor reference returned by Process.monitor/1, which uniquely identifies this specific monitor. This is distinct from link exit signals ({:EXIT, pid, reason}), which only arrive when trap_exit is set. The reference allows you to distinguish between multiple monitors on different processes.",
  },
  {
    question: "Two processes are linked. Process A has `trap_exit: true`, Process B does not. If Process A exits with reason `:shutdown`, what happens to Process B?",
    options: [
      { label: "Process B receives an {:EXIT, pidA, :shutdown} message" },
      { label: "Process B is terminated with the same reason :shutdown", correct: true },
      { label: "Process B is unaffected because :shutdown is treated like :normal" },
      { label: "Process B continues running but the link is removed" },
    ],
    explanation:
      "Since Process B is not trapping exits, the exit signal from Process A propagates and terminates Process B with reason :shutdown. Only :normal exits are silently ignored by non-trapping linked processes. The :shutdown reason (and any other non-normal reason) causes linked processes to terminate unless they are trapping exits. This is why :shutdown is used by supervisors — it's a recognized 'clean exit' that still propagates through links.",
  },
  {
    question: "Which statement about BEAM process scheduling is true?",
    options: [
      { label: "Each BEAM process runs on its own dedicated OS thread" },
      { label: "Processes are cooperatively scheduled — a process must yield manually" },
      { label: "The BEAM uses preemptive scheduling based on reduction counts, ensuring fair CPU time across processes", correct: true },
      { label: "Process priority cannot be configured — all processes get equal time" },
    ],
    explanation:
      "The BEAM uses preemptive scheduling based on reductions (roughly one reduction per function call). After a process consumes its reduction budget (typically around 4000), it's preempted and another process gets to run. This ensures no single process can monopolize the scheduler. Process priority can be configured with Process.flag(:priority, level) using :low, :normal, :high, or :max, though this is rarely needed in practice.",
  },
];

export default questions;
