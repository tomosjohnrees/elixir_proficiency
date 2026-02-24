import type { TopicContent } from "@/lib/types";
import questions from "./questions/phoenix-basics";
import gotchas from "./gotchas/phoenix-basics";
import Animation09PhoenixRequest from "@/components/animations/Animation09PhoenixRequest";
import Animation32PlugHalt from "@/components/animations/Animation32PlugHalt";

const phoenixBasics: TopicContent = {
  meta: {
    slug: "phoenix-basics",
    title: "Phoenix Basics",
    description: "Router, controllers, views, and templates",
    number: 22,
    active: true,
  },

  eli5: {
    analogyTitle: "The Restaurant",
    analogy:
      "Think of a Phoenix app as a well-run restaurant. A customer walks in and the host checks the reservation list to figure out where they should go — that's the router. The host sends them to the right waiter, who is the controller. The waiter takes the order, talks to the kitchen (your business logic and database), and then hands the finished plate to a presenter who arranges it beautifully — that's the view and template working together.",
    items: [
      { label: "Router", description: "The host at the front door. Every request comes in and the router matches the URL and HTTP method to decide which controller should handle it." },
      { label: "Controller", description: "The waiter. It receives the request, coordinates with the kitchen (your context modules and database), and decides what response to send back." },
      { label: "View & Template", description: "The presentation team. The view prepares the data and the template arranges it into HTML (or JSON). Together they make the response look great." },
      { label: "Plug", description: "The checkpoints along the way. Before a request reaches the controller, it passes through a pipeline of plugs — each one can inspect, transform, or reject the request. Think of them as security checks and prep stations." },
    ],
    keyTakeaways: [
      "Phoenix follows a request pipeline: Endpoint -> Router -> Pipeline -> Controller -> View/Template.",
      "The router maps HTTP verbs and URL paths to controller actions using a clean, declarative syntax.",
      "Controllers are thin — they coordinate between the request and your business logic (contexts), not contain the logic themselves.",
      "Plugs are composable middleware that transform the connection (conn) as it flows through the pipeline.",
      "Contexts are the boundary modules that organize your business logic and keep controllers focused on web concerns.",
    ],
  },

  visuals: {
    animations: [
      { component: Animation09PhoenixRequest, duration: 19 },
      { component: Animation32PlugHalt, duration: 16 },
    ],
    dataTypes: [
      { name: "Endpoint", color: "#6b7280", examples: ["plug Plug.Logger", "plug Plug.Parsers", "plug MyAppWeb.Router"], description: "The entry point for every request. Handles low-level concerns like logging, static files, and parsing before passing to the router." },
      { name: "Router", color: "#2563eb", examples: ["get \"/users\", UserController, :index", "resources \"/posts\", PostController", "pipe_through :browser"], description: "Maps URL patterns and HTTP methods to controller actions. Groups routes into scopes with shared pipelines." },
      { name: "Pipeline", color: "#7c3aed", examples: ["pipeline :browser do", "plug :accepts, [\"html\"]", "plug :fetch_session", "plug :protect_from_forgery"], description: "A named group of plugs applied to routes. :browser adds session and CSRF protection; :api adds JSON acceptance." },
      { name: "Controller", color: "#d97706", examples: ["def index(conn, _params)", "def show(conn, %{\"id\" => id})", "render(conn, :index, users: users)"], description: "Handles requests by calling context functions and rendering responses. Each action receives a conn and params." },
      { name: "Component", color: "#059669", examples: ["def render(assigns)", "~H\"\"\"<div>...</div>\"\"\"", "attr :name, :string", "slot :inner_block"], description: "Function components that render HTML using HEEx templates. They declare attributes and slots for a clean component API." },
      { name: "Conn", color: "#e11d48", examples: ["%Plug.Conn{}", "conn.params", "conn.assigns", "put_flash(conn, :info, msg)"], description: "The connection struct that flows through the entire pipeline. It carries the request data, response, and assigns." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "The Request Lifecycle",
        prose: [
          "Every HTTP request in Phoenix follows a clear path: it enters through the Endpoint, flows through the Router (which selects a pipeline of Plugs), reaches a Controller action, and produces a response — typically by rendering a template through a component.",
          "The central data structure is `%Plug.Conn{}` — the connection struct. It starts with request information (method, path, headers, params) and gets enriched at each step. By the time it reaches your controller, it has parsed parameters, session data, and any values added by plugs. Your controller adds response data, and the template turns it into HTML or JSON.",
        ],
        code: {
          title: "The flow of a request",
          code: `# 1. Request arrives at the Endpoint (lib/my_app_web/endpoint.ex)
# 2. Router matches the path (lib/my_app_web/router.ex)
# 3. Pipeline plugs process the conn
# 4. Controller action handles the request

# In the router:
get "/users/:id", UserController, :show

# In the controller:
def show(conn, %{"id" => id}) do
  user = Accounts.get_user!(id)
  render(conn, :show, user: user)
end

# The conn flows like this:
# %Plug.Conn{method: "GET", path_info: ["users", "42"]}
# -> Router matches to UserController.show
# -> Pipeline adds session, CSRF token, etc.
# -> Controller fetches data, calls render
# -> Template produces HTML response`,
          output: "200 OK — HTML response",
        },
      },
      {
        title: "The Router",
        prose: [
          "The router is where you define all your application's routes. You use macros like `get`, `post`, `put`, `patch`, and `delete` to map HTTP verb + path combinations to controller actions. The `resources` macro generates all standard RESTful routes in one line.",
          "Routes are organized into scopes, and each scope can use `pipe_through` to apply a named pipeline. The `:browser` pipeline adds HTML-specific plugs (sessions, CSRF protection, flash messages), while `:api` adds JSON-specific ones.",
        ],
        code: {
          title: "Defining routes",
          code: `defmodule MyAppWeb.Router do
  use MyAppWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {MyAppWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", MyAppWeb do
    pipe_through :browser

    get "/", PageController, :home
    resources "/users", UserController
    # Generates:
    #   GET    /users          -> UserController.index
    #   GET    /users/new      -> UserController.new
    #   POST   /users          -> UserController.create
    #   GET    /users/:id      -> UserController.show
    #   GET    /users/:id/edit -> UserController.edit
    #   PUT    /users/:id      -> UserController.update
    #   DELETE /users/:id      -> UserController.delete
  end

  scope "/api", MyAppWeb.API do
    pipe_through :api

    resources "/posts", PostController, only: [:index, :show]
  end
end`,
          output: "Routes compiled successfully",
        },
      },
      {
        title: "Controllers",
        prose: [
          "Controllers are modules where each public function is an \"action\" that handles a specific request. Every action receives two arguments: the `conn` struct and a `params` map. The controller's job is to coordinate — call context functions for business logic, then render a response.",
          "Phoenix encourages thin controllers. Instead of putting database queries or business rules directly in controller actions, you delegate to context modules (like `Accounts` or `Blog`). The controller just bridges the web layer and the business layer.",
        ],
        code: {
          title: "A typical controller",
          code: `defmodule MyAppWeb.UserController do
  use MyAppWeb, :controller

  alias MyApp.Accounts

  def index(conn, _params) do
    users = Accounts.list_users()
    render(conn, :index, users: users)
  end

  def show(conn, %{"id" => id}) do
    user = Accounts.get_user!(id)
    render(conn, :show, user: user)
  end

  def create(conn, %{"user" => user_params}) do
    case Accounts.create_user(user_params) do
      {:ok, user} ->
        conn
        |> put_flash(:info, "User created successfully.")
        |> redirect(to: ~p"/users/\#{user}")

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, :new, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Accounts.get_user!(id)
    {:ok, _user} = Accounts.delete_user(user)

    conn
    |> put_flash(:info, "User deleted.")
    |> redirect(to: ~p"/users")
  end
end`,
          output: "User created successfully.",
        },
      },
      {
        title: "Components and HEEx Templates",
        prose: [
          "Phoenix uses function components and HEEx (HTML + Embedded Elixir) templates for rendering. A function component is just a function that takes an `assigns` map and returns a HEEx template. You declare expected attributes with `attr` and slots with `slot`.",
          "HEEx templates use `{@variable}` for outputting values (auto-escaped for security), `{expression}` for arbitrary expressions, and special attributes like `:if`, `:for`, and `:let` for control flow directly in the markup.",
        ],
        code: {
          title: "Function components and HEEx",
          code: `defmodule MyAppWeb.UserHTML do
  use MyAppWeb, :html

  # Inline template with ~H sigil
  def greeting(assigns) do
    ~H"""
    <h1>Hello, {@name}!</h1>
    <p :if={@admin}>You have admin access.</p>
    """
  end

  # Component with declared attributes
  attr :users, :list, required: true

  def user_list(assigns) do
    ~H"""
    <ul>
      <li :for={user <- @users}>
        {user.name} — {user.email}
      </li>
    </ul>
    """
  end

  # Calling components from templates
  def index(assigns) do
    ~H"""
    <.greeting name="Alice" admin={true} />
    <.user_list users={@users} />
    """
  end
end`,
          output: "<h1>Hello, Alice!</h1><p>You have admin access.</p>",
        },
      },
      {
        title: "Plugs",
        prose: [
          "Plugs are the building blocks of Phoenix's request pipeline. A plug is either a function that takes and returns a `conn`, or a module that implements `init/1` and `call/2`. Every step in request processing — parsing, authentication, logging — is a plug.",
          "You can write custom plugs to handle cross-cutting concerns like authentication, authorization, rate limiting, or request logging. Module plugs are great for reusable middleware, while function plugs work well for simple, inline transformations.",
        ],
        code: {
          title: "Writing custom plugs",
          code: `# Function plug — simple inline version
defmodule MyAppWeb.UserController do
  use MyAppWeb, :controller

  plug :require_admin when action in [:delete]

  defp require_admin(conn, _opts) do
    if conn.assigns[:current_user] && conn.assigns.current_user.admin do
      conn
    else
      conn
      |> put_flash(:error, "Unauthorized")
      |> redirect(to: ~p"/")
      |> halt()
    end
  end
end

# Module plug — reusable across the app
defmodule MyAppWeb.Plugs.RequireAuth do
  import Plug.Conn
  import Phoenix.Controller

  def init(opts), do: opts

  def call(conn, _opts) do
    if conn.assigns[:current_user] do
      conn
    else
      conn
      |> put_flash(:error, "You must be logged in.")
      |> redirect(to: "/login")
      |> halt()
    end
  end
end

# Use in router pipeline:
# plug MyAppWeb.Plugs.RequireAuth`,
          output: "Plug pipeline configured",
        },
      },
      {
        title: "Contexts",
        prose: [
          "Contexts are Elixir modules that group related business logic and data access. When you run `mix phx.gen.context Accounts User users name:string email:string`, Phoenix generates an `Accounts` context with functions like `list_users/0`, `get_user!/1`, `create_user/1`, etc.",
          "The context pattern keeps your controllers thin and your business logic testable. Controllers call context functions — they never touch `Repo` directly. This boundary makes it easy to reuse logic across web controllers, LiveViews, background jobs, and API endpoints.",
        ],
        code: {
          title: "A context module",
          code: `defmodule MyApp.Accounts do
  import Ecto.Query
  alias MyApp.Repo
  alias MyApp.Accounts.User

  def list_users do
    Repo.all(User)
  end

  def get_user!(id) do
    Repo.get!(User, id)
  end

  def create_user(attrs \\\\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  def change_user(%User{} = user, attrs \\\\ %{}) do
    User.changeset(user, attrs)
  end
end`,
          output: "{:ok, %User{name: \"Alice\", email: \"alice@example.com\"}}",
        },
      },
    ],
  },

  gotchas: { items: gotchas },

  quiz: {
    questions,
  },

  practice: {
    problems: [
      {
        title: "Define Routes for a Blog",
        difficulty: "beginner",
        prompt:
          "Write a Phoenix router module for a blog application with these routes:\n- A homepage at `/` handled by `PageController.home`\n- Full CRUD resources for `/posts` handled by `PostController`\n- An API scope at `/api/v1` with JSON-only routes for listing and showing posts (no create/edit/delete)\n\nUse the `:browser` and `:api` pipelines appropriately.",
        hints: [
          { text: "Use `scope` blocks to group routes with different pipelines." },
          { text: "The `resources` macro accepts an `:only` option to limit which actions are generated." },
          { text: "Remember to `pipe_through` the appropriate pipeline in each scope." },
        ],
        solution: `defmodule MyAppWeb.Router do
  use MyAppWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {MyAppWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", MyAppWeb do
    pipe_through :browser

    get "/", PageController, :home
    resources "/posts", PostController
  end

  scope "/api/v1", MyAppWeb.API do
    pipe_through :api

    resources "/posts", PostController, only: [:index, :show]
  end
end`,
        walkthrough: [
          "We define two pipelines: :browser for HTML responses with session and CSRF protection, and :api for JSON responses.",
          "The root scope uses :browser and includes the homepage route plus full CRUD resources for posts.",
          "The API scope is namespaced under /api/v1 and uses a different module namespace (MyAppWeb.API) to keep API controllers separate.",
          "The :only option limits the API to just :index and :show — read-only access. This generates GET /api/v1/posts and GET /api/v1/posts/:id.",
        ],
      },
      {
        title: "Build a Controller with Error Handling",
        difficulty: "intermediate",
        prompt:
          "Write a `PostController` with `index`, `show`, and `create` actions. The `create` action should:\n- Accept nested params under the \"post\" key\n- On success: set a flash message and redirect to the new post's show page\n- On failure: re-render the new form with the invalid changeset\n- Use a context module `Blog` for all data access\n\nAlso write a function plug `ensure_author` that checks `conn.assigns.current_user` exists and halts with a 403 if not. Apply it only to the `create` action.",
        hints: [
          { text: "Use `plug :ensure_author when action in [:create]` to scope the plug." },
          { text: "Pattern match on the result of `Blog.create_post/1` — it returns {:ok, post} or {:error, changeset}." },
          { text: "Use `put_status(conn, :forbidden)` and `halt()` for the unauthorized case." },
        ],
        solution: `defmodule MyAppWeb.PostController do
  use MyAppWeb, :controller

  alias MyApp.Blog

  plug :ensure_author when action in [:create]

  def index(conn, _params) do
    posts = Blog.list_posts()
    render(conn, :index, posts: posts)
  end

  def show(conn, %{"id" => id}) do
    post = Blog.get_post!(id)
    render(conn, :show, post: post)
  end

  def new(conn, _params) do
    changeset = Blog.change_post()
    render(conn, :new, changeset: changeset)
  end

  def create(conn, %{"post" => post_params}) do
    case Blog.create_post(post_params) do
      {:ok, post} ->
        conn
        |> put_flash(:info, "Post created successfully.")
        |> redirect(to: ~p"/posts/\#{post}")

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, :new, changeset: changeset)
    end
  end

  defp ensure_author(conn, _opts) do
    if conn.assigns[:current_user] do
      conn
    else
      conn
      |> put_status(:forbidden)
      |> put_view(MyAppWeb.ErrorHTML)
      |> render(:"403")
      |> halt()
    end
  end
end`,
        walkthrough: [
          "The `plug :ensure_author when action in [:create]` line applies our auth check only before `create` — index and show remain public.",
          "The `ensure_author` plug checks for a `:current_user` in assigns. If missing, it sets a 403 status, renders an error page, and calls `halt()` to stop the pipeline.",
          "In `create`, we pattern match on the Blog context's return value. The {:ok, post} branch flashes a success message and redirects. The {:error, changeset} branch re-renders the form so the user sees validation errors.",
          "The `~p` sigil generates a verified route path — the compiler will warn if the route doesn't exist.",
        ],
      },
      {
        title: "Custom Plug Pipeline",
        difficulty: "advanced",
        prompt:
          "Create a reusable module plug `RateLimit` that:\n- Accepts an option `:max_requests` (default 100) and `:window_seconds` (default 60)\n- Uses the process dictionary (for simplicity) to track request counts per client IP\n- If the limit is exceeded, responds with 429 Too Many Requests and halts\n- Otherwise, passes the request through and adds an `X-RateLimit-Remaining` response header\n\nThen show how to use this plug in a router pipeline.",
        hints: [
          { text: "In `init/1`, merge the options with defaults and return them. In `call/2`, receive them." },
          { text: "Use `conn.remote_ip |> :inet.ntoa() |> to_string()` to get the client IP as a string." },
          { text: "Use `put_resp_header/3` to add the remaining count header." },
          { text: "Use `send_resp/3` with status 429 for rate-limited responses." },
        ],
        solution: `defmodule MyAppWeb.Plugs.RateLimit do
  import Plug.Conn

  @default_opts %{max_requests: 100, window_seconds: 60}

  def init(opts) do
    Map.merge(@default_opts, Map.new(opts))
  end

  def call(conn, %{max_requests: max, window_seconds: window}) do
    ip = conn.remote_ip |> :inet.ntoa() |> to_string()
    key = "rate_limit:\#{ip}"
    now = System.monotonic_time(:second)

    {count, start_time} = Process.get(key, {0, now})

    {count, start_time} =
      if now - start_time >= window do
        {0, now}
      else
        {count, start_time}
      end

    count = count + 1
    Process.put(key, {count, start_time})

    remaining = max(max - count, 0)

    if count > max do
      conn
      |> put_resp_header("x-ratelimit-remaining", "0")
      |> send_resp(429, "Too Many Requests")
      |> halt()
    else
      conn
      |> put_resp_header("x-ratelimit-remaining", Integer.to_string(remaining))
    end
  end
end

# Usage in router:
# pipeline :rate_limited do
#   plug MyAppWeb.Plugs.RateLimit, max_requests: 30, window_seconds: 60
# end
#
# scope "/api", MyAppWeb do
#   pipe_through [:api, :rate_limited]
#   resources "/posts", PostController
# end`,
        walkthrough: [
          "`init/1` runs at compile time — we merge user options with defaults so `call/2` always has both values.",
          "We convert the remote_ip tuple to a string with `:inet.ntoa/1` and build a unique key per client.",
          "The process dictionary tracks {count, window_start_time} per IP. If the window has elapsed, we reset the counter.",
          "If count exceeds the max, we send a 429 response with the rate limit header and halt the pipeline.",
          "Otherwise, we add the `X-RateLimit-Remaining` header and let the request continue through the pipeline.",
          "In production you'd use ETS or Redis instead of the process dictionary, since each request may be handled by a different process. This simplified version demonstrates the plug pattern.",
        ],
      },
    ],
  },
};

export default phoenixBasics;
