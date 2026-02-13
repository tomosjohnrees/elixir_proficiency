import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Async Tests Can Interfere with Shared State",
    description:
      "Setting async: true runs tests concurrently, which is faster but dangerous when tests share mutable state like a database, application config, or file system. Ecto's SQL Sandbox handles database isolation, but only with the Sandbox adapter. For any other shared state, use async: false or you'll get flaky, order-dependent test failures.",
    code: `# SAFE: tests with no shared state
defmodule PureFunctionTest do
  use ExUnit.Case, async: true

  test "adds numbers" do
    assert 1 + 1 == 2
  end
end

# CAREFUL: database tests need sandbox checkout
defmodule UserTest do
  use MyApp.DataCase, async: true  # DataCase sets up sandbox

  test "creates a user" do
    # Each async test gets its own DB transaction
    assert {:ok, _} = Accounts.create_user(%{name: "Alice"})
  end
end

# UNSAFE: tests that modify global config
defmodule ConfigTest do
  use ExUnit.Case, async: false  # must be synchronous!

  test "feature flag" do
    Application.put_env(:my_app, :flag, true)
    assert MyApp.flag_enabled?()
  end
end`,
  },
  {
    title: "Assertions Are Macros, Not Composable Functions",
    description:
      "ExUnit assertions like assert, refute, and assert_raise are macros that provide rich failure messages by inspecting the AST. However, you can't easily pass them to higher-order functions or compose them. If you try to extract assertion logic into a helper, you lose the detailed diff output unless you use assert with a match expression.",
    code: `# Great error messages from the macro:
assert %{name: "Alice"} = result
# Failure shows a detailed diff of expected vs actual

# This helper LOSES the helpful error context:
defp assert_valid(result) do
  assert result.valid?  # just shows "false is not truthy"
end

# Better: use pattern matching in assert for diffs
defp assert_user(result, expected_name) do
  assert %{name: ^expected_name} = result
end`,
  },
  {
    title: "setup vs setup_all Lifecycle Differences",
    description:
      "setup runs before each test and can return context that's merged into the test context. setup_all runs once before all tests in the module. Critically, setup_all runs in a separate process from the tests, so any process-linked state (like Ecto Sandbox checkouts) set in setup_all won't be available in individual tests. Also, setup_all blocks async: true.",
    code: `defmodule MyTest do
  use ExUnit.Case

  # Runs ONCE before all tests — same process as module
  setup_all do
    expensive_data = load_fixture_file()
    {:ok, shared: expensive_data}
  end

  # Runs before EACH test — in the test process
  setup context do
    user = create_test_user()
    {:ok, user: user, shared: context.shared}
  end

  test "uses both contexts", %{user: user, shared: data} do
    # user is fresh per test, shared is reused
    assert user.id != nil
    assert data != nil
  end
end`,
  },
  {
    title: "Doctest Edge Cases with Multiline Expressions",
    description:
      "Doctests are convenient but have quirks with multiline expressions. Continuation lines must start with ...> and the expected output must immediately follow the last line of the expression. Multiline output, maps with non-deterministic key order, and expressions that produce side effects can all cause flaky doctests.",
    code: `# CORRECT multiline doctest:
@doc \"\"\"
    iex> %{name: "Alice"}
    ...> |> Map.put(:age, 30)
    ...> |> Map.keys()
    [:age, :name]
\"\"\"

# PROBLEMATIC: map key order isn't guaranteed
@doc \"\"\"
    iex> %{b: 2, a: 1}
    %{a: 1, b: 2}
\"\"\"
# This may fail depending on map internal ordering!

# SAFE: use inspect or compare specific keys instead
@doc \"\"\"
    iex> map = %{b: 2, a: 1}
    iex> map[:a]
    1
\"\"\"`,
  },
];

export default gotchas;
