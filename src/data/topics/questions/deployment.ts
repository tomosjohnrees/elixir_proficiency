import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
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
  {
    question: "What does `bin/my_app eval` do in a Mix release, and how is it different from `bin/my_app rpc`?",
    options: [
      { label: "eval starts a temporary instance to run a one-off command; rpc connects to a running instance and executes code inside it", correct: true },
      { label: "They are the same — both connect to the running instance" },
      { label: "eval runs Elixir code; rpc runs Erlang code" },
      { label: "eval is for development; rpc is for production" },
    ],
    explanation:
      "eval boots a fresh, temporary BEAM instance, runs the given code, and exits. It's used for one-off tasks like database migrations that don't need a running application. rpc connects to an already-running release and evaluates code inside that instance, which is useful for inspecting state or running commands on a live system. The key difference: eval starts a new BEAM, rpc communicates with an existing one.",
  },
  {
    question: "Why is a multi-stage Docker build recommended for Elixir releases?",
    options: [
      { label: "It makes the build faster by parallelizing compilation" },
      { label: "It separates the build environment (with Elixir/Erlang, compilers, build tools) from the runtime image, producing a much smaller final image", correct: true },
      { label: "Docker requires multi-stage builds for BEAM applications" },
      { label: "It allows hot code upgrades inside the container" },
    ],
    explanation:
      "A multi-stage build uses a large builder image (with Elixir, Erlang, Node.js for asset compilation, etc.) to compile the release, then copies just the release artifacts into a minimal runtime image (like debian-slim or alpine). The final image doesn't need Elixir or the compiler — the release includes ERTS. This can reduce image size from 1GB+ to under 100MB, improving deploy speed and reducing attack surface.",
  },
];

export default questions;
