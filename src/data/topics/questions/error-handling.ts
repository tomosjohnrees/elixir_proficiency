import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What is the idiomatic way to handle expected errors in Elixir?",
    options: [
      { label: "try/rescue blocks" },
      { label: "Tagged tuples ({:ok, value} / {:error, reason})", correct: true },
      { label: "throw/catch" },
      { label: "Global error handlers" },
    ],
    explanation:
      "Elixir uses tagged tuples as the primary error handling mechanism for expected failures. try/rescue is reserved for truly exceptional situations. Pattern matching on {:ok, _} and {:error, _} is explicit, composable, and keeps control flow clear.",
  },
  {
    question: "What does File.read!/1 do when the file doesn't exist?",
    options: [
      { label: "Returns {:error, :enoent}" },
      { label: "Returns nil" },
      { label: "Raises a File.Error exception", correct: true },
      { label: "Returns an empty string" },
    ],
    explanation:
      "Bang (!) functions raise exceptions instead of returning error tuples. File.read!/1 raises File.Error on failure, while File.read/1 returns {:error, reason}. Use bang functions when failure is unexpected and you want to crash.",
  },
  {
    question: "What happens if a with clause doesn't match?",
    options: [
      { label: "It raises a MatchError" },
      { label: "It retries the clause" },
      { label: "It falls through to the else block or returns the non-matching value", correct: true },
      { label: "It returns nil" },
    ],
    explanation:
      "When a <- clause in with fails to match, execution stops. If there's an else block, the non-matching value is matched against the else clauses. Without an else block, the non-matching value is returned directly.",
  },
  {
    question: "Why is catching all exceptions with rescue _ -> ... considered bad practice?",
    options: [
      { label: "It's a syntax error" },
      { label: "It hides bugs and leaves the process in a potentially corrupt state", correct: true },
      { label: "It's slower than not catching exceptions" },
      { label: "Elixir doesn't support catch-all rescue clauses" },
    ],
    explanation:
      "Catching all exceptions silently hides real bugs. If the process state is corrupted, the error is swallowed and the process continues in an unknown state. It's better to let it crash so the supervisor can restart it cleanly.",
  },
  {
    question: "When should you use throw/catch?",
    options: [
      { label: "For all error handling in recursive functions" },
      { label: "As the primary error handling mechanism" },
      { label: "Almost never — tagged tuples and with handle nearly all cases better", correct: true },
      { label: "Whenever a function might fail" },
    ],
    explanation:
      "throw/catch is a rare escape hatch for situations where you need to break out of a computation and no cleaner option exists. In practice, Enum.find, Enum.reduce_while, or tagged tuples with with cover virtually all real-world cases.",
  },
  {
    question: "What is the key difference between `raise` and `throw` in Elixir?",
    options: [
      { label: "raise is for strings, throw is for atoms" },
      { label: "raise generates exceptions (rescued with rescue), throw generates non-local returns (caught with catch)", correct: true },
      { label: "raise stops the process, throw does not" },
      { label: "There is no difference — they are aliases" },
    ],
    explanation:
      "raise creates exceptions that are caught with try/rescue and are meant for truly exceptional error conditions. throw creates non-local returns caught with try/catch, intended as a rare escape hatch for breaking out of deeply nested computation. They use completely different mechanisms and keywords.",
  },
  {
    question: "What happens when a `with` statement has no `else` clause and a `<-` pattern fails to match?",
    options: [
      { label: "It raises a MatchError" },
      { label: "It returns nil" },
      { label: "It returns the non-matching value as-is", correct: true },
      { label: "It silently continues to the next clause" },
    ],
    explanation:
      "When a with statement lacks an else clause and a <- match fails, the non-matching value is returned directly as the result of the entire with expression. This is useful when your functions already return consistent tagged tuples like {:error, reason}, since those will naturally propagate out.",
  },
  {
    question: "When defining a custom exception with `defexception`, what happens if you don't implement the `message/1` callback?",
    options: [
      { label: "The code won't compile" },
      { label: "A default implementation is provided that returns the :message field value", correct: true },
      { label: "Raising the exception will crash the VM" },
      { label: "The exception will always print \"unknown error\"" },
    ],
    explanation:
      "defexception provides a default message/1 implementation that returns the value of the :message field in the exception struct. You only need to override message/1 when you want to compose a message from multiple fields or provide custom formatting beyond what a simple :message field offers.",
  },
  {
    question: "What is the correct way to re-raise an exception while preserving the original stacktrace?",
    options: [
      { label: "raise e" },
      { label: "throw e" },
      { label: "reraise e, __STACKTRACE__", correct: true },
      { label: "raise __STACKTRACE__, e" },
    ],
    explanation:
      "reraise/2 re-raises an exception with the original stacktrace preserved. Using plain raise inside a rescue block would generate a new stacktrace pointing to the rescue clause itself, losing the information about where the error actually originated. __STACKTRACE__ is a special form available only inside catch/rescue blocks.",
  },
  {
    question: "In the `try` construct, what is the correct order of the optional clauses?",
    options: [
      { label: "rescue -> after -> catch" },
      { label: "catch -> rescue -> after" },
      { label: "rescue -> catch -> after", correct: true },
      { label: "after -> rescue -> catch" },
    ],
    explanation:
      "The correct order in a try block is: the do block first, then rescue (for exceptions), then catch (for thrown values and exits), then after (for cleanup). The after block always runs regardless of whether an exception occurred, similar to finally in other languages. Putting them out of order results in a compilation error.",
  },
  {
    question: "Which of these scenarios is the best candidate for the \"let it crash\" philosophy rather than defensive error handling?",
    options: [
      { label: "Validating user input in a web form" },
      { label: "A GenServer encountering corrupted internal state from an unexpected message", correct: true },
      { label: "A function receiving an optional parameter that might be nil" },
      { label: "Parsing a CSV file uploaded by a user" },
    ],
    explanation:
      "The let-it-crash philosophy is best for unexpected failures that leave a process in an unknown or corrupted state. A supervisor can restart the GenServer with clean state. User input validation and file parsing are expected failure scenarios that should be handled with tagged tuples, since crashing would be a poor user experience.",
  },
  {
    question: "What does `exit(:normal)` do when called inside a process?",
    options: [
      { label: "It raises a RuntimeError" },
      { label: "It terminates the process with a normal exit reason, which linked processes do not treat as a crash", correct: true },
      { label: "It is ignored because :normal is not a valid exit reason" },
      { label: "It sends a message to the supervisor to restart the process" },
    ],
    explanation:
      "exit(:normal) terminates the current process with reason :normal. Linked processes receive an exit signal but do not crash because :normal is treated as a clean shutdown. Only non-normal exit reasons (like :kill or :shutdown or custom atoms) cause linked processes to terminate. Supervisors will not restart a child that exits with :normal under most strategies.",
  },
  {
    question: "What happens when you use `try/rescue` to catch an exit signal like `exit(:boom)`?",
    options: [
      { label: "The rescue clause catches it as an ErlangError" },
      { label: "The rescue clause cannot catch exit signals — you need catch :exit, reason instead", correct: true },
      { label: "The rescue clause catches it as a RuntimeError" },
      { label: "The process terminates before rescue can execute" },
    ],
    explanation:
      "Elixir distinguishes three kinds of non-normal signals: errors (caught with rescue), throws (caught with catch :throw), and exits (caught with catch :exit). rescue only handles exceptions raised with raise. To intercept an exit signal, you must use catch :exit, reason in a try block. This distinction reflects the underlying Erlang error model.",
  },
  {
    question: "Given this code, what is the return value?\n\n```elixir\nwith {:ok, a} <- {:ok, 1},\n     b = a + 10,\n     {:ok, c} <- {:error, :oops} do\n  {:ok, a + b + c}\nelse\n  {:error, reason} -> {:failed, reason}\nend\n```",
    options: [
      { label: "{:ok, 23}" },
      { label: "{:error, :oops}" },
      { label: "{:failed, :oops}", correct: true },
      { label: "A MatchError because b is not a <- match" },
    ],
    explanation:
      "The first clause matches {:ok, 1} and binds a to 1. The bare match b = a + 10 always succeeds (bare = matches in with never trigger the else clause). The third clause fails to match {:error, :oops} against {:ok, c}, so {:error, :oops} falls through to the else block, matching {:error, reason} and returning {:failed, :oops}.",
  },
  {
    question: "Which fields does `defexception` automatically include in the exception struct, even if not listed?",
    options: [
      { label: ":reason and :stacktrace" },
      { label: ":message and :__exception__", correct: true },
      { label: ":type and :code" },
      { label: ":kind and :error" },
    ],
    explanation:
      "All exceptions defined with defexception are structs that automatically include the :__exception__ field (set to true, used internally to identify exception structs) and the :message field (used by the default message/1 implementation). You can override :message by specifying it in your field list or by implementing a custom message/1 callback.",
  },
];

export default questions;
