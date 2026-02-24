import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Conn Is Immutable — Plugs Return a New Conn",
    description:
      "The conn struct in Phoenix is immutable like all Elixir data. Every plug in the pipeline receives a conn, transforms it, and returns a new conn. If you forget to return the modified conn (or accidentally return the original), your changes are silently lost. This is a common mistake when writing custom plugs.",
    code: `# Wrong: modifying conn but not returning it
def call(conn, _opts) do
  Plug.Conn.assign(conn, :current_user, get_user(conn))
  # Returns the original conn — the assign is lost!
end

# Correct: return the modified conn
def call(conn, _opts) do
  conn
  |> Plug.Conn.assign(:current_user, get_user(conn))
end`,
  },
  {
    title: "Template Assigns Must Be Explicitly Passed",
    description:
      "Unlike some frameworks that automatically expose all controller variables to templates, Phoenix requires you to explicitly pass data as assigns. Only values set via assign/3, or passed in the render/3 call, are available in the template. Forgetting to pass an assign results in a KeyError or an undefined variable error at render time.",
    code: `# In your controller — all assigns must be explicit
def show(conn, %{"id" => id}) do
  user = Users.get_user!(id)
  posts = Posts.list_posts_for_user(user)

  conn
  |> assign(:user, user)
  |> assign(:posts, posts)
  |> render(:show)

  # Or pass assigns inline:
  # render(conn, :show, user: user, posts: posts)
end

# In your template: @user and @posts are available
# But @comments would raise — it was never assigned`,
  },
  {
    title: "Router Pipelines Execute in Order",
    description:
      "Pipelines in the Phoenix router are executed in the order they appear in the scope. Each pipeline is a sequence of plugs, and within a pipeline, plugs run top to bottom. If you pipe_through multiple pipelines, the first pipeline runs completely before the second starts. Getting the order wrong can cause authentication checks to run after actions that assume a user exists.",
    code: `# Pipelines run in listed order
scope "/", MyAppWeb do
  pipe_through [:browser, :auth, :admin]

  # 1. :browser plugs run first (session, flash, etc.)
  # 2. :auth plugs run second (load current user)
  # 3. :admin plugs run third (check if user is admin)
  get "/admin/dashboard", AdminController, :dashboard
end

# Wrong order would cause issues:
# pipe_through [:admin, :auth, :browser]
# :admin checks for admin before :auth even loads the user!`,
  },
  {
    title: "halt/1 Stops the Pipeline But You Must Return Conn",
    description:
      "Calling Plug.Conn.halt/1 in a plug prevents downstream plugs from executing, but it does not immediately stop your function. You must still return the halted conn. If you send a response and forget to halt, downstream plugs may try to send a second response, causing an 'already sent' error.",
    code: `# Wrong: sending a response without halting
def call(conn, _opts) do
  if is_nil(conn.assigns[:current_user]) do
    conn
    |> put_status(:unauthorized)
    |> json(%{error: "Not authenticated"})
    # Missing halt! Downstream plugs still execute
  else
    conn
  end
end

# Correct: halt after sending the response
def call(conn, _opts) do
  if is_nil(conn.assigns[:current_user]) do
    conn
    |> put_status(:unauthorized)
    |> json(%{error: "Not authenticated"})
    |> halt()
  else
    conn
  end
end`,
  },
];

export default gotchas;
