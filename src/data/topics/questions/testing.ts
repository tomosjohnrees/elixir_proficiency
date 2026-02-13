import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What file extension must ExUnit test files use?",
    options: [
      { label: ".ex" },
      { label: ".exs", correct: true },
      { label: ".test.ex" },
      { label: ".spec.exs" },
    ],
    explanation:
      "Test files must end with _test.exs. The .exs extension means they're Elixir script files — compiled and run on the fly, not compiled to .beam files. Mix looks for files matching test/**/*_test.exs.",
  },
  {
    question: "What does refute do?",
    options: [
      { label: "Raises an exception" },
      { label: "Skips the test" },
      { label: "Asserts that an expression is falsy (nil or false)", correct: true },
      { label: "Asserts that an expression raises an error" },
    ],
    explanation:
      "refute is the opposite of assert — it passes when the expression evaluates to nil or false. Use it when you want to verify that something does NOT hold true.",
  },
  {
    question: "What happens if you use async: true on a test module that writes to a shared database?",
    options: [
      { label: "Tests automatically use transactions for isolation" },
      { label: "Tests may interfere with each other due to shared mutable state", correct: true },
      { label: "ExUnit prevents this with a compile-time error" },
      { label: "The database is automatically reset between tests" },
    ],
    explanation:
      "async: true means the module runs in parallel with other async modules. If multiple modules write to the same database without isolation (like Ecto's SQL sandbox), they can interfere with each other causing flaky, unpredictable test failures.",
  },
  {
    question: "Where does ExUnit look for doctest examples?",
    options: [
      { label: "In @moduledoc and @doc attributes", correct: true },
      { label: "In comments starting with #" },
      { label: "In separate .doctest files" },
      { label: "In the test/ directory only" },
    ],
    explanation:
      "Doctests are extracted from @moduledoc and @doc attributes. Lines starting with iex> are treated as input, and the following line is the expected output. You enable them by adding doctest MyModule in a test file.",
  },
  {
    question: "What does the setup callback return to pass data to tests?",
    options: [
      { label: ":ok or {:ok, keyword_or_map}", correct: true },
      { label: "A tuple {:setup, data}" },
      { label: "The data directly without wrapping" },
      { label: "A %Context{} struct" },
    ],
    explanation:
      "The setup callback returns :ok (if no extra context is needed) or {:ok, keyword_or_map} to merge data into the test context. Tests then pattern match on the context argument to access the setup data.",
  },
  {
    question:
      "What is the key difference between setup and setup_all in ExUnit?",
    options: [
      { label: "setup is for unit tests, setup_all is for integration tests" },
      {
        label:
          "setup runs before each individual test, setup_all runs once before all tests in the module",
        correct: true,
      },
      { label: "setup_all can return context data but setup cannot" },
      { label: "setup_all runs asynchronously while setup runs synchronously" },
    ],
    explanation:
      "setup runs its callback before every single test, providing fresh state each time. setup_all runs only once before all tests in the module (or describe block), which is useful for expensive operations like starting external services. Because setup_all state is shared, you must be careful not to mutate it across tests.",
  },
  {
    question:
      "Which assertion would you use to verify that a message was NOT sent to the current process within a timeout?",
    options: [
      { label: "assert_not_received" },
      { label: "refute_receive", correct: true },
      { label: "refute_message" },
      { label: "assert_no_message" },
    ],
    explanation:
      "refute_receive checks that a matching message does NOT appear in the process mailbox within the given timeout (default 100ms). It is the counterpart to assert_receive and is essential for testing that side-effect messages are not sent under certain conditions.",
  },
  {
    question:
      "When using Mox, what is the difference between expect/3 and stub/3?",
    options: [
      { label: "expect is for synchronous calls, stub is for asynchronous calls" },
      {
        label:
          "expect verifies the mock was called the specified number of times, stub allows any number of calls without verification",
        correct: true,
      },
      { label: "stub raises on unexpected arguments, expect does not" },
      { label: "They are aliases for the same function" },
    ],
    explanation:
      "Mox.expect/3 sets an expectation that a function will be called exactly N times (default 1), and the test fails if the expectation is not met by the end. Mox.stub/3 provides a default implementation that can be called any number of times without verification. This distinction matters because expect enforces that your code actually calls the dependency.",
  },
  {
    question:
      "What happens when you use async: true with Mox expectations in their default (global) mode?",
    options: [
      {
        label:
          "Expectations may leak between tests because global mode shares mock state across all processes",
        correct: true,
      },
      { label: "Mox automatically switches to private mode for async tests" },
      { label: "ExUnit raises a compile-time warning but tests still pass" },
      { label: "Async mode is ignored when Mox is in use" },
    ],
    explanation:
      "In Mox's global mode, mock expectations are stored in a single shared state, so concurrent async tests can interfere with each other's expectations. To safely use Mox with async: true, you should call Mox.verify_on_exit!(context) in a setup block and use allowances or set_mox_from_context, which puts Mox into private (per-process) mode tied to the calling test process.",
  },
  {
    question:
      "Which of the following is a limitation of Elixir doctests?",
    options: [
      { label: "They cannot test functions that return strings" },
      {
        label:
          "They cannot reliably test expressions that return maps, because map key ordering is not guaranteed",
        correct: true,
      },
      { label: "They can only test public functions with zero arguments" },
      { label: "They are not run when using mix test --cover" },
    ],
    explanation:
      "Maps in Elixir do not have a guaranteed key order, so a doctest expecting %{a: 1, b: 2} may fail if the map prints as %{b: 2, a: 1}. The workaround is to use pattern matching or to test maps by converting them to sorted keyword lists. Doctests also struggle with opaque types and multi-line outputs that depend on runtime formatting.",
  },
  {
    question:
      "In property-based testing with StreamData, what does the check all macro do?",
    options: [
      { label: "It runs the test once with every possible input in the type's domain" },
      {
        label:
          "It generates many random inputs from a generator and asserts that a property holds for all of them",
        correct: true,
      },
      { label: "It exhaustively checks all branches in the function under test" },
      { label: "It validates that all type specifications in the module are correct" },
    ],
    explanation:
      "check all takes one or more StreamData generators and runs the test body many times (100 by default) with randomly generated inputs. If a failure is found, StreamData automatically shrinks the input to find the smallest failing case. This approach finds edge cases that hand-written examples often miss.",
  },
  {
    question:
      "What does ExUnit.CaptureLog.capture_log/1 return?",
    options: [
      { label: "A list of log event tuples" },
      { label: "A string containing all log output produced during the function's execution", correct: true },
      { label: "A boolean indicating whether any logs were emitted" },
      { label: "A map with log levels as keys and message lists as values" },
    ],
    explanation:
      "capture_log/1 takes a zero-arity function, executes it, and returns a string of all Logger output generated during that execution. This lets you assert on log messages without them cluttering test output. It's commonly used with =~ for partial string matching on the captured log content.",
  },
  {
    question:
      "How do you register a cleanup function that runs after each test, even if the test fails?",
    options: [
      { label: "Use the teardown callback" },
      { label: "Call on_exit/1 inside a setup block", correct: true },
      { label: "Add a finally block at the end of the test" },
      { label: "Implement the cleanup/1 behaviour callback" },
    ],
    explanation:
      "on_exit/1 registers a callback that will run after the current test completes, regardless of whether the test passed or failed. It is typically called inside a setup block. Unlike some other test frameworks, ExUnit does not have a separate teardown callback — on_exit is the idiomatic way to clean up resources like temporary files, spawned processes, or database records.",
  },
  {
    question:
      "When a test module has both a module-level setup and a setup inside a describe block, in what order do they run?",
    options: [
      { label: "Only the describe-level setup runs, overriding the module-level setup" },
      {
        label:
          "The module-level setup runs first, then the describe-level setup, and their contexts are merged",
        correct: true,
      },
      { label: "The describe-level setup runs first, then the module-level setup" },
      { label: "ExUnit raises an error because you cannot have two setup blocks" },
    ],
    explanation:
      "ExUnit runs setup callbacks from outermost to innermost scope. The module-level setup runs first, and its returned context is available to the describe-level setup, which can add to or override values. The final merged context is passed to the test. This composability lets you build up test state in layers.",
  },
  {
    question:
      "What is the purpose of the @tag :capture_log annotation on a test?",
    options: [
      { label: "It saves all log output to a file for later inspection" },
      {
        label:
          "It silences log output for that test so warnings and errors don't pollute the test output",
        correct: true,
      },
      { label: "It enables verbose logging for debugging purposes" },
      { label: "It captures logs and adds them to the test context as a string" },
    ],
    explanation:
      "When you add @tag :capture_log (or set capture_log: true in ExUnit.configure), ExUnit captures all Logger output during that test and suppresses it from the console. This keeps your test output clean when testing code that intentionally logs warnings or errors. The captured output is discarded unless you explicitly use CaptureLog to inspect it.",
  },
  {
    question: "How do you run only tests with a specific tag, like `@tag :slow`?",
    options: [
      { label: "mix test --tag slow", correct: true },
      { label: "mix test --filter slow" },
      { label: "mix test --only @slow" },
      { label: "Tags are for documentation only — they can't filter tests" },
    ],
    explanation:
      "Tags are a powerful test filtering mechanism. You can include tests with --include tag_name, exclude with --exclude tag_name, and run only tagged tests with --only tag_name. For example, `mix test --only slow` runs only @tag :slow tests. By default, ExUnit excludes no tags. You can also configure default exclusions in test_helper.exs with ExUnit.configure(exclude: [:slow]) to skip slow tests by default and only run them on demand.",
  },
  {
    question: "What does `assert_receive :message, 1000` do in an ExUnit test?",
    options: [
      { label: "Sends :message to the test process and asserts it was delivered" },
      { label: "Waits up to 1000ms for :message to appear in the test process's mailbox, failing if it doesn't arrive", correct: true },
      { label: "Asserts that exactly 1000 messages are in the mailbox" },
      { label: "Asserts that :message was received by any process in the last 1000ms" },
    ],
    explanation:
      "assert_receive waits for a message matching the given pattern to arrive in the test process's mailbox within the timeout (default 100ms). It's essential for testing asynchronous code: spawn a process that should send a message, then assert_receive to verify it arrived. If the message doesn't arrive within the timeout, the test fails with a clear error showing what was expected and what was actually in the mailbox.",
  },
];

export default questions;
