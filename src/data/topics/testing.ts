import type { TopicContent } from "@/lib/types";

const testing: TopicContent = {
  meta: {
    slug: "testing",
    title: "Testing with ExUnit",
    description: "Unit tests, doctests, and test organization",
    number: 14,
    active: true,
  },

  eli5: {
    analogyTitle: "The Safety Net",
    analogy:
      "Imagine you're a trapeze artist learning a new trick. Before you try it high up in the air, you stretch a safety net below you. The net doesn't stop you from falling — it catches you when you do, so you can get back up and try again without getting hurt. That's what tests are for your code.",
    items: [
      { label: "Test Cases", description: "Each test is one specific check — like asking 'if I do this flip, do I land on my feet?' You describe the situation and what the right outcome should be." },
      { label: "Assertions", description: "The actual 'did it work?' moment. You compare what happened to what you expected. If they match, the test passes. If not, something's wrong." },
      { label: "Setup", description: "Before each test, you might need to prepare the stage — set up equipment, position the net. Setup blocks do this preparation so each test starts from a clean, known state." },
      { label: "Doctests", description: "Some of your practice notes are written right next to the trick instructions. Doctests are examples in your documentation that double as tests — if the example is wrong, you'll know." },
    ],
    keyTakeaways: [
      "ExUnit is Elixir's built-in testing framework — no extra dependencies needed.",
      "Tests go in the test/ directory and files end with _test.exs.",
      "Each test uses the assert macro to check that something is true.",
      "Doctests let you write testable examples directly in your module documentation.",
      "Setup blocks prepare shared state before each test runs.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "Test Module", color: "#6b46c1", examples: ["use ExUnit.Case", "describe", "test"], description: "A test file is a module that uses ExUnit.Case. Tests are organized into describe blocks and individual test blocks." },
      { name: "Assertions", color: "#2563eb", examples: ["assert", "refute", "assert_raise", "assert_receive"], description: "Macros that check whether your code produces the expected results. assert checks for truth, refute checks for falsehood." },
      { name: "Setup", color: "#d97706", examples: ["setup", "setup_all", "on_exit", "context"], description: "Callbacks that run before tests to prepare state. setup runs before each test, setup_all runs once for the whole module." },
      { name: "Doctests", color: "#059669", examples: ["doctest MyModule", "iex>", "...>"], description: "Executable examples in @doc attributes. They serve as both documentation and tests." },
      { name: "Tags & Filters", color: "#e11d48", examples: ["@tag", "@moduletag", "@describetag", "--only", "--exclude"], description: "Metadata you attach to tests for filtering. Run subsets of your test suite by including or excluding tags." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "Your First Test",
        prose: [
          "ExUnit is Elixir's built-in test framework. Every Mix project comes with a test/ directory and a test_helper.exs file that starts ExUnit. Test files must end with _test.exs so Mix can find them.",
          "A test module uses ExUnit.Case and defines tests with the test macro. Each test has a name (a string) and a body that calls assert or refute to verify expectations. If all assertions pass, the test passes.",
        ],
        code: {
          title: "A basic test file",
          code: `# test/calculator_test.exs
defmodule CalculatorTest do
  use ExUnit.Case

  test "addition works" do
    assert 1 + 1 == 2
  end

  test "subtraction works" do
    result = 10 - 3
    assert result == 7
  end

  test "division by zero raises an error" do
    assert_raise ArithmeticError, fn ->
      div(1, 0)
    end
  end
end

# Run with: mix test`,
          output: "3 tests, 0 failures",
        },
      },
      {
        title: "Assertions in Depth",
        prose: [
          "ExUnit provides several assertion macros beyond basic assert. The assert macro checks that an expression is truthy. refute checks that it's falsy. Both give you helpful error messages showing the actual vs expected values when they fail.",
          "assert_raise checks that a specific exception is raised. assert_receive and refute_receive are for testing message-passing between processes — they check whether a message appears in the test process's mailbox within a timeout.",
        ],
        code: {
          title: "Different assertion types",
          code: `test "assert and refute basics" do
  assert 1 + 1 == 2
  assert "hello" =~ "ell"      # regex / string match
  refute 1 + 1 == 3
  refute nil                    # nil is falsy
end

test "pattern matching in assertions" do
  result = {:ok, 42}
  assert {:ok, value} = result
  assert value == 42
end

test "checking exceptions" do
  assert_raise ArgumentError, "argument error", fn ->
    String.to_integer("nope")
  end
end

test "checking process messages" do
  send(self(), {:hello, "world"})
  assert_receive {:hello, name}
  assert name == "world"

  refute_receive {:goodbye, _}, 100  # waits 100ms
end`,
          output: "4 tests, 0 failures",
        },
      },
      {
        title: "Organizing Tests with describe",
        prose: [
          "The describe macro groups related tests together. It takes a string label and a block of tests. This makes your test output easier to read and helps you organize tests by function or behaviour.",
          "You can nest describe blocks, though one level is usually enough. Each describe block can have its own setup callback, which only applies to the tests inside it.",
        ],
        code: {
          title: "Grouping tests with describe",
          code: `defmodule StringHelperTest do
  use ExUnit.Case

  describe "capitalize_words/1" do
    test "capitalizes each word" do
      assert StringHelper.capitalize_words("hello world") ==
               "Hello World"
    end

    test "handles single word" do
      assert StringHelper.capitalize_words("hello") == "Hello"
    end

    test "handles empty string" do
      assert StringHelper.capitalize_words("") == ""
    end
  end

  describe "truncate/2" do
    test "truncates long strings" do
      assert StringHelper.truncate("hello world", 5) == "hello..."
    end

    test "leaves short strings alone" do
      assert StringHelper.truncate("hi", 5) == "hi"
    end
  end
end`,
          output: "5 tests, 0 failures",
        },
      },
      {
        title: "Setup and Context",
        prose: [
          "The setup callback runs before each test in its scope. It receives a context map and can return {:ok, map} to merge additional data into the context. Tests can then access this data through pattern matching on the context argument.",
          "setup_all runs once before all tests in the module and is useful for expensive operations like starting a database connection. Use on_exit/1 inside setup to register cleanup that runs after each test, regardless of whether it passed or failed.",
        ],
        code: {
          title: "Setup callbacks and context",
          code: `defmodule UserTest do
  use ExUnit.Case

  # Runs before EACH test
  setup do
    user = %{name: "Alice", age: 30, role: :admin}
    {:ok, user: user}
  end

  # Tests receive the context as an argument
  test "user has a name", %{user: user} do
    assert user.name == "Alice"
  end

  test "user is an admin", %{user: user} do
    assert user.role == :admin
  end

  describe "with cleanup" do
    setup do
      # Create a temporary file
      path = "test/tmp_#{System.unique_integer()}.txt"
      File.write!(path, "test data")

      # on_exit runs after the test, even if it fails
      on_exit(fn -> File.rm(path) end)

      {:ok, path: path}
    end

    test "file exists", %{path: path} do
      assert File.exists?(path)
    end
  end
end`,
          output: "3 tests, 0 failures",
        },
      },
      {
        title: "Doctests",
        prose: [
          "Doctests are one of Elixir's most loved features. You write examples in your module's @doc attributes using the iex> prompt format, and ExUnit can run them as tests. This means your documentation examples are always verified to be correct.",
          "To enable doctests for a module, add doctest MyModule inside a test module. Multi-line expressions use ...> for continuation lines. The expected output follows on the next line without any prefix.",
        ],
        code: {
          title: "Writing and testing doctests",
          code: `# lib/math_helper.ex
defmodule MathHelper do
  @doc """
  Doubles the given number.

  ## Examples

      iex> MathHelper.double(3)
      6

      iex> MathHelper.double(-1)
      -2

      iex> MathHelper.double(0)
      0

  """
  def double(n), do: n * 2

  @doc """
  Sums a list of numbers.

  ## Examples

      iex> MathHelper.sum([1, 2, 3])
      6

      iex> MathHelper.sum([])
      0

  """
  def sum(list), do: Enum.sum(list)
end

# test/math_helper_test.exs
defmodule MathHelperTest do
  use ExUnit.Case
  doctest MathHelper
end`,
          output: "5 doctests, 0 failures",
        },
      },
      {
        title: "Tags, Filtering, and Async Tests",
        prose: [
          "You can tag tests with metadata using @tag, @describetag, or @moduletag. Then run specific subsets with mix test --only or --exclude. Common uses include tagging slow tests, tests that need external services, or work-in-progress tests.",
          "By default, ExUnit runs test modules sequentially. Adding async: true to use ExUnit.Case lets that module run in parallel with other async modules. Only use this when your tests don't share mutable state like databases or files. Async tests dramatically speed up large test suites.",
        ],
        code: {
          title: "Tags and async tests",
          code: `defmodule ApiTest do
  # Run this module's tests in parallel with others
  use ExUnit.Case, async: true

  # Tag the entire module
  @moduletag :api

  describe "fetching users" do
    # Tag a describe block
    @describetag :users

    test "returns a list" do
      assert is_list(Api.list_users())
    end

    # Tag a single test
    @tag :slow
    test "handles pagination" do
      assert length(Api.list_users(page: 1, per_page: 10)) <= 10
    end
  end

  @tag :skip
  test "not implemented yet" do
    # This test won't run with --exclude skip
    flunk("TODO")
  end
end

# Run only tests tagged :slow
# $ mix test --only slow

# Run everything except :skip
# $ mix test --exclude skip

# Run a specific file and line
# $ mix test test/api_test.exs:15`,
          output: "2 tests, 0 failures, 1 excluded",
        },
      },
    ],
  },

  quiz: {
    questions: [
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
    ],
  },

  practice: {
    problems: [
      {
        title: "Write Your First Tests",
        difficulty: "beginner",
        prompt:
          "Write a test module for a Calculator module that has add/2, subtract/2, and multiply/2 functions. Include at least one test per function, and make sure to test an edge case (like multiplying by zero).",
        hints: [
          { text: "Start with use ExUnit.Case and define tests with the test macro." },
          { text: "Use assert to check that each function returns the expected value." },
          { text: "Group related tests with describe blocks — one per function." },
        ],
        solution: `defmodule CalculatorTest do
  use ExUnit.Case

  describe "add/2" do
    test "adds two positive numbers" do
      assert Calculator.add(2, 3) == 5
    end

    test "adds negative numbers" do
      assert Calculator.add(-1, -2) == -3
    end
  end

  describe "subtract/2" do
    test "subtracts second from first" do
      assert Calculator.subtract(10, 3) == 7
    end

    test "returns negative when second is larger" do
      assert Calculator.subtract(3, 10) == -7
    end
  end

  describe "multiply/2" do
    test "multiplies two numbers" do
      assert Calculator.multiply(4, 5) == 20
    end

    test "multiplying by zero returns zero" do
      assert Calculator.multiply(42, 0) == 0
    end
  end
end`,
        walkthrough: [
          "We use ExUnit.Case to get access to the test, assert, and describe macros.",
          "Each function gets its own describe block, making the output easy to scan.",
          "The test names are descriptive — they explain what behaviour is being verified, not just 'test add'.",
          "We include edge cases like negative numbers and multiplying by zero to catch subtle bugs.",
        ],
      },
      {
        title: "Add Doctests to a Module",
        difficulty: "beginner",
        prompt:
          "Write a module called StringUtils with two functions: shout/1 (uppercases a string and adds '!') and whisper/1 (lowercases and adds '...'). Add @doc attributes with iex> examples, then write a test file that runs the doctests.",
        hints: [
          { text: "Doctest examples start with iex> and the expected output is on the next line." },
          { text: "In the test file, use doctest StringUtils to run all examples as tests." },
          { text: "Make sure the expected output exactly matches what the function returns — including quotes for strings." },
        ],
        solution: `# lib/string_utils.ex
defmodule StringUtils do
  @doc """
  Uppercases a string and adds an exclamation mark.

  ## Examples

      iex> StringUtils.shout("hello")
      "HELLO!"

      iex> StringUtils.shout("elixir is great")
      "ELIXIR IS GREAT!"

  """
  def shout(str), do: String.upcase(str) <> "!"

  @doc """
  Lowercases a string and adds an ellipsis.

  ## Examples

      iex> StringUtils.whisper("HELLO")
      "hello..."

      iex> StringUtils.whisper("")
      "..."

  """
  def whisper(str), do: String.downcase(str) <> "..."
end

# test/string_utils_test.exs
defmodule StringUtilsTest do
  use ExUnit.Case
  doctest StringUtils
end`,
        walkthrough: [
          "Each function has a @doc with ## Examples section containing iex> prompts.",
          "The expected output must match the return value exactly — strings show with quotes because that's how IEx displays them.",
          "doctest StringUtils in the test module automatically extracts all iex> examples and runs them as individual tests.",
          "If you later change shout/1 to add three exclamation marks, the doctest will fail — keeping your docs honest.",
        ],
      },
      {
        title: "Test with Setup and Context",
        difficulty: "intermediate",
        prompt:
          "Write tests for a BankAccount module that has new/1 (creates an account with a balance), deposit/2, withdraw/2, and balance/1. Use a setup block to create a fresh account before each test. Test that withdrawing more than the balance returns {:error, :insufficient_funds}.",
        hints: [
          { text: "The setup block should create an account and return {:ok, account: account}." },
          { text: "Pattern match on %{account: account} in each test to access the setup data." },
          { text: "Use assert for success cases and test the error tuple for the overdraft case." },
        ],
        solution: `defmodule BankAccountTest do
  use ExUnit.Case

  setup do
    account = BankAccount.new(100)
    {:ok, account: account}
  end

  describe "new/1" do
    test "creates an account with the given balance" do
      account = BankAccount.new(50)
      assert BankAccount.balance(account) == 50
    end
  end

  describe "deposit/2" do
    test "increases the balance", %{account: account} do
      account = BankAccount.deposit(account, 50)
      assert BankAccount.balance(account) == 150
    end
  end

  describe "withdraw/2" do
    test "decreases the balance", %{account: account} do
      {:ok, account} = BankAccount.withdraw(account, 30)
      assert BankAccount.balance(account) == 70
    end

    test "rejects overdraft", %{account: account} do
      assert {:error, :insufficient_funds} =
               BankAccount.withdraw(account, 200)
    end
  end

  describe "balance/1" do
    test "returns the current balance", %{account: account} do
      assert BankAccount.balance(account) == 100
    end
  end
end`,
        walkthrough: [
          "The setup block creates a fresh account with a balance of 100 before every test. This ensures tests are independent — one test's deposits don't affect another.",
          "Tests destructure %{account: account} from the context to access the setup data.",
          "The withdraw test uses pattern matching with assert {:ok, account} = ... to both check the shape and bind the updated account.",
          "The overdraft test uses assert with pattern matching to verify the exact error tuple is returned, not just any error.",
        ],
      },
      {
        title: "Test a GenServer",
        difficulty: "advanced",
        prompt:
          "Write tests for a Counter GenServer that supports :increment, :decrement, and :get operations. Start the GenServer in a setup block, use assert_receive or GenServer.call to verify behaviour, and make sure the test module can run async.",
        hints: [
          { text: "Start the GenServer with start_link in setup and return the pid in the context." },
          { text: "Use unique names (or no name) so async tests don't conflict with each other." },
          { text: "GenServer.call/2 for synchronous checks, or send a cast and use :sys.get_state/1 to inspect state." },
        ],
        solution: `defmodule CounterTest do
  use ExUnit.Case, async: true

  setup do
    # Start without a registered name so parallel tests don't conflict
    {:ok, pid} = Counter.start_link(0)
    {:ok, pid: pid}
  end

  describe "increment" do
    test "increases the count by 1", %{pid: pid} do
      assert Counter.increment(pid) == :ok
      assert Counter.get(pid) == 1
    end

    test "can increment multiple times", %{pid: pid} do
      Counter.increment(pid)
      Counter.increment(pid)
      Counter.increment(pid)
      assert Counter.get(pid) == 3
    end
  end

  describe "decrement" do
    test "decreases the count by 1", %{pid: pid} do
      Counter.increment(pid)
      Counter.increment(pid)
      assert Counter.decrement(pid) == :ok
      assert Counter.get(pid) == 1
    end

    test "can go negative", %{pid: pid} do
      Counter.decrement(pid)
      assert Counter.get(pid) == -1
    end
  end

  describe "get" do
    test "returns the initial value", %{pid: pid} do
      assert Counter.get(pid) == 0
    end
  end

  describe "starting with initial value" do
    test "accepts a custom starting count" do
      {:ok, pid} = Counter.start_link(42)
      assert Counter.get(pid) == 42
    end
  end
end`,
        walkthrough: [
          "We use async: true because each test starts its own Counter process with no registered name — there's no shared state to conflict.",
          "The setup starts a fresh Counter at 0 and passes the PID through the context. Each test gets its own independent counter.",
          "We test the public API (increment, decrement, get) rather than reaching into GenServer internals. This makes tests resilient to implementation changes.",
          "The 'can go negative' test verifies an edge case — it's important to document whether your counter allows negative values.",
          "The 'starting with initial value' test creates its own GenServer instead of using setup, since it needs a different starting state.",
        ],
      },
    ],
  },
};

export default testing;
