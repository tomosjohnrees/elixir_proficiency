import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "mix.exs Config vs Runtime Config",
    description:
      "Values in config/*.exs files are evaluated at compile time and baked into the release. This means System.get_env/1 in config.exs reads the build machine's environment, not the production server's. Use runtime.exs (Elixir 1.11+) for values that should be read at application startup.",
    code: `# config/config.exs — evaluated at COMPILE TIME
config :my_app, :api_key, System.get_env("API_KEY")
# This reads the env var when you run 'mix release',
# NOT when the release boots on the server!

# config/runtime.exs — evaluated at RUNTIME
import Config
config :my_app, :api_key, System.get_env("API_KEY")
# This reads the env var when the application starts`,
  },
  {
    title: "Application Environment Is Global Mutable State",
    description:
      "Application.get_env/2 and Application.put_env/3 access a global, mutable key-value store shared across your entire application. Modifying it at runtime affects all processes. This makes it hard to test in isolation and can cause race conditions in concurrent tests. Prefer passing configuration explicitly through function arguments or module attributes.",
    code: `# Global state — any process can change this
Application.put_env(:my_app, :feature_enabled, true)

# Another process reads the same value
Application.get_env(:my_app, :feature_enabled)
#=> true

# In tests, this causes flaky behavior with async: true
test "feature is disabled" do
  Application.put_env(:my_app, :feature_enabled, false)
  # Another test might set it to true concurrently!
  assert MyApp.feature_disabled?()
end`,
  },
  {
    title: "Dependency Version Conflicts Are Silent Until They Aren't",
    description:
      "Mix resolves dependency versions using a constraint solver. If two dependencies require incompatible versions of the same library, mix deps.get will fail with a version conflict. Use mix deps.tree to understand your dependency graph and override: true sparingly — it hides real incompatibilities.",
    code: `# In mix.exs — two deps want different versions of jason
defp deps do
  [
    {:phoenix, "~> 1.7"},    # wants jason ~> 1.2
    {:old_lib, "~> 0.5"}     # wants jason ~> 1.0 and < 1.2
  ]
end

# Diagnose with:
# mix deps.tree
# mix deps.unlock --all && mix deps.get

# Last resort (hides the real problem):
{:jason, "~> 1.4", override: true}`,
  },
  {
    title: "Forgetting to Add Applications to extra_applications",
    description:
      "If your app depends on an Erlang application like :crypto, :ssl, or :inets that isn't a hex dependency, you must list it in extra_applications in mix.exs. Otherwise, it won't be started in a release and you'll get runtime errors. Hex dependencies are started automatically, but standard library applications are not.",
    code: `# BAD: using :crypto without listing it
def application do
  [
    mod: {MyApp.Application, []},
    extra_applications: [:logger]
  ]
end
# In production release:
# ** (UndefinedFunctionError) :crypto.hash/2 is undefined

# GOOD: explicitly include it
def application do
  [
    mod: {MyApp.Application, []},
    extra_applications: [:logger, :crypto, :ssl]
  ]
end`,
  },
];

export default gotchas;
