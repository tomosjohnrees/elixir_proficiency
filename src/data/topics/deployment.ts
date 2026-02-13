import type { TopicContent } from "@/lib/types";

const deployment: TopicContent = {
  meta: {
    slug: "deployment",
    title: "Releases & Deployment",
    description: "Mix releases, configuration, and deployment strategies",
    number: 25,
    active: true,
  },

  eli5: {
    analogyTitle: "Shipping a Product",
    analogy:
      "Imagine you've built an amazing gadget in your workshop. You can't ship your entire workshop to every customer — the tools, the spare parts, the half-finished prototypes. Instead, you package the finished gadget with just what it needs: the batteries, the manual, and a power adapter for the customer's country. That self-contained package is a release. It runs anywhere without needing your workshop installed.",
    items: [
      { label: "The workshop", description: "Your development environment with Mix, compilers, and all your tools. Customers (production servers) don't need any of this." },
      { label: "The package", description: "A Mix release. It bundles your compiled application, the Erlang runtime, and startup scripts into a single directory you can copy anywhere and run." },
      { label: "The power adapter", description: "Runtime configuration. Different customers (environments) need different settings — database URLs, API keys, port numbers. These are configured at startup, not baked in at build time." },
      { label: "The manual", description: "Release commands and scripts. Start, stop, restart, run migrations, open a remote console — everything an operator needs to manage your app in production." },
    ],
    keyTakeaways: [
      "A Mix release is a self-contained bundle of your app + the Erlang VM that runs without Elixir or Mix installed.",
      "Configuration has three phases: compile-time (config.exs), build-time (config/runtime.exs reads env vars at startup), and pure runtime.",
      "runtime.exs is the right place for secrets and environment-specific config — it runs every time the app starts.",
      "Releases include scripts for starting, stopping, remote console access, and running custom commands like migrations.",
      "Docker is the most common deployment target — build in one container, run in a minimal one.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "mix release", color: "#2563eb", examples: ["MIX_ENV=prod mix release", "_build/prod/rel/my_app/", "bin/my_app start"], description: "The command that assembles your release. Produces a directory with your compiled app, ERTS (Erlang Runtime), and boot scripts." },
      { name: "config/runtime.exs", color: "#d97706", examples: ["System.get_env(\"DATABASE_URL\")", "config :my_app, port: port", "import Config"], description: "Evaluated at runtime (every app start), not at compile time. The right place for environment variables and secrets." },
      { name: "config/config.exs", color: "#6b7280", examples: ["config :logger, level: :info", "import_config \"#{config_env()}.exs\"", "compile-time only"], description: "Evaluated at compile/build time. Good for static config that doesn't change between environments." },
      { name: "rel/overlays", color: "#059669", examples: ["rel/overlays/bin/migrate", "rel/overlays/bin/seeds", "copy_to: release_dir"], description: "Extra files copied into the release. Commonly used for custom scripts like database migration commands." },
      { name: "Docker", color: "#0891b2", examples: ["FROM hexpm/elixir AS build", "RUN mix release", "FROM debian:slim", "COPY --from=build"], description: "Multi-stage Docker builds: compile and build the release in a full image, then copy just the release into a minimal runtime image." },
      { name: "bin/my_app", color: "#e11d48", examples: ["bin/my_app start", "bin/my_app remote", "bin/my_app eval \"...\"", "bin/my_app stop"], description: "The release entry point. Supports start, stop, restart, remote IEx console, and eval for running one-off commands." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "What Is a Release?",
        prose: [
          "A Mix release packages your compiled application, all its dependencies, and the Erlang Runtime System (ERTS) into a self-contained directory. You can copy this directory to any compatible machine and run it — no Elixir, Erlang, or Mix installation required.",
          "Releases are the standard way to deploy Elixir applications to production. They start faster than `mix phx.server` (no compilation step), use less memory (no Mix tooling loaded), and provide production-grade features like remote console access and graceful shutdown.",
        ],
        code: {
          title: "Building a release",
          code: `# Build a production release
MIX_ENV=prod mix deps.get --only prod
MIX_ENV=prod mix compile
MIX_ENV=prod mix assets.deploy  # Phoenix only
MIX_ENV=prod mix release

# The release is now at:
# _build/prod/rel/my_app/

# Start it
_build/prod/rel/my_app/bin/my_app start

# Or start in the foreground (useful for Docker)
_build/prod/rel/my_app/bin/my_app start_iex

# Other commands
_build/prod/rel/my_app/bin/my_app stop
_build/prod/rel/my_app/bin/my_app restart
_build/prod/rel/my_app/bin/my_app remote  # attach IEx console
_build/prod/rel/my_app/bin/my_app pid     # print OS PID`,
          output: "Release created at _build/prod/rel/my_app",
        },
      },
      {
        title: "Configuration: Compile-Time vs Runtime",
        prose: [
          "This is one of the most important concepts to get right. Elixir has two configuration phases: compile-time (`config/config.exs` and environment-specific files like `config/prod.exs`) and runtime (`config/runtime.exs`). Compile-time config is baked into the release at build time. Runtime config is evaluated every time the app starts.",
          "The rule is simple: if a value changes between environments or contains secrets, it belongs in `runtime.exs` with `System.get_env/1`. If it's a static setting that never changes (like a logger format or a JSON library choice), it can go in `config.exs`.",
        ],
        code: {
          title: "Configuration files",
          code: `# config/config.exs — evaluated at COMPILE TIME
import Config

config :my_app, MyAppWeb.Endpoint,
  render_errors: [formats: [html: MyAppWeb.ErrorHTML]]

config :logger, :console,
  format: "$time $metadata[$level] $message\\n"

# Imports environment-specific config
import_config "\#{config_env()}.exs"

# config/prod.exs — also compile time, but only for prod
import Config

config :my_app, MyAppWeb.Endpoint,
  cache_static_manifest: "priv/static/cache_manifest.json"

# config/runtime.exs — evaluated at RUNTIME (every app start)
import Config

if config_env() == :prod do
  database_url =
    System.get_env("DATABASE_URL") ||
      raise "DATABASE_URL environment variable is not set"

  config :my_app, MyApp.Repo,
    url: database_url,
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")

  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise "SECRET_KEY_BASE environment variable is not set"

  config :my_app, MyAppWeb.Endpoint,
    http: [port: String.to_integer(System.get_env("PORT") || "4000")],
    secret_key_base: secret_key_base
end`,
          output: "Configuration loaded",
        },
      },
      {
        title: "Release Configuration in mix.exs",
        prose: [
          "You can customize your release in the `releases` section of `mix.exs`. Common options include setting the release name, including ERTS (or not, if the target already has Erlang), adding overlays (extra files), and configuring cookie values for distributed Erlang.",
          "The `steps` option lets you inject custom steps into the release assembly process — for example, running a script that generates documentation or stamps the release with a git SHA.",
        ],
        code: {
          title: "Release options in mix.exs",
          code: `# mix.exs
def project do
  [
    app: :my_app,
    version: "0.1.0",
    elixir: "~> 1.16",
    releases: releases()
  ]
end

defp releases do
  [
    my_app: [
      # Include the Erlang runtime (default: true)
      include_erts: true,

      # Extra files to include
      overlays: ["rel/overlays"],

      # Custom steps during assembly
      steps: [:assemble, &copy_extra_files/1],

      # Application configuration
      applications: [runtime_tools: :permanent]
    ]
  ]
end

defp copy_extra_files(release) do
  # Custom release step — add a VERSION file
  File.write!(
    Path.join(release.path, "VERSION"),
    release.version
  )
  release
end`,
          output: "Release my_app-0.1.0 assembled",
        },
      },
      {
        title: "Custom Release Commands",
        prose: [
          "Releases can run one-off commands using `bin/my_app eval`. This is essential for tasks like running database migrations in production, where you can't use `mix ecto.migrate` (Mix isn't available in a release).",
          "The convention is to create a release module with functions for common operational tasks, then invoke them with `eval`. You can also add shell script overlays for convenience.",
        ],
        code: {
          title: "Migration and seed commands",
          code: `# lib/my_app/release.ex
defmodule MyApp.Release do
  @app :my_app

  def migrate do
    load_app()

    for repo <- repos() do
      {:ok, _, _} =
        Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :up, all: true))
    end
  end

  def rollback(repo, version) do
    load_app()
    {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :down, to: version))
  end

  def seed do
    load_app()

    for repo <- repos() do
      Ecto.Migrator.with_repo(repo, fn _repo ->
        Code.eval_file("priv/repo/seeds.exs")
      end)
    end
  end

  defp repos, do: Application.fetch_env!(@app, :ecto_repos)
  defp load_app, do: Application.ensure_all_started(@app)
end

# Run from the command line:
# bin/my_app eval "MyApp.Release.migrate()"
# bin/my_app eval "MyApp.Release.seed()"

# Or create a convenience script at rel/overlays/bin/migrate:
#!/bin/sh
# rel/overlays/bin/migrate
set -e
bin/my_app eval "MyApp.Release.migrate()"`,
          output: "Migrations complete",
        },
      },
      {
        title: "Docker Deployment",
        prose: [
          "Docker is the most common way to deploy Elixir releases. The pattern is a multi-stage build: the first stage uses a full Elixir image to compile and assemble the release, the second stage copies just the release into a minimal OS image. This keeps your production image small and secure.",
          "Phoenix projects include a `mix phx.gen.release --docker` generator that creates a production-ready Dockerfile. The key considerations are: matching the build and runtime OS/architecture, handling asset compilation, and passing environment variables at runtime.",
        ],
        code: {
          title: "Multi-stage Dockerfile",
          code: `# Dockerfile
# Stage 1: Build
FROM hexpm/elixir:1.16.1-erlang-26.2.2-debian-bookworm-20240130 AS build

RUN apt-get update && apt-get install -y build-essential git
RUN mix local.hex --force && mix local.rebar --force

WORKDIR /app
ENV MIX_ENV=prod

# Install dependencies
COPY mix.exs mix.lock ./
RUN mix deps.get --only prod
RUN mix deps.compile

# Compile assets (Phoenix)
COPY assets assets
COPY priv priv
COPY lib lib
RUN mix assets.deploy

# Compile and build release
COPY config config
RUN mix compile
RUN mix release

# Stage 2: Runtime (minimal image)
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y libstdc++6 openssl libncurses5 locales \\
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8

WORKDIR /app
COPY --from=build /app/_build/prod/rel/my_app ./

ENV PHX_HOST=example.com
ENV PORT=4000
EXPOSE 4000

CMD ["bin/my_app", "start"]`,
          output: "Docker image built — 45MB",
        },
      },
      {
        title: "Health Checks, Graceful Shutdown, and Observability",
        prose: [
          "Production deployments need health checks so load balancers know when your app is ready. Phoenix provides a simple way to add a health endpoint. You also want graceful shutdown — when your app receives a termination signal, it should finish in-flight requests before stopping.",
          "The BEAM VM handles SIGTERM gracefully by default: it runs shutdown hooks and gives processes time to clean up. You can configure the shutdown timeout and add custom cleanup logic in your application's `stop/1` callback or individual GenServer `terminate/2` callbacks.",
        ],
        code: {
          title: "Production essentials",
          code: `# Health check endpoint in router
scope "/health", MyAppWeb do
  pipe_through :api

  get "/", HealthController, :check
end

defmodule MyAppWeb.HealthController do
  use MyAppWeb, :controller

  def check(conn, _params) do
    # Check database connectivity
    case Ecto.Adapters.SQL.query(MyApp.Repo, "SELECT 1") do
      {:ok, _} ->
        json(conn, %{status: "ok", version: Application.spec(:my_app, :vsn)})

      {:error, _} ->
        conn
        |> put_status(:service_unavailable)
        |> json(%{status: "error", reason: "database unavailable"})
    end
  end
end

# Graceful shutdown configuration in config/runtime.exs
config :my_app, MyAppWeb.Endpoint,
  http: [
    port: port,
    transport_options: [
      # Allow 30s for in-flight requests to complete
      shutdown_timeout: 30_000
    ]
  ]

# Custom cleanup in application.ex
def stop(_state) do
  IO.puts("Application shutting down gracefully...")
  :ok
end`,
          output: "{\"status\": \"ok\", \"version\": \"0.1.0\"}",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "What is included in a Mix release?",
        options: [
          { label: "Only your compiled .beam files" },
          { label: "Your compiled app, dependencies, and the Erlang Runtime System (ERTS)", correct: true },
          { label: "Your source code and Mix tooling" },
          { label: "A Docker image with your application" },
        ],
        explanation:
          "A release bundles your compiled application bytecode, all dependency bytecode, the ERTS (Erlang VM), and startup scripts. Source code and Mix are not included — the release is self-contained and runs without any Elixir or Erlang installation on the target machine.",
      },
      {
        question: "When is `config/runtime.exs` evaluated?",
        options: [
          { label: "At compile time, when you run mix compile" },
          { label: "At build time, when you run mix release" },
          { label: "Every time the application starts", correct: true },
          { label: "Only the first time the release runs" },
        ],
        explanation:
          "runtime.exs is evaluated every time the application boots — whether in development with `mix phx.server` or in production from a release. This is why it's the right place for System.get_env calls: the values are read fresh on each start.",
      },
      {
        question: "Why can't you run `mix ecto.migrate` in a production release?",
        options: [
          { label: "Ecto doesn't support releases" },
          { label: "Mix is not included in releases — you must use eval with a custom command", correct: true },
          { label: "Migrations can only run in development" },
          { label: "You need to use Docker instead" },
        ],
        explanation:
          "Mix is a build tool that's intentionally excluded from releases. To run migrations, you create a module (like MyApp.Release) with a migrate function, then invoke it with `bin/my_app eval \"MyApp.Release.migrate()\"`. This is the standard pattern for any Mix task you need in production.",
      },
      {
        question: "What is the purpose of a multi-stage Docker build for Elixir?",
        options: [
          { label: "To run tests before deployment" },
          { label: "To compile in a full image and copy only the release to a minimal runtime image", correct: true },
          { label: "To support multiple Elixir versions" },
          { label: "Multi-stage builds are required by Mix" },
        ],
        explanation:
          "The build stage needs Elixir, Erlang, build tools, and npm (for assets). The runtime stage only needs the OS and a few libraries. By copying just the release to a minimal image, your production container can be as small as 45-80MB instead of 1GB+.",
      },
      {
        question: "What does `bin/my_app remote` do?",
        options: [
          { label: "Deploys the release to a remote server" },
          { label: "Attaches an IEx console to the running release process", correct: true },
          { label: "Starts the app on a remote node" },
          { label: "Fetches logs from the remote server" },
        ],
        explanation:
          "The remote command connects an IEx session to your running application. This lets you inspect state, run queries, debug issues, and execute code in the live production system — one of the BEAM's most powerful operational features. Use it carefully!",
      },
      {
        question: "You put `System.get_env(\"DATABASE_URL\")` in `config/config.exs` instead of `config/runtime.exs`. What happens when you deploy the release to production with a different DATABASE_URL?",
        options: [
          { label: "It reads the new DATABASE_URL at startup and works correctly" },
          { label: "It uses the DATABASE_URL value from the build environment, ignoring the production value", correct: true },
          { label: "It raises a compilation error because System.get_env is not allowed in config.exs" },
          { label: "It falls back to a default database URL provided by Mix" },
        ],
        explanation:
          "config/config.exs is evaluated at compile time, so the value of DATABASE_URL is baked into the release at build time. When the release starts in production, config.exs is not re-evaluated — only runtime.exs is. This is one of the most common deployment mistakes in Elixir and is why secrets and environment-specific values must go in runtime.exs.",
      },
      {
        question: "What is the purpose of the release cookie in distributed Erlang?",
        options: [
          { label: "It encrypts all network traffic between nodes" },
          { label: "It acts as a shared secret that nodes must match to connect to each other", correct: true },
          { label: "It stores session data for Phoenix web users" },
          { label: "It is a unique identifier used to name the release in the registry" },
        ],
        explanation:
          "The release cookie is a shared authentication token that all BEAM nodes in a cluster must have in common to communicate. It is not encryption — it only gates initial connection. You can set it in mix.exs releases config, via the RELEASE_COOKIE environment variable, or in the releases/COOKIE file. In production clusters, always set a strong, unique cookie.",
      },
      {
        question: "In a multi-stage Docker build for an Elixir release, why is `config/runtime.exs` typically copied AFTER `mix deps.compile` but before `mix release`?",
        options: [
          { label: "Because runtime.exs must be compiled with the dependencies" },
          { label: "Because runtime.exs is not needed during compilation but must be included in the release artifact", correct: true },
          { label: "Because Docker requires all config files to be copied in a specific order" },
          { label: "Because runtime.exs depends on dependencies being compiled first to validate its syntax" },
        ],
        explanation:
          "runtime.exs is not evaluated at compile time, so it does not affect dependency or application compilation. However, it must be present when `mix release` runs because the release builder bundles it into the release for evaluation at boot time. Copying it late maximizes Docker layer caching — changes to runtime.exs won't invalidate the expensive dependency compilation layer.",
      },
      {
        question: "What is a key limitation of hot code upgrades (appups/relups) in Elixir?",
        options: [
          { label: "They only work with GenServers, not other process types" },
          { label: "They require careful state migration code and can fail if process state shapes change without proper transformation logic", correct: true },
          { label: "They are only supported by Distillery, not Mix releases" },
          { label: "They can only upgrade one module at a time" },
        ],
        explanation:
          "Hot code upgrades let you update a running system without downtime, but they require writing appup files that describe how to transform the internal state of each process from the old version to the new version. If a GenServer's state struct changes and you don't provide a code_change/3 callback, the upgrade can crash processes. Most teams choose rolling deploys instead because they are simpler and more reliable.",
      },
      {
        question: "When using libcluster for BEAM node clustering, what does the `Cluster.Strategy.Gossip` strategy do?",
        options: [
          { label: "It queries a DNS service to discover other nodes" },
          { label: "It uses UDP multicast to broadcast and discover nodes on the local network", correct: true },
          { label: "It reads a static list of node names from configuration" },
          { label: "It polls a Kubernetes API for pod IP addresses" },
        ],
        explanation:
          "The Gossip strategy uses UDP multicast so nodes can automatically discover each other on the same network without any central registry. This works well for development and simple LAN deployments. For production cloud environments, you'd typically use strategies like DNS, Kubernetes, or cloud-specific service discovery instead, since multicast is usually not available across cloud subnets.",
      },
      {
        question: "What happens if you set `include_erts: false` in your release configuration?",
        options: [
          { label: "The release will not compile and will raise an error" },
          { label: "The release will be smaller but requires a matching Erlang/OTP installation on the target machine", correct: true },
          { label: "The release will download ERTS at runtime when it first starts" },
          { label: "The release will use a stripped-down ERTS with reduced functionality" },
        ],
        explanation:
          "Setting `include_erts: false` excludes the Erlang Runtime System from the release, making it significantly smaller. However, the target machine must have a compatible Erlang/OTP version installed, and the OTP version must match the one the release was compiled against. This is useful when deploying to machines where Erlang is pre-installed or managed separately, but it removes one of the key benefits of releases — self-contained deployment.",
      },
      {
        question: "You deploy your Phoenix app to Fly.io and notice that PubSub messages are not reaching users connected to other instances. What is the most likely cause?",
        options: [
          { label: "Phoenix PubSub is disabled in production by default" },
          { label: "The BEAM nodes are not clustered, so the distributed PubSub adapter cannot relay messages between instances", correct: true },
          { label: "Fly.io does not support WebSocket connections needed for PubSub" },
          { label: "PubSub requires Redis in production, which you haven't configured" },
        ],
        explanation:
          "Phoenix PubSub with the default PG2 adapter relies on Erlang distribution (clustered BEAM nodes) to broadcast messages across instances. If your Fly.io machines are not connected into a cluster via libcluster and DNS-based discovery, each instance has its own isolated PubSub — users on different instances won't see each other's messages. Setting up libcluster with Fly.io's DNS clustering strategy resolves this.",
      },
      {
        question: "What is the correct way to configure node naming for a release that will join a cluster?",
        options: [
          { label: "Set the --name flag every time you start the release with bin/my_app start --name mynode@host" },
          { label: "Set the RELEASE_NODE and RELEASE_DISTRIBUTION environment variables before starting the release", correct: true },
          { label: "Add the node name to config/runtime.exs using Node.self()" },
          { label: "Node naming is automatic — the release uses the hostname by default" },
        ],
        explanation:
          "Releases read RELEASE_NODE (e.g., my_app@10.0.0.1) and RELEASE_DISTRIBUTION (name or sname) environment variables to configure Erlang distribution at boot time. This is handled by the release boot script before the application starts, which is why it can't be done in runtime.exs — Erlang distribution must be configured before the VM fully initializes. For short names, use RELEASE_DISTRIBUTION=sname.",
      },
      {
        question: "In a Dockerfile for an Elixir release, why is `exec bin/my_app start` preferred over `bin/my_app start` in the CMD or entrypoint script?",
        options: [
          { label: "exec makes the command run faster by skipping shell initialization" },
          { label: "exec replaces the shell process with the BEAM, so Docker signals like SIGTERM reach the application directly for graceful shutdown", correct: true },
          { label: "exec is required by Docker — without it, the container won't start" },
          { label: "exec enables the release to write logs to Docker's stdout" },
        ],
        explanation:
          "Without exec, the shell script runs as PID 1 and the BEAM runs as a child process. When Docker sends SIGTERM (during deploys or scaling), it goes to the shell, which may not forward it properly — leading to a hard kill after the timeout. With exec, the BEAM becomes PID 1 and receives signals directly, allowing it to run shutdown hooks, drain connections, and stop gracefully.",
      },
      {
        question: "Your release defines `config :my_app, :feature_flag, true` in `config/prod.exs` and `config :my_app, :feature_flag, false` in `config/runtime.exs`. Which value is used when the release starts?",
        options: [
          { label: "true — compile-time config always takes precedence" },
          { label: "false — runtime.exs is evaluated last and overrides earlier config", correct: true },
          { label: "It raises a conflict error at startup" },
          { label: "It depends on which file was modified most recently" },
        ],
        explanation:
          "Elixir's config system applies settings in order: config.exs (and imported files like prod.exs) at compile time, then runtime.exs at boot time. Later values override earlier ones for the same key. This layering is by design — it lets you set sensible compile-time defaults that can be overridden at runtime. Understanding this precedence order is critical for debugging unexpected configuration values in production.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "Configure a Phoenix App for Release",
        difficulty: "beginner",
        prompt:
          "Write a `config/runtime.exs` file for a Phoenix application that:\n- Reads `DATABASE_URL`, `SECRET_KEY_BASE`, `PHX_HOST`, and `PORT` from environment variables\n- Raises helpful error messages if required variables are missing\n- Sets the Repo pool size from `POOL_SIZE` (default 10)\n- Configures the Endpoint with the host and port\n- Only applies these settings in the `:prod` environment",
        hints: [
          { text: "Wrap everything in `if config_env() == :prod do ... end`." },
          { text: "Use the pattern `System.get_env(\"VAR\") || raise \"message\"` for required variables." },
          { text: "Convert string env vars to integers with `String.to_integer/1`." },
        ],
        solution: `# config/runtime.exs
import Config

if config_env() == :prod do
  database_url =
    System.get_env("DATABASE_URL") ||
      raise """
      Environment variable DATABASE_URL is missing.
      Example: ecto://USER:PASS@HOST/DATABASE
      """

  config :my_app, MyApp.Repo,
    url: database_url,
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10")

  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      Environment variable SECRET_KEY_BASE is missing.
      Generate one with: mix phx.gen.secret
      """

  host = System.get_env("PHX_HOST") || "localhost"
  port = String.to_integer(System.get_env("PORT") || "4000")

  config :my_app, MyAppWeb.Endpoint,
    url: [host: host, port: 443, scheme: "https"],
    http: [ip: {0, 0, 0, 0}, port: port],
    secret_key_base: secret_key_base,
    server: true
end`,
        walkthrough: [
          "We wrap everything in `if config_env() == :prod` so development and test still use their own static config files.",
          "Required variables (DATABASE_URL, SECRET_KEY_BASE) use the `|| raise` pattern with multi-line error messages that include helpful hints.",
          "Optional variables (POOL_SIZE, PORT, PHX_HOST) fall back to sensible defaults using `||`.",
          "String env vars are converted to integers where needed. The Endpoint's http port and Repo's pool_size both need integers.",
          "`server: true` tells Phoenix to start the HTTP server — required in releases since there's no `mix phx.server` to do it.",
          "The URL config with port 443 and https scheme is for link generation, not the actual listener. The HTTP listener binds to the PORT variable.",
        ],
      },
      {
        title: "Release Module with Commands",
        difficulty: "intermediate",
        prompt:
          "Create a `MyApp.Release` module that provides these commands for production use:\n- `migrate/0` — runs all pending Ecto migrations\n- `rollback/2` — rolls back a specific repo to a given version\n- `seed/0` — runs the seed file\n- `check_health/0` — verifies the database is reachable and returns `:ok` or `{:error, reason}`\n\nMake sure the application is properly loaded before each command runs. Show the shell commands to invoke each one.",
        hints: [
          { text: "Use `Application.ensure_all_started(:my_app)` to boot the app before running commands." },
          { text: "Ecto.Migrator.with_repo/2 starts the repo if it isn't running and runs your function." },
          { text: "For health checks, try `Ecto.Adapters.SQL.query/2` with a simple query." },
        ],
        solution: `defmodule MyApp.Release do
  @app :my_app

  def migrate do
    load_app()

    for repo <- repos() do
      {:ok, _, _} =
        Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :up, all: true))
    end

    IO.puts("Migrations complete.")
  end

  def rollback(repo, version) do
    load_app()

    {:ok, _, _} =
      Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :down, to: version))

    IO.puts("Rolled back to version \#{version}.")
  end

  def seed do
    load_app()

    for repo <- repos() do
      Ecto.Migrator.with_repo(repo, fn _repo ->
        seed_file = Path.join([:code.priv_dir(@app), "repo", "seeds.exs"])

        if File.exists?(seed_file) do
          Code.eval_file(seed_file)
          IO.puts("Seeds loaded from \#{seed_file}.")
        else
          IO.puts("No seed file found at \#{seed_file}.")
        end
      end)
    end
  end

  def check_health do
    load_app()

    Enum.reduce_while(repos(), :ok, fn repo, :ok ->
      case Ecto.Migrator.with_repo(repo, fn repo ->
        Ecto.Adapters.SQL.query(repo, "SELECT 1")
      end) do
        {:ok, {:ok, _}, _} ->
          IO.puts("\#{inspect(repo)}: healthy")
          {:cont, :ok}

        error ->
          IO.puts("\#{inspect(repo)}: unhealthy — \#{inspect(error)}")
          {:halt, {:error, repo}}
      end
    end)
  end

  defp repos, do: Application.fetch_env!(@app, :ecto_repos)

  defp load_app do
    Application.ensure_all_started(@app)
  end
end

# Shell commands:
# bin/my_app eval "MyApp.Release.migrate()"
# bin/my_app eval "MyApp.Release.rollback(MyApp.Repo, 20240115120000)"
# bin/my_app eval "MyApp.Release.seed()"
# bin/my_app eval "MyApp.Release.check_health()"`,
        walkthrough: [
          "`load_app/0` ensures the full application is started, including the Repo and all dependencies.",
          "`Ecto.Migrator.with_repo/2` is the recommended way to run migrations — it handles starting and stopping the repo process.",
          "The `migrate/0` function iterates over all configured repos (some apps have more than one database).",
          "`rollback/2` takes a specific repo and migration version so you can target exactly which migration to undo.",
          "`seed/0` uses `:code.priv_dir` to find the seed file relative to the release, not the source directory.",
          "`check_health/0` uses `reduce_while` to test each repo and stop at the first failure — useful for readiness probes.",
        ],
      },
      {
        title: "Production Dockerfile",
        difficulty: "advanced",
        prompt:
          "Write a complete multi-stage Dockerfile for a Phoenix application that:\n- Uses specific Elixir/Erlang/Debian versions for reproducibility\n- Installs only production dependencies\n- Compiles assets with `mix assets.deploy`\n- Builds a release\n- Uses a minimal runtime image with only necessary system libraries\n- Sets up a non-root user for security\n- Runs migrations on startup before starting the server\n- Exposes port 4000\n\nAlso write the matching `.dockerignore` file and the startup script.",
        hints: [
          { text: "Use `hexpm/elixir` as the build base image — it includes Elixir, Erlang, and Debian." },
          { text: "Copy dependency files (mix.exs, mix.lock) first, then install deps — this maximizes Docker layer caching." },
          { text: "For the startup script, chain migration and server start: run migrate first, then exec the release start command." },
        ],
        solution: `# Dockerfile
ARG ELIXIR_VERSION=1.16.1
ARG OTP_VERSION=26.2.2
ARG DEBIAN_VERSION=bookworm-20240130

ARG BUILDER_IMAGE="hexpm/elixir:\${ELIXIR_VERSION}-erlang-\${OTP_VERSION}-debian-\${DEBIAN_VERSION}"
ARG RUNNER_IMAGE="debian:\${DEBIAN_VERSION}-slim"

# ---- Build Stage ----
FROM \${BUILDER_IMAGE} AS build

RUN apt-get update -y && apt-get install -y build-essential git \\
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
RUN mix local.hex --force && mix local.rebar --force

ENV MIX_ENV=prod

# Install dependencies (cached layer)
COPY mix.exs mix.lock ./
RUN mix deps.get --only prod
RUN mkdir config
COPY config/config.exs config/prod.exs config/
RUN mix deps.compile

# Compile assets
COPY priv priv
COPY lib lib
COPY assets assets
RUN mix assets.deploy

# Compile application
COPY config/runtime.exs config/
RUN mix compile

# Build release
COPY rel rel
RUN mix release

# ---- Runtime Stage ----
FROM \${RUNNER_IMAGE}

RUN apt-get update -y && \\
    apt-get install -y libstdc++6 openssl libncurses5 locales ca-certificates \\
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen

ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8

WORKDIR /app
RUN groupadd --system appuser && useradd --system --gid appuser appuser

COPY --from=build --chown=appuser:appuser /app/_build/prod/rel/my_app ./
COPY --chown=appuser:appuser rel/overlays/bin/start ./bin/start

USER appuser

ENV PORT=4000
EXPOSE 4000

CMD ["bin/start"]

# ---

# rel/overlays/bin/start
#!/bin/sh
set -e

echo "Running migrations..."
bin/my_app eval "MyApp.Release.migrate()"

echo "Starting server..."
exec bin/my_app start

# ---

# .dockerignore
_build/
deps/
.git/
.gitignore
.env
*.md
test/
.formatter.exs
.credo.exs
docker-compose*.yml
Dockerfile
.dockerignore
tmp/
node_modules/`,
        walkthrough: [
          "Build args pin exact versions for reproducibility — every build uses the same Elixir, Erlang, and Debian versions.",
          "Dependencies are copied and compiled before application code. This means code changes don't invalidate the dependency cache layer, speeding up rebuilds significantly.",
          "Assets are compiled with `mix assets.deploy` before the main compilation to ensure digested assets are available.",
          "runtime.exs is copied after deps but before compile — it doesn't affect compilation but must be present for the release.",
          "The runtime image only installs minimal libraries needed by the BEAM: libstdc++, openssl, ncurses, and locale support.",
          "A non-root user (appuser) runs the application for security — if the app is compromised, the attacker has limited system access.",
          "The startup script runs migrations before starting the server, ensuring the database schema is current on every deploy.",
          "`exec` before `bin/my_app start` replaces the shell process with the BEAM, so Docker signals (like SIGTERM) reach the application directly for graceful shutdown.",
          "The .dockerignore keeps unnecessary files out of the build context, making docker build faster.",
        ],
      },
    ],
  },
};

export default deployment;
