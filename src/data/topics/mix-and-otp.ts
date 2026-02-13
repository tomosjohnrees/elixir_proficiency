import type { TopicContent } from "@/lib/types";

const mixAndOtp: TopicContent = {
  meta: {
    slug: "mix-and-otp",
    title: "Mix & OTP",
    description: "Project tooling, dependencies, and OTP applications",
    number: 13,
    active: true,
  },

  eli5: {
    analogyTitle: "The Construction Site",
    analogy:
      "Think of building an Elixir project like running a construction site. Mix is your general contractor — it knows how to start new projects, fetch building materials, run inspections, and coordinate everything from blueprint to finished building. You don't carry every brick yourself; the contractor handles the logistics so you can focus on the design.",
    items: [
      { label: "mix new", description: "Like breaking ground on a new lot — it sets up the foundation, walls, and wiring so you have a proper structure to build in." },
      { label: "mix.exs", description: "The master blueprint. It lists your project's name, version, what materials (dependencies) you need, and how everything should be assembled." },
      { label: "Dependencies", description: "Building materials from the hardware store (Hex). You list what you need in the blueprint, and the contractor fetches them for you." },
      { label: "OTP Application", description: "The finished building that knows how to turn itself on. It starts its own electrical system (supervision tree), opens the doors, and keeps running even if a light bulb blows." },
    ],
    keyTakeaways: [
      "Mix is Elixir's build tool — it creates projects, manages dependencies, compiles code, and runs tasks.",
      "Every Mix project has a mix.exs file that defines the project's configuration.",
      "Dependencies come from Hex (Elixir's package manager) and are declared in mix.exs.",
      "An OTP application is a component that can be started and stopped as a unit, with its own supervision tree.",
      "The application callback module defines how your app boots up.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "Project Structure", color: "#6b46c1", examples: ["lib/", "test/", "config/", "mix.exs", "mix.lock"], description: "The standard directory layout that mix new generates. lib/ holds your code, test/ your tests, config/ your environment settings." },
      { name: "mix.exs", color: "#2563eb", examples: ["project/0", "application/0", "deps/0"], description: "The three key functions in your project definition: project metadata, application config, and dependency list." },
      { name: "Dependencies", color: "#d97706", examples: ["hex.pm", "mix deps.get", "mix.lock"], description: "Packages from Hex are declared in deps/0, fetched with mix deps.get, and locked to exact versions in mix.lock." },
      { name: "OTP Application", color: "#059669", examples: ["Application", "start/2", "Supervisor"], description: "An application module that implements start/2 to boot your supervision tree when the system starts." },
      { name: "Mix Tasks", color: "#e11d48", examples: ["mix compile", "mix test", "mix format", "mix run"], description: "Built-in commands that compile, test, format, and run your project. You can also define custom tasks." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "Creating a Project with mix new",
        prose: [
          "The mix new command scaffolds a complete project structure for you. It creates the directory layout, a starter module, a test file, and the all-important mix.exs configuration.",
          "By default, mix new creates a simple project. Adding the --sup flag generates a project with an OTP application skeleton — complete with a supervisor and application callback. This is what you'll use for most real-world projects.",
        ],
        code: {
          title: "Scaffolding a new project",
          code: `# Basic project
$ mix new my_app
# Creates:
#   my_app/
#   ├── lib/
#   │   └── my_app.ex
#   ├── test/
#   │   ├── my_app_test.exs
#   │   └── test_helper.exs
#   ├── mix.exs
#   ├── .formatter.exs
#   └── README.md

# Project with supervision tree
$ mix new my_app --sup
# Also creates lib/my_app/application.ex`,
          output: "* creating mix.exs\n* creating lib/my_app.ex\n* creating test/...",
        },
      },
      {
        title: "Understanding mix.exs",
        prose: [
          "The mix.exs file is the heart of your project. It's a regular Elixir module that uses Mix.Project and defines three key functions: project/0 for metadata, application/0 for runtime config, and deps/0 for dependencies.",
          "The project/0 function returns a keyword list with your app name, version, Elixir version requirement, and compilation settings. The application/0 function tells the runtime which modules to start. The deps/0 function lists your external dependencies.",
        ],
        code: {
          title: "A typical mix.exs file",
          code: `defmodule MyApp.MixProject do
  use Mix.Project

  def project do
    [
      app: :my_app,
      version: "0.1.0",
      elixir: "~> 1.16",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger],
      mod: {MyApp.Application, []}
    ]
  end

  defp deps do
    [
      {:jason, "~> 1.4"},
      {:httpoison, "~> 2.0"},
      {:ex_doc, "~> 0.31", only: :dev, runtime: false}
    ]
  end
end`,
          output: ":ok",
        },
      },
      {
        title: "Managing Dependencies",
        prose: [
          "Elixir uses Hex as its package manager — think of it like npm for JavaScript or pip for Python. You declare dependencies in the deps/0 function of mix.exs as tuples with the package name (an atom), a version requirement, and optional settings.",
          "Version requirements use semantic versioning. The ~> operator is a soft constraint: ~> 1.4 means >= 1.4.0 and < 2.0.0, while ~> 1.4.2 means >= 1.4.2 and < 1.5.0. After adding deps, run mix deps.get to fetch them. The mix.lock file records the exact resolved versions — always commit this file to source control.",
          "Dependencies can be scoped to specific environments with the :only option. For example, test-only deps won't be compiled in production. The :runtime option controls whether a dependency is started as part of your application.",
        ],
        code: {
          title: "Dependency management commands",
          code: `# Fetch all dependencies
$ mix deps.get

# List dependencies and their status
$ mix deps

# Update a specific dependency
$ mix deps.update jason

# Update all dependencies
$ mix deps.update --all

# Compile dependencies
$ mix deps.compile

# Dependency with options
defp deps do
  [
    # From Hex with version constraint
    {:phoenix, "~> 1.7"},

    # Dev/test only
    {:credo, "~> 1.7", only: [:dev, :test]},

    # From a Git repository
    {:my_lib, git: "https://github.com/user/my_lib.git", tag: "v1.0"},

    # Local path (useful during development)
    {:my_other_lib, path: "../my_other_lib"}
  ]
end`,
          output: "Resolving Hex dependencies...",
        },
      },
      {
        title: "OTP Applications",
        prose: [
          "In OTP, an \"application\" is more than just your code — it's a component that can be started and stopped as a unit. When you run your project, the BEAM starts all the applications it depends on (like :logger, :crypto) before starting yours.",
          "The mod: {MyApp.Application, []} line in your mix.exs tells OTP which module to call when starting your application. That module must implement the Application behaviour and define a start/2 callback that returns {:ok, pid} — typically by starting a top-level supervisor.",
          "The start_permanent: Mix.env() == :prod option means that in production, if your application's top-level supervisor crashes, the entire BEAM node shuts down. In development, it stays running so you can debug.",
        ],
        code: {
          title: "Application callback module",
          code: `defmodule MyApp.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start a supervised process
      {MyApp.Cache, []},
      # Start a GenServer
      {MyApp.Worker, name: MyApp.Worker},
      # Start a dynamic supervisor
      {DynamicSupervisor, name: MyApp.TaskSupervisor}
    ]

    opts = [strategy: :one_for_one, name: MyApp.Supervisor]
    Supervisor.start_link(children, opts)
  end
end

# You can also define a stop/1 callback for cleanup
# def stop(_state) do
#   :ok
# end`,
          output: "{:ok, #PID<0.150.0>}",
        },
      },
      {
        title: "Mix Environments and Configuration",
        prose: [
          "Mix has three default environments: :dev (development), :test (testing), and :prod (production). The current environment is available via Mix.env(). You typically run mix test in the :test environment and mix run or mix phx.server in :dev.",
          "The config/ directory holds environment-specific configuration. config/config.exs is loaded in all environments, while config/dev.exs, config/test.exs, and config/prod.exs override settings per environment. Since Elixir 1.11, config/runtime.exs runs at application start time — this is where you put settings that depend on system environment variables in production.",
        ],
        code: {
          title: "Configuration files",
          code: `# config/config.exs — shared across all environments
import Config

config :my_app,
  greeting: "Hello"

config :logger, level: :info

# Import environment-specific config
import_config "\#{config_env()}.exs"

# config/dev.exs
import Config
config :my_app, debug: true

# config/runtime.exs — runs at startup
import Config

if config_env() == :prod do
  config :my_app,
    secret_key: System.fetch_env!("SECRET_KEY"),
    port: String.to_integer(System.get_env("PORT") || "4000")
end`,
          output: ":ok",
        },
      },
      {
        title: "Common Mix Tasks",
        prose: [
          "Mix comes with many built-in tasks. The most common are mix compile (compile your project), mix test (run tests), mix format (auto-format code), and mix run (run a script or start your app). You can list all available tasks with mix help.",
          "You can also create custom Mix tasks by defining a module under Mix.Tasks. This is useful for one-off scripts, database seeds, or any project-specific automation. Custom tasks are just modules with a run/1 function.",
        ],
        code: {
          title: "Mix tasks and custom tasks",
          code: `# Common commands
$ mix compile          # Compile the project
$ mix test             # Run tests
$ mix format           # Auto-format all .ex/.exs files
$ mix run -e "IO.puts(:hello)"  # Run an expression
$ mix run --no-halt    # Start the app and keep it running

# List all available tasks
$ mix help

# Creating a custom Mix task
defmodule Mix.Tasks.Greet do
  @moduledoc "Greets the user"
  use Mix.Task

  @shortdoc "Prints a greeting"
  def run(args) do
    name = List.first(args) || "World"
    Mix.shell().info("Hello, \#{name}!")
  end
end

# Now you can run:
$ mix greet
# => Hello, World!
$ mix greet Elixir
# => Hello, Elixir!`,
          output: "Hello, Elixir!",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "What does the --sup flag do when running mix new?",
        options: [
          { label: "Generates a project with a supervision tree and Application module", correct: true },
          { label: "Creates a project with supervisor tests" },
          { label: "Installs the Supervisor dependency from Hex" },
          { label: "Enables superuser permissions for the project" },
        ],
        explanation:
          "The --sup flag tells mix new to generate an Application module with a start/2 callback and a top-level supervisor. This gives you the skeleton for an OTP application that can manage its own processes.",
      },
      {
        question: "What does ~> 1.4 mean in a dependency version requirement?",
        options: [
          { label: "Exactly version 1.4.0" },
          { label: ">= 1.4.0 and < 2.0.0", correct: true },
          { label: ">= 1.4.0 and < 1.5.0" },
          { label: "The latest version after 1.4" },
        ],
        explanation:
          "The ~> operator works differently depending on precision. ~> 1.4 means >= 1.4.0 and < 2.0.0 (allows minor and patch bumps). ~> 1.4.2 would mean >= 1.4.2 and < 1.5.0 (only allows patch bumps). This is a common source of confusion.",
      },
      {
        question: "Which file should you commit to version control?",
        options: [
          { label: "mix.lock", correct: true },
          { label: "_build/" },
          { label: "deps/" },
          { label: "All of the above" },
        ],
        explanation:
          "mix.lock records the exact resolved versions of all dependencies, ensuring consistent builds across machines. The _build/ and deps/ directories are generated artifacts and should be in .gitignore.",
      },
      {
        question: "What must the Application.start/2 callback return?",
        options: [
          { label: ":ok" },
          { label: "{:ok, pid}", correct: true },
          { label: "{:start, pid}" },
          { label: "A Supervisor struct" },
        ],
        explanation:
          "The start/2 callback must return {:ok, pid} where pid is the PID of the top-level supervisor. This is typically the return value of Supervisor.start_link/2. Returning anything else will cause the application to fail to start.",
      },
      {
        question: "Where should you put configuration that reads system environment variables in production?",
        options: [
          { label: "config/config.exs" },
          { label: "config/prod.exs" },
          { label: "config/runtime.exs", correct: true },
          { label: "mix.exs" },
        ],
        explanation:
          "config/runtime.exs runs at application start time, when environment variables are available. The other config files (config.exs, prod.exs) are evaluated at compile time, so System.get_env calls there would capture build-time values, not runtime values.",
      },
      {
        question: "What command generates a new Mix project without a supervision tree?",
        options: [
          { label: "mix new my_app", correct: true },
          { label: "mix new my_app --no-sup" },
          { label: "mix init my_app" },
          { label: "mix create my_app --bare" },
        ],
        explanation:
          "By default, mix new creates a project without a supervision tree or Application module. The --sup flag is what adds the supervision tree, so omitting it gives you a plain project. There is no --no-sup or --bare flag.",
      },
      {
        question: "What does the :only option do in a dependency declaration like {:credo, \"~> 1.7\", only: :dev}?",
        options: [
          { label: "Makes the dependency available only in the specified Mix environment(s)", correct: true },
          { label: "Installs only the main module of the dependency, not its sub-modules" },
          { label: "Ensures the dependency is the only version installed, preventing duplicates" },
          { label: "Restricts the dependency to only the specified Erlang/OTP version" },
        ],
        explanation:
          "The :only option scopes a dependency to specific Mix environments (e.g., :dev, :test). A dependency with only: :dev won't be compiled or available in :test or :prod. This keeps your production release lean by excluding tools like linters and documentation generators.",
      },
      {
        question: "What does the runtime: false option do in a dependency declaration?",
        options: [
          { label: "Prevents the dependency from being compiled" },
          { label: "Makes the dependency available only at compile time, not at runtime" },
          { label: "Prevents the dependency from being started as an OTP application", correct: true },
          { label: "Disables hot code reloading for the dependency" },
        ],
        explanation:
          "Setting runtime: false means the dependency's OTP application won't be started when your application boots. The code is still compiled and available for use — it just won't have a running application process. This is common for tools like ex_doc and credo that are used as tasks, not as running services.",
      },
      {
        question: "What happens when start_permanent is set to true and the application's top-level supervisor crashes?",
        options: [
          { label: "The supervisor automatically restarts with a fresh state" },
          { label: "The entire BEAM node shuts down", correct: true },
          { label: "The application restarts after a configurable timeout" },
          { label: "An error is logged but the node continues running" },
        ],
        explanation:
          "When start_permanent is true (typically in production), if the top-level supervisor terminates, the BEAM VM itself shuts down. This is a deliberate safety mechanism — a crashed top-level supervisor means the application is fundamentally broken. In development, start_permanent is false so the node stays alive for debugging.",
      },
      {
        question: "In an umbrella project, where are the individual child applications located?",
        options: [
          { label: "In the lib/ directory of the root project" },
          { label: "In the deps/ directory alongside external dependencies" },
          { label: "In the apps/ directory at the umbrella root", correct: true },
          { label: "In separate Git repositories linked via mix.exs" },
        ],
        explanation:
          "Umbrella projects organize multiple Mix projects under a single repository. Each child application lives in its own directory under apps/ at the umbrella root, with its own mix.exs, lib/, and test/ directories. The umbrella's root mix.exs coordinates compilation, testing, and dependency resolution across all child apps.",
      },
      {
        question: "What is the purpose of the extra_applications key in the application/0 function of mix.exs?",
        options: [
          { label: "Lists Hex packages that should be compiled before the project" },
          { label: "Lists OTP applications that should be started before your application", correct: true },
          { label: "Defines extra modules that should be included in the release" },
          { label: "Specifies additional Mix tasks to run during compilation" },
        ],
        explanation:
          "extra_applications lists built-in Erlang/OTP applications (like :logger, :crypto, :ssl) that must be started before yours. Hex dependencies are started automatically based on the dependency graph, but standard library applications need to be listed explicitly. Without this, calls to modules in those applications may fail because their processes aren't running.",
      },
      {
        question: "What is the key difference between config/prod.exs and config/runtime.exs?",
        options: [
          { label: "prod.exs only runs in production; runtime.exs runs in all environments" },
          { label: "prod.exs is evaluated at compile time; runtime.exs is evaluated at application start time", correct: true },
          { label: "prod.exs handles OTP config; runtime.exs handles system-level config" },
          { label: "There is no difference — runtime.exs replaced prod.exs in Elixir 1.11" },
        ],
        explanation:
          "config/prod.exs is evaluated during compilation, so any System.get_env/1 calls capture the value at build time. config/runtime.exs runs when the application starts, making it the correct place for values that depend on the deployment environment. This distinction is critical for containerized deployments where build and runtime environments differ.",
      },
      {
        question: "How do you access application environment values that were set via config files at runtime?",
        options: [
          { label: "System.get_env/1" },
          { label: "Mix.env/0" },
          { label: "Application.get_env/2", correct: true },
          { label: "Config.read!/1" },
        ],
        explanation:
          "Application.get_env(:my_app, :key) reads values from the application environment, which is populated by config files (config.exs, runtime.exs, etc.). System.get_env/1 reads OS environment variables, not application config. Mix.env/0 returns the current Mix environment atom (:dev, :test, :prod), not configuration values.",
      },
      {
        question: "When creating a Mix release with mix release, which configuration file is evaluated on the target machine at startup?",
        options: [
          { label: "config/config.exs" },
          { label: "config/prod.exs" },
          { label: "config/runtime.exs", correct: true },
          { label: "rel/env.sh.eex" },
        ],
        explanation:
          "In a Mix release, config/config.exs and config/prod.exs are baked into the release at build time — their values are fixed. config/runtime.exs is the only config file evaluated at startup on the target machine, making it essential for environment-specific settings like database URLs and secret keys. rel/env.sh.eex sets shell environment variables but doesn't handle Elixir application configuration.",
      },
      {
        question: "What is a key trade-off of using umbrella projects compared to separate repositories?",
        options: [
          { label: "Umbrella projects cannot share dependencies between child apps" },
          { label: "Umbrella projects force all child apps to use the same Elixir version and share a single lock file", correct: true },
          { label: "Umbrella projects cannot define inter-app dependencies" },
          { label: "Umbrella projects require each app to be deployed independently" },
        ],
        explanation:
          "All apps in an umbrella share the same Elixir version, the same mix.lock, and the same build environment. This simplifies dependency management but means you cannot have one app on a different version of a shared library than another. This coupling is the primary trade-off: you get simpler coordination at the cost of independent versioning and release flexibility.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "Create and Explore a Project",
        difficulty: "beginner",
        prompt:
          "Create a new Mix project called greeting_app with a supervision tree. Then explore the generated files and identify: (1) where the project version is defined, (2) where the application starts, and (3) what the default supervision strategy is.",
        hints: [
          { text: "Use mix new greeting_app --sup to generate the project with a supervision tree." },
          { text: "Look in mix.exs for the project/0 and application/0 functions." },
          { text: "The Application module is in lib/greeting_app/application.ex — check the start/2 function." },
        ],
        solution: `# Step 1: Create the project
$ mix new greeting_app --sup
$ cd greeting_app

# Step 2: In mix.exs, the version is in project/0:
def project do
  [
    app: :greeting_app,
    version: "0.1.0",        # <-- version is here
    elixir: "~> 1.16",
    start_permanent: Mix.env() == :prod,
    deps: deps()
  ]
end

# Step 3: In lib/greeting_app/application.ex:
defmodule GreetingApp.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # List child processes here
    ]

    # :one_for_one is the default strategy
    opts = [strategy: :one_for_one, name: GreetingApp.Supervisor]
    Supervisor.start_link(children, opts)
  end
end`,
        walkthrough: [
          "mix new greeting_app --sup generates the full project skeleton with an Application module.",
          "The version \"0.1.0\" is defined in the keyword list returned by project/0 in mix.exs.",
          "The application starts via the mod: {GreetingApp.Application, []} entry in application/0, which tells OTP to call GreetingApp.Application.start/2.",
          "The default supervision strategy is :one_for_one, meaning if one child crashes, only that child is restarted.",
        ],
      },
      {
        title: "Add and Configure Dependencies",
        difficulty: "intermediate",
        prompt:
          "Add the Jason library (a JSON parser) as a regular dependency and Credo (a linter) as a dev-only dependency to a Mix project. Write the deps/0 function, then show the commands to fetch and verify the dependencies.",
        hints: [
          { text: "Dependencies are tuples in the list returned by deps/0." },
          { text: "Use the :only option to restrict Credo to the :dev environment." },
          { text: "After adding deps, use mix deps.get to fetch them and mix deps to list their status." },
        ],
        solution: `# In mix.exs:
defp deps do
  [
    {:jason, "~> 1.4"},
    {:credo, "~> 1.7", only: :dev, runtime: false}
  ]
end

# Fetch dependencies
$ mix deps.get

# Verify they're installed
$ mix deps
# * jason 1.4.4 (Hex package) (ok)
# * credo 1.7.5 (Hex package) (ok)

# Credo won't be available in test or prod:
$ MIX_ENV=prod mix deps
# * jason 1.4.4 (Hex package) (ok)
# (credo not listed)`,
        walkthrough: [
          "Jason is added as {:jason, \"~> 1.4\"} — a regular dependency available in all environments.",
          "Credo is added with only: :dev so it's only compiled and available during development. The runtime: false option means it won't be started as an OTP application.",
          "mix deps.get resolves versions, downloads packages from Hex, and updates mix.lock.",
          "mix deps shows the status of all dependencies. Running with MIX_ENV=prod confirms that Credo is excluded from production.",
        ],
      },
      {
        title: "Build a Custom Mix Task",
        difficulty: "intermediate",
        prompt:
          "Create a custom Mix task called mix stats that counts the number of .ex files in the lib/ directory and the number of .exs files in the test/ directory, then prints a summary.",
        hints: [
          { text: "Custom Mix tasks are modules under Mix.Tasks — for mix stats, create Mix.Tasks.Stats." },
          { text: "Use Path.wildcard/1 to find files matching a pattern like \"lib/**/*.ex\"." },
          { text: "Don't forget to add use Mix.Task and define a run/1 function." },
        ],
        solution: `defmodule Mix.Tasks.Stats do
  @moduledoc "Prints file count statistics for the project"
  use Mix.Task

  @shortdoc "Shows project file statistics"
  def run(_args) do
    lib_files = Path.wildcard("lib/**/*.ex")
    test_files = Path.wildcard("test/**/*.exs")

    Mix.shell().info("Project Statistics:")
    Mix.shell().info("  Source files (lib/):  \#{length(lib_files)}")
    Mix.shell().info("  Test files (test/):   \#{length(test_files)}")
    Mix.shell().info("  Total:                \#{length(lib_files) + length(test_files)}")
  end
end

# Save as lib/mix/tasks/stats.ex
# Then run:
$ mix stats
# Project Statistics:
#   Source files (lib/):  5
#   Test files (test/):   3
#   Total:                8`,
        walkthrough: [
          "We define the module as Mix.Tasks.Stats — Mix automatically maps this to the mix stats command by converting the module name.",
          "use Mix.Task brings in the Mix task behaviour. The @shortdoc attribute provides the one-line description shown by mix help.",
          "Path.wildcard(\"lib/**/*.ex\") recursively finds all .ex files under lib/. The ** glob matches any number of nested directories.",
          "We use Mix.shell().info/1 instead of IO.puts/1. This respects Mix's output settings and can be silenced during tests.",
        ],
      },
      {
        title: "Wire Up an OTP Application",
        difficulty: "advanced",
        prompt:
          "Create an Application module for a project called CounterApp that starts a supervision tree with two children: a GenServer called CounterApp.Counter (already implemented) and a Task.Supervisor named CounterApp.TaskSupervisor. Also write the correct mix.exs configuration to wire it all together.",
        hints: [
          { text: "Your Application module needs use Application and must implement start/2." },
          { text: "Child specs can be given as {Module, args} tuples in the children list." },
          { text: "Don't forget the mod: entry in the application/0 function of mix.exs." },
        ],
        solution: `# lib/counter_app/application.ex
defmodule CounterApp.Application do
  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Counter GenServer with a registered name
      {CounterApp.Counter, name: CounterApp.Counter},
      # Start a Task.Supervisor for dynamic tasks
      {Task.Supervisor, name: CounterApp.TaskSupervisor}
    ]

    opts = [strategy: :one_for_one, name: CounterApp.Supervisor]
    Supervisor.start_link(children, opts)
  end
end

# In mix.exs:
defmodule CounterApp.MixProject do
  use Mix.Project

  def project do
    [
      app: :counter_app,
      version: "0.1.0",
      elixir: "~> 1.16",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger],
      mod: {CounterApp.Application, []}
    ]
  end

  defp deps do
    []
  end
end

# Verify it works:
$ iex -S mix
iex> CounterApp.Counter |> Process.whereis() |> Process.alive?()
true
iex> Task.Supervisor.async(CounterApp.TaskSupervisor, fn -> 1 + 1 end) |> Task.await()
2`,
        walkthrough: [
          "The Application module uses use Application and implements the start/2 callback required by the Application behaviour.",
          "We list two children: the Counter GenServer and a Task.Supervisor. Each is specified as a {Module, args} tuple — OTP uses each module's child_spec/1 to determine how to start and supervise them.",
          "The strategy :one_for_one means each child is independent — if the Counter crashes, the TaskSupervisor keeps running and vice versa.",
          "In mix.exs, mod: {CounterApp.Application, []} tells OTP to call CounterApp.Application.start(:normal, []) when the application boots.",
          "extra_applications: [:logger] ensures the Logger application starts before ours. Dependencies from Hex are started automatically, but built-in OTP apps like :logger need to be listed explicitly.",
        ],
      },
    ],
  },
};

export default mixAndOtp;
