import type { TopicContent } from "@/lib/types";
import questions from "./questions/deployment";

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
    questions,
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
