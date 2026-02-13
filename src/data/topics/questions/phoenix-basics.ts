import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What is the correct order of the Phoenix request lifecycle?",
    options: [
      { label: "Controller -> Router -> Endpoint -> Template" },
      { label: "Endpoint -> Router -> Pipeline -> Controller -> View", correct: true },
      { label: "Router -> Endpoint -> Controller -> Database" },
      { label: "Template -> Controller -> Router -> Response" },
    ],
    explanation:
      "Requests flow: Endpoint (low-level plugs) -> Router (matches path to controller) -> Pipeline (applies middleware plugs) -> Controller (handles logic) -> View/Component (renders response).",
  },
  {
    question: "What does `resources \"/users\", UserController` generate?",
    options: [
      { label: "Only GET /users and GET /users/:id" },
      { label: "All 7 RESTful routes (index, new, create, show, edit, update, delete)", correct: true },
      { label: "A CRUD database table for users" },
      { label: "A full User schema and migration" },
    ],
    explanation:
      "The resources macro generates all 7 standard RESTful routes: index, new, create, show, edit, update, and delete. You can limit which routes are generated using the :only or :except options.",
  },
  {
    question: "What happens if you call `halt()` in a plug?",
    options: [
      { label: "The server shuts down" },
      { label: "The current plug raises an error" },
      { label: "The pipeline stops — no further plugs or controller actions run", correct: true },
      { label: "The request is retried from the beginning" },
    ],
    explanation:
      "halt() marks the conn as halted, which tells Phoenix to stop processing the pipeline. No further plugs or the controller action will execute. This is essential for plugs like authentication that need to reject requests early.",
  },
  {
    question: "Why should controllers avoid calling `Repo` directly?",
    options: [
      { label: "Repo only works inside context modules" },
      { label: "It keeps business logic in contexts, making it reusable and testable", correct: true },
      { label: "Controllers can't access the database" },
      { label: "Repo calls are slower from controllers" },
    ],
    explanation:
      "While controllers technically can call Repo, the Phoenix convention is to use context modules as the boundary. This keeps controllers focused on web concerns (params, rendering, redirects) and makes business logic reusable across controllers, LiveViews, and background jobs.",
  },
  {
    question: "In a HEEx template, what does `{@user.name}` do?",
    options: [
      { label: "Outputs the raw HTML without escaping" },
      { label: "Outputs the value with automatic HTML escaping for security", correct: true },
      { label: "Creates a JavaScript variable" },
      { label: "Assigns the value to a template variable" },
    ],
    explanation:
      "HEEx automatically HTML-escapes values output with {@...} to prevent XSS attacks. Characters like < and > are converted to their HTML entities. If you need raw HTML (rarely), you'd use Phoenix.HTML.raw/1, but the default escaping keeps your app secure.",
  },
  {
    question: "What is the `conn` struct in Phoenix?",
    options: [
      { label: "A database connection pool managed by Ecto" },
      { label: "A WebSocket connection for Phoenix Channels" },
      { label: "A %Plug.Conn{} struct that carries request data, response data, and assigns through the pipeline", correct: true },
      { label: "A TCP socket wrapper used internally by Cowboy" },
    ],
    explanation:
      "The conn (%Plug.Conn{}) is the central data structure in the Phoenix request lifecycle. It is created when a request arrives and accumulates data as it flows through the Endpoint, Router, Pipeline, and Controller. It holds the request method, path, headers, params, assigns, and eventually the response status, headers, and body.",
  },
  {
    question: "What is the difference between the Endpoint and the Router in Phoenix?",
    options: [
      { label: "They are the same — 'Endpoint' is just an alias for 'Router'" },
      { label: "The Endpoint handles low-level concerns (logging, static files, parsing) before the Router matches routes to controllers", correct: true },
      { label: "The Router runs first and forwards unmatched routes to the Endpoint" },
      { label: "The Endpoint only handles WebSocket connections while the Router handles HTTP" },
    ],
    explanation:
      "The Endpoint is the very first entry point for every request and handles universal, low-level plugs like Plug.Logger, Plug.Static, Plug.Parsers, and session configuration. Only after the Endpoint's plugs run does the request reach the Router, which then matches URL patterns, applies pipeline-specific plugs, and dispatches to controllers.",
  },
  {
    question: "What does `pipe_through [:browser, :require_auth]` do in a router scope?",
    options: [
      { label: "It runs the :browser and :require_auth pipelines in parallel for performance" },
      { label: "It applies the plugs from both pipelines sequentially — :browser first, then :require_auth — to every route in the scope", correct: true },
      { label: "It lets the request choose which pipeline to use based on the Accept header" },
      { label: "It merges the two pipelines into one and deduplicates any shared plugs" },
    ],
    explanation:
      "When you pass a list to pipe_through, Phoenix runs each pipeline's plugs in order for every route in that scope. The :browser pipeline runs first (adding session, CSRF protection, etc.), then :require_auth runs (checking authentication). This composability lets you layer concerns cleanly without duplicating plug definitions.",
  },
  {
    question: "Why must you call `halt()` after sending a response in a plug that should stop the pipeline?",
    options: [
      { label: "halt() closes the TCP connection to the client" },
      { label: "Without halt(), the conn is not marked as halted and subsequent plugs and the controller action will still execute", correct: true },
      { label: "halt() is required to commit the response headers to the socket" },
      { label: "halt() releases the BEAM process back to the pool" },
    ],
    explanation:
      "Calling send_resp or redirect alone sets the response on the conn but does not prevent further plugs from running. You must call halt() to set conn.halted to true, which signals Phoenix to stop processing the remaining pipeline. Without it, downstream plugs or the controller may try to send a second response, causing an error.",
  },
  {
    question: "Which approach correctly uses `plug` with a guard to apply a function plug only to specific controller actions?",
    options: [
      { label: "`plug :check_owner if action == :edit`" },
      { label: "`plug :check_owner when action in [:edit, :update, :delete]`", correct: true },
      { label: "`plug :check_owner, only: [:edit, :update, :delete]`" },
      { label: "`plug :check_owner, actions: [:edit, :update, :delete]`" },
    ],
    explanation:
      "Phoenix controllers use the `when action in [...]` guard syntax to conditionally apply plugs to specific actions. This is a compile-time macro, not a runtime option. The :only and :actions option styles do not exist for plug guards — those are conventions from other frameworks like Rails.",
  },
  {
    question: "What happens when two scopes in the router define overlapping routes?",
    options: [
      { label: "Phoenix raises a compile-time error for duplicate routes" },
      { label: "The route defined first wins because the router tries matches top-to-bottom", correct: true },
      { label: "The route defined last wins because it overwrites the earlier one" },
      { label: "Both routes execute and their responses are merged" },
    ],
    explanation:
      "The Phoenix router matches routes in the order they are defined, top-to-bottom. The first matching route wins. If you accidentally define overlapping routes, the second one becomes unreachable. This is why more specific routes (like `/users/settings`) should be defined before more general ones (like `/users/:id`).",
  },
  {
    question: "What does `conn.assigns` hold and how do you add values to it?",
    options: [
      { label: "It holds URL query parameters and is populated automatically by Phoenix" },
      { label: "It is a map of user-defined values attached via `assign/3` or `Plug.Conn.assign/3`, accessible in controllers and templates", correct: true },
      { label: "It holds the decoded JSON request body after Plug.Parsers runs" },
      { label: "It stores compile-time configuration values from the Endpoint" },
    ],
    explanation:
      "conn.assigns is a map where plugs, controllers, and other pipeline steps can store arbitrary values using `assign(conn, :key, value)`. These values are then available downstream — in later plugs, controllers, and templates as `@key`. This is the primary mechanism for passing data (like the current user) through the pipeline.",
  },
  {
    question: "In Phoenix, what is the purpose of the `action_fallback` macro in a controller?",
    options: [
      { label: "It defines a default action to run when the URL does not match any route" },
      { label: "It specifies a fallback controller that handles error tuples returned from controller actions", correct: true },
      { label: "It retries the action up to 3 times if an exception is raised" },
      { label: "It redirects to a static error page when the database is unavailable" },
    ],
    explanation:
      "action_fallback designates a controller module (typically a FallbackController) that handles non-conn return values from actions. When an action returns something like {:error, :not_found} or {:error, changeset} instead of a conn, Phoenix calls the fallback controller's call/2 with that value. This is especially common in API controllers to centralize error rendering.",
  },
  {
    question: "What is the key difference between a function plug and a module plug?",
    options: [
      { label: "Function plugs are faster at runtime because they skip the init/1 step" },
      { label: "Module plugs can only be used in the Endpoint, not in controllers" },
      { label: "A function plug is a single function taking conn and opts; a module plug is a module implementing init/1 and call/2, allowing compile-time option processing", correct: true },
      { label: "Function plugs modify the conn in place while module plugs return a new conn" },
    ],
    explanation:
      "A function plug is simply a function with the signature (conn, opts) -> conn, convenient for inline use in controllers. A module plug implements the Plug behaviour with init/1 (which runs at compile time to pre-process options) and call/2 (which runs at request time). Module plugs are more reusable and can be shared across controllers and router pipelines.",
  },
  {
    question: "What does the `:put_root_layout` plug do in the browser pipeline?",
    options: [
      { label: "It sets the CSS framework used by all templates in the scope" },
      { label: "It assigns the outermost layout template that wraps all rendered views in that pipeline", correct: true },
      { label: "It configures the root route ('/') to render a specific layout" },
      { label: "It preloads layout assets like JavaScript bundles at compile time" },
    ],
    explanation:
      "The :put_root_layout plug sets the top-level layout that wraps the response. In a typical Phoenix app, the root layout (e.g., Layouts.root) contains the HTML skeleton — doctype, head, body tags, and script includes — while the inner app layout handles page-level structure. This plug ensures every response in the pipeline gets wrapped in the correct outer shell.",
  },
];

export default questions;
