import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
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
];

export default questions;
