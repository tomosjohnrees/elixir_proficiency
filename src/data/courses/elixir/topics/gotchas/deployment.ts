import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Releases Don't Include Mix — Can't Use Mix.env",
    description:
      "When you build a release with mix release, Mix itself is not included in the release artifact. Any code that calls Mix.env() or uses Mix at runtime will fail with an UndefinedFunctionError in production. If you need to know the environment at runtime, set it as an application config or an environment variable and read it with Application.get_env/3.",
    code: `# This works in development but crashes in a release
def some_function do
  if Mix.env() == :prod do  # ** (UndefinedFunctionError)
    do_production_thing()
  end
end

# Correct: use application config set at compile time
# In config/prod.exs:
# config :my_app, env: :prod

def some_function do
  if Application.get_env(:my_app, :env) == :prod do
    do_production_thing()
  end
end

# Or use a compile-time module attribute
@env Mix.env()
def some_function do
  if @env == :prod, do: do_production_thing()
end`,
  },
  {
    title: "runtime.exs vs config.exs — Compile-Time vs Runtime Configuration",
    description:
      "Files in config/ (config.exs, dev.exs, prod.exs) are evaluated at compile time and baked into the release. Only config/runtime.exs is evaluated when the release starts. If you read environment variables like System.get_env(\"DATABASE_URL\") in config.exs, you get the value from the build machine, not the production server. Always use runtime.exs for environment-specific secrets.",
    code: `# Wrong: in config/prod.exs (evaluated at BUILD time)
config :my_app, MyApp.Repo,
  url: System.get_env("DATABASE_URL")
  # Bakes in the build machine's DATABASE_URL!

# Correct: in config/runtime.exs (evaluated at BOOT time)
import Config

if config_env() == :prod do
  config :my_app, MyApp.Repo,
    url: System.get_env("DATABASE_URL") ||
      raise "DATABASE_URL not set"
end`,
  },
  {
    title: "Hot Code Upgrades Are Complex and Rarely Worth It",
    description:
      "The BEAM VM supports hot code swapping, allowing you to upgrade running code without downtime. However, proper hot upgrades require careful state migration in every GenServer, appup files, and relup scripts. In practice, most teams deploy by rolling restarts instead. Unless you have hard real-time requirements (e.g., telecom), simple rolling deploys are far safer and easier to reason about.",
  },
  {
    title: "BEAM Clustering Requires Consistent Cookie and Node Naming",
    description:
      "To connect BEAM nodes into a cluster, every node must share the same Erlang cookie and be able to resolve each other's node names. Mismatched cookies silently fail to connect (no error, just no connection). Long names (--name) require DNS or IP resolution, while short names (--sname) only work within the same hostname scope. Debugging clustering issues usually starts with checking these two settings.",
    code: `# Starting nodes that can cluster together:
# Both must use the same cookie value

# Node 1
iex --name app1@192.168.1.10 --cookie my_secret_cookie

# Node 2
iex --name app2@192.168.1.11 --cookie my_secret_cookie

# In a release, set these in env.sh.eex or via environment:
# RELEASE_NODE=app1@192.168.1.10
# RELEASE_COOKIE=my_secret_cookie

# Common gotcha: cookies don't match
Node.connect(:"app2@192.168.1.11")
#=> false (silently fails — no error raised!)`,
  },
];

export default gotchas;
