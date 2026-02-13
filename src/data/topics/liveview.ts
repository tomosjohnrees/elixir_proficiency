import type { TopicContent } from "@/lib/types";
import Animation04LiveViewLifecycle from "@/components/animations/Animation04LiveViewLifecycle";

const liveview: TopicContent = {
  meta: {
    slug: "liveview",
    title: "LiveView",
    description: "Real-time server-rendered UIs with LiveView",
    number: 23,
    active: true,
  },

  eli5: {
    analogyTitle: "The Puppet Show",
    analogy:
      "Imagine a puppet show where the puppeteer sits backstage (the server) controlling every puppet on stage (the UI). When the audience shouts requests — 'make the puppet wave!' — the puppeteer moves the strings and the audience instantly sees the puppet wave. The audience never touches the puppets directly. They just see the result of the puppeteer's work, updated in real time.",
    items: [
      { label: "The puppeteer", description: "Your LiveView process on the server. It holds all the state, handles every event, and decides what the audience sees. All the logic lives here." },
      { label: "The strings", description: "A persistent WebSocket connection between the browser and the server. It stays open so updates can flow back and forth instantly — no page reloads needed." },
      { label: "The stage", description: "The HTML in the browser. The server sends only the parts that changed, and a small JavaScript client patches the page. The audience sees smooth, instant updates." },
      { label: "The audience shouts", description: "User interactions — clicks, form submissions, key presses. These travel over the WebSocket to the server, which updates its state and pushes new HTML back." },
    ],
    keyTakeaways: [
      "LiveView renders HTML on the server and pushes updates over a WebSocket — no JavaScript framework needed.",
      "State lives in a server process, not in the browser. Every interaction triggers a server-side event handler.",
      "Only the parts of the page that changed are sent over the wire, making updates extremely efficient.",
      "The lifecycle is: mount -> render -> handle events -> re-render. The assign/socket pattern drives everything.",
      "LiveView gives you real-time features (live updates, form validation, presence) with pure Elixir — no custom JavaScript required.",
    ],
  },

  visuals: {
    animation: Animation04LiveViewLifecycle,
    animationDuration: 20,
    dataTypes: [
      { name: "Socket", color: "#2563eb", examples: ["socket.assigns", "assign(socket, :count, 0)", "assign(socket, key: val)"], description: "The LiveView equivalent of conn. It carries assigns (state) that your template renders. Updating assigns triggers a re-render." },
      { name: "mount/3", color: "#059669", examples: ["def mount(params, session, socket)", "assign(socket, count: 0)", "{:ok, socket}"], description: "Called once when the LiveView starts. Set up initial state by assigning values to the socket." },
      { name: "handle_event/3", color: "#d97706", examples: ["def handle_event(\"inc\", params, socket)", "phx-click=\"inc\"", "{:noreply, socket}"], description: "Handles user interactions from the browser. Receives the event name, payload, and socket. Returns updated socket." },
      { name: "handle_info/2", color: "#e11d48", examples: ["def handle_info(:tick, socket)", "send(self(), :tick)", "Process.send_after(self(), :tick, 1000)"], description: "Handles messages from other processes. Used for real-time updates, PubSub broadcasts, and scheduled work." },
      { name: "HEEx Template", color: "#7c3aed", examples: ["~H\"\"\"<div>{@count}</div>\"\"\"", "phx-click", "phx-submit", "phx-change"], description: "HTML + Embedded Elixir templates with special phx-* attributes for binding events to server-side handlers." },
      { name: "Live Component", color: "#0891b2", examples: ["<.live_component module={MyComponent}", "update/2", "handle_event/3"], description: "Stateful components within a LiveView. They have their own assigns, lifecycle, and event handlers." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "How LiveView Works",
        prose: [
          "When a user visits a LiveView page, two things happen. First, a regular HTTP request renders the initial HTML — this means search engines and users see content immediately, with no loading spinner. Then, the browser establishes a WebSocket connection and a LiveView process is spawned on the server to manage that user's session.",
          "From that point on, all interactions happen over the WebSocket. When the user clicks a button or submits a form, an event travels to the server process. The process updates its state (assigns), re-renders the template, and Phoenix calculates a minimal diff — only the parts that actually changed are sent back to the browser. A tiny JavaScript client patches the DOM.",
          "Because state lives on the server, there's no client-side state management to worry about. No Redux, no React state, no sync issues. Your Elixir code is the single source of truth.",
        ],
        code: {
          title: "A minimal LiveView",
          code: `defmodule MyAppWeb.CounterLive do
  use MyAppWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, assign(socket, count: 0)}
  end

  def render(assigns) do
    ~H"""
    <div>
      <h1>Count: {@count}</h1>
      <button phx-click="increment">+</button>
      <button phx-click="decrement">-</button>
    </div>
    """
  end

  def handle_event("increment", _params, socket) do
    {:noreply, update(socket, :count, &(&1 + 1))}
  end

  def handle_event("decrement", _params, socket) do
    {:noreply, update(socket, :count, &(&1 - 1))}
  end
end`,
          output: "Count: 0 [+] [-]",
        },
      },
      {
        title: "Mount, Assigns, and the Socket",
        prose: [
          "The `mount/3` callback is where you set up your LiveView's initial state. It receives URL params, session data, and the socket. You return `{:ok, socket}` with your initial assigns attached. Assigns are the data your template can access — think of them as the LiveView's state.",
          "A key detail: `mount` is called twice — once for the initial HTTP render (where `connected?(socket)` returns false) and once when the WebSocket connects (where it returns true). This lets you render static content immediately and defer expensive operations to the connected mount.",
        ],
        code: {
          title: "Mount and assigns",
          code: `def mount(%{"id" => id}, _session, socket) do
  # Always set initial assigns for the static render
  socket = assign(socket, loading: true, user: nil)

  # Only fetch data when the WebSocket is connected
  socket =
    if connected?(socket) do
      user = Accounts.get_user!(id)
      assign(socket, loading: false, user: user)
    else
      socket
    end

  {:ok, socket}
end

def render(assigns) do
  ~H"""
  <div :if={@loading}>Loading...</div>
  <div :if={!@loading}>
    <h1>{@user.name}</h1>
    <p>{@user.email}</p>
  </div>
  """
end

# You can also assign multiple values at once
socket = assign(socket, count: 0, page: 1, filters: %{})

# Or use update/3 to transform an existing assign
socket = update(socket, :count, &(&1 + 1))`,
          output: "<h1>Alice</h1><p>alice@example.com</p>",
        },
      },
      {
        title: "Handling Events",
        prose: [
          "User interactions in LiveView are handled through `phx-*` bindings in your template and `handle_event/3` callbacks in your module. The most common bindings are `phx-click`, `phx-submit` (forms), `phx-change` (live form validation), and `phx-keydown`.",
          "Each `handle_event/3` receives the event name (a string), the event payload (params from the form or value bindings), and the socket. You update assigns and return `{:noreply, socket}`. Phoenix diffs the re-rendered template and pushes only the changes.",
        ],
        code: {
          title: "Event handling patterns",
          code: `# Click events
def render(assigns) do
  ~H"""
  <button phx-click="delete" phx-value-id={@user.id}>Delete</button>
  """
end

def handle_event("delete", %{"id" => id}, socket) do
  Accounts.delete_user!(id)
  {:noreply, assign(socket, users: Accounts.list_users())}
end

# Form events
def render(assigns) do
  ~H"""
  <.form for={@form} phx-change="validate" phx-submit="save">
    <.input field={@form[:name]} label="Name" />
    <.input field={@form[:email]} label="Email" />
    <button type="submit">Save</button>
  </.form>
  """
end

def handle_event("validate", %{"user" => params}, socket) do
  changeset = Accounts.change_user(%User{}, params)
  {:noreply, assign(socket, form: to_form(changeset, action: :validate))}
end

def handle_event("save", %{"user" => params}, socket) do
  case Accounts.create_user(params) do
    {:ok, user} ->
      {:noreply,
       socket
       |> put_flash(:info, "User created!")
       |> push_navigate(to: ~p"/users/\#{user}")}

    {:error, changeset} ->
      {:noreply, assign(socket, form: to_form(changeset, action: :validate))}
  end
end`,
          output: "User created!",
        },
      },
      {
        title: "Real-Time with handle_info and PubSub",
        prose: [
          "Because a LiveView is a process, it can receive messages from anywhere in your system using `handle_info/2`. This is the foundation of real-time features. You can subscribe to Phoenix.PubSub topics, set up timers with `Process.send_after/3`, or receive messages from other processes.",
          "The PubSub pattern is especially powerful: one user's action can broadcast to all connected LiveViews. For example, when a user creates a post, you broadcast the event, and every user viewing the post list sees it appear instantly — no polling required.",
        ],
        code: {
          title: "Real-time updates",
          code: `defmodule MyAppWeb.DashboardLive do
  use MyAppWeb, :live_view

  @topic "dashboard:updates"

  def mount(_params, _session, socket) do
    # Subscribe when WebSocket connects
    if connected?(socket) do
      Phoenix.PubSub.subscribe(MyApp.PubSub, @topic)
      # Set up a recurring timer
      Process.send_after(self(), :refresh_stats, 5_000)
    end

    {:ok, assign(socket, stats: load_stats(), messages: [])}
  end

  # Handle PubSub broadcasts
  def handle_info({:new_message, message}, socket) do
    messages = [message | socket.assigns.messages] |> Enum.take(50)
    {:noreply, assign(socket, messages: messages)}
  end

  # Handle timer
  def handle_info(:refresh_stats, socket) do
    Process.send_after(self(), :refresh_stats, 5_000)
    {:noreply, assign(socket, stats: load_stats())}
  end

  defp load_stats, do: %{users: 42, posts: 128}
end

# Broadcasting from anywhere in your app:
Phoenix.PubSub.broadcast(MyApp.PubSub, "dashboard:updates",
  {:new_message, %{text: "Hello!", user: "Alice"}})`,
          output: "Real-time message received",
        },
      },
      {
        title: "Live Components",
        prose: [
          "Live components are stateful, reusable pieces within a LiveView. They have their own assigns, update lifecycle, and can handle their own events. Use them when a part of your UI has its own state that's independent from the parent LiveView.",
          "A live component must implement `render/1` and usually `update/2` (which receives new assigns from the parent). You render them with `<.live_component>` and must provide a unique `id`. Events in a live component are handled locally unless you explicitly send messages to the parent.",
        ],
        code: {
          title: "Stateful live component",
          code: `defmodule MyAppWeb.TodoItemComponent do
  use MyAppWeb, :live_component

  def update(assigns, socket) do
    {:ok, assign(socket, assigns)}
  end

  def render(assigns) do
    ~H"""
    <div class="todo-item">
      <span class={if @todo.done, do: "line-through"}>{@todo.text}</span>
      <button phx-click="toggle" phx-target={@myself}>Toggle</button>
    </div>
    """
  end

  def handle_event("toggle", _params, socket) do
    todo = socket.assigns.todo
    updated = Todos.toggle(todo)
    # Notify the parent LiveView
    send(self(), {:todo_updated, updated})
    {:noreply, assign(socket, todo: updated)}
  end
end

# Usage in parent LiveView template:
# <.live_component
#   module={MyAppWeb.TodoItemComponent}
#   id={"todo-\#{todo.id}"}
#   todo={todo}
# />`,
          output: "[ ] Buy groceries [Toggle]",
        },
      },
      {
        title: "Navigation and Lifecycle",
        prose: [
          "LiveView supports client-side navigation without full page reloads using `push_navigate/2` (navigates to a new LiveView) and `push_patch/2` (stays in the same LiveView but updates the URL and params). Patches trigger `handle_params/3`, which lets you react to URL changes.",
          "The `handle_params/3` callback is called after mount and on every patch. It's the right place to load data based on URL parameters — for pagination, filtering, or showing different records. This keeps your URLs bookmarkable and shareable while maintaining the real-time connection.",
        ],
        code: {
          title: "Navigation and params",
          code: `defmodule MyAppWeb.UserListLive do
  use MyAppWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, socket}
  end

  # Called after mount AND on every URL patch
  def handle_params(params, _uri, socket) do
    page = String.to_integer(params["page"] || "1")
    users = Accounts.list_users(page: page, per_page: 20)

    {:noreply, assign(socket, users: users, page: page)}
  end

  def render(assigns) do
    ~H"""
    <ul>
      <li :for={user <- @users}>{user.name}</li>
    </ul>

    <nav>
      <.link patch={~p"/users?page=\#{@page - 1}"} :if={@page > 1}>
        Previous
      </.link>
      <.link patch={~p"/users?page=\#{@page + 1}"}>
        Next
      </.link>
    </nav>
    """
  end
end

# In the router:
# live "/users", UserListLive`,
          output: "Page 1: Alice, Bob, Charlie...",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "How many times is `mount/3` called for a LiveView page visit?",
        options: [
          { label: "Once" },
          { label: "Twice — once for the static HTTP render, once when the WebSocket connects", correct: true },
          { label: "Three times — HTTP, WebSocket, and template render" },
          { label: "It depends on the number of assigns" },
        ],
        explanation:
          "mount is called twice: first during the initial HTTP request (to render static HTML for fast first paint and SEO), then again when the WebSocket connects. Use `connected?(socket)` to distinguish between the two and defer expensive work to the connected phase.",
      },
      {
        question: "Where does LiveView state live?",
        options: [
          { label: "In the browser's localStorage" },
          { label: "In a server-side process (the socket's assigns)", correct: true },
          { label: "In a shared Redis store" },
          { label: "Split between client and server" },
        ],
        explanation:
          "All LiveView state lives on the server in the LiveView process's socket assigns. The browser only has the rendered HTML. This eliminates client-side state management complexity but means each connected user has a server process.",
      },
      {
        question: "What does `phx-target={@myself}` do on an event binding?",
        options: [
          { label: "Sends the event to the parent LiveView" },
          { label: "Sends the event to the current live component instead of the parent", correct: true },
          { label: "Broadcasts the event to all connected users" },
          { label: "Prevents the event from bubbling up" },
        ],
        explanation:
          "By default, events in a live component bubble up to the parent LiveView. `phx-target={@myself}` tells Phoenix to route the event to the component's own `handle_event/3` callback instead. This keeps component logic self-contained.",
      },
      {
        question: "What is the difference between `push_navigate` and `push_patch`?",
        options: [
          { label: "push_navigate reloads the page; push_patch doesn't" },
          { label: "push_navigate mounts a new LiveView; push_patch stays in the same one and triggers handle_params", correct: true },
          { label: "They are identical — just aliases" },
          { label: "push_patch works with forms; push_navigate works with links" },
        ],
        explanation:
          "push_patch stays in the same LiveView process and triggers handle_params/3 — great for pagination, sorting, and filtering. push_navigate tears down the current LiveView and mounts a new one — use it when navigating to a different page entirely.",
      },
      {
        question: "How does LiveView achieve real-time updates from external events (like another user creating a post)?",
        options: [
          { label: "It polls the database every second" },
          { label: "The browser listens for Server-Sent Events" },
          { label: "PubSub broadcasts trigger handle_info/2 in subscribed LiveViews", correct: true },
          { label: "LiveView automatically detects database changes" },
        ],
        explanation:
          "LiveView processes can subscribe to Phoenix.PubSub topics. When another part of your app broadcasts to that topic, every subscribed LiveView receives the message in handle_info/2, updates its assigns, and pushes the new HTML to the browser. There's no polling and no magic — just Elixir message passing.",
      },
      {
        question: "What does `connected?(socket)` return during the initial static HTTP render?",
        options: [
          { label: "true — the connection is established before mount runs" },
          { label: "nil — it is not available during the first render" },
          { label: "false — the WebSocket has not been established yet", correct: true },
          { label: "It raises an error because there is no WebSocket during static render" },
        ],
        explanation:
          "During the initial HTTP render, `connected?(socket)` returns false because the WebSocket connection has not yet been established. This is important because it lets you defer expensive operations (like database queries or PubSub subscriptions) to the connected mount, while still rendering meaningful placeholder content for the static HTML response.",
      },
      {
        question: "What is the purpose of `temporary_assigns` in a LiveView?",
        options: [
          { label: "To store assigns that expire after a timeout" },
          { label: "To reset specified assigns to a default value after each render, freeing memory", correct: true },
          { label: "To create assigns that are only available during mount" },
          { label: "To share temporary state between LiveView and LiveComponent" },
        ],
        explanation:
          "Temporary assigns are reset to their default value after every render. This is a critical optimization for large collections — for example, if you have thousands of messages, you can append new ones to the DOM using `phx-update=\"append\"` or streams while only keeping the latest batch in memory, rather than holding the entire list in the server process.",
      },
      {
        question: "When is `handle_params/3` called in a LiveView?",
        options: [
          { label: "Only when the LiveView first mounts" },
          { label: "Only when `push_patch` updates the URL" },
          { label: "After mount and on every `push_patch` navigation", correct: true },
          { label: "Before mount, so you can validate URL params early" },
        ],
        explanation:
          "handle_params/3 is invoked after mount completes and again every time the URL is updated via push_patch or a `<.link patch={...}>`. This makes it the ideal place to load data based on URL parameters — for pagination, filtering, or tabs — because it runs both on initial load and on subsequent URL changes without remounting the LiveView.",
      },
      {
        question: "In a LiveComponent, what is the role of the `update/2` callback?",
        options: [
          { label: "It handles DOM events like clicks and form submissions" },
          { label: "It receives new assigns from the parent and sets up the component's socket", correct: true },
          { label: "It runs once on mount and never again" },
          { label: "It synchronizes state between the component and the database" },
        ],
        explanation:
          "The update/2 callback is called whenever the parent LiveView re-renders and passes new assigns to the component. It receives the incoming assigns map and the socket, and must return {:ok, socket}. This is where you merge parent-provided data into the component's own state, and it runs on every parent re-render, not just the first time.",
      },
      {
        question: "What happens when a LiveView process crashes while a user is connected?",
        options: [
          { label: "The browser shows a permanent error page and the user must refresh" },
          { label: "The JavaScript client automatically attempts to reconnect and remount the LiveView", correct: true },
          { label: "The crash is silently ignored and the page freezes in its last state" },
          { label: "The Phoenix endpoint restarts and all connected users are disconnected" },
        ],
        explanation:
          "Phoenix's JavaScript client detects the broken WebSocket connection and automatically attempts to reconnect with exponential backoff. When it reconnects, a new LiveView process is mounted from scratch. This is a deliberate design choice leveraging Erlang/OTP's 'let it crash' philosophy — transient errors resolve themselves without user intervention.",
      },
      {
        question: "What is the purpose of `live_session` in the Phoenix router?",
        options: [
          { label: "To create a database-backed session for each LiveView" },
          { label: "To group live routes that share the same `on_mount` hooks, root layout, and session validation", correct: true },
          { label: "To enable cookie-based authentication for LiveViews" },
          { label: "To persist LiveView state across page refreshes" },
        ],
        explanation:
          "live_session groups LiveView routes that share common configuration: on_mount hooks (for authentication, authorization, etc.), root layouts, and session options. Navigating between LiveViews within the same live_session uses client-side navigation over the WebSocket, but navigating across different live_sessions forces a full page reload to re-validate the session.",
      },
      {
        question: "How does a LiveComponent communicate an event back to its parent LiveView?",
        options: [
          { label: "By calling `push_event/3` with the parent's PID" },
          { label: "By using `send(self(), message)` since self() refers to the parent LiveView process", correct: true },
          { label: "By returning `{:reply, message, socket}` from handle_event" },
          { label: "Components cannot communicate with parents; they are fully isolated" },
        ],
        explanation:
          "Because a LiveComponent runs inside the parent LiveView's process (not in its own process), calling `send(self(), message)` delivers a message to the parent LiveView's mailbox. The parent then handles it in its own `handle_info/2` callback. This is the standard pattern for child-to-parent communication in LiveView.",
      },
      {
        question: "What happens if you use `push_patch` to navigate to a URL that belongs to a different LiveView module?",
        options: [
          { label: "The patch works normally and the new LiveView's handle_params is called" },
          { label: "A full page reload occurs because push_patch can only navigate within the same LiveView", correct: true },
          { label: "An error is raised at compile time" },
          { label: "The current LiveView stays mounted but the URL changes silently" },
        ],
        explanation:
          "push_patch is designed for navigation within the same LiveView — it updates the URL and triggers handle_params/3 without remounting. If the target URL maps to a different LiveView module, Phoenix falls back to a full page navigation (equivalent to push_navigate). For cross-LiveView navigation, you should use push_navigate explicitly to make the intent clear.",
      },
      {
        question: "What is the correct way to use LiveView streams for efficiently rendering large lists?",
        options: [
          { label: "Call `stream(socket, :items, items)` in mount and use `phx-update=\"stream\"` with `:for` on a DOM container", correct: true },
          { label: "Use `temporary_assigns` with `Enum.concat/2` to append items" },
          { label: "Call `push_event(socket, \"stream\", items)` and handle it in JavaScript" },
          { label: "Set `phx-update=\"append\"` on the container and assign the full list every time" },
        ],
        explanation:
          "Streams are LiveView's built-in mechanism for efficiently managing large collections without keeping all items in server memory. You initialize a stream with `stream/3` in mount, use `stream_insert/3` or `stream_delete/3` for updates, and render with a `phx-update=\"stream\"` container. The server only tracks the stream operations (inserts/deletes), not the full collection.",
      },
      {
        question: "In what order are the main LiveView lifecycle callbacks invoked on an initial page visit?",
        options: [
          { label: "render -> mount -> handle_params" },
          { label: "mount -> handle_params -> render", correct: true },
          { label: "handle_params -> mount -> render" },
          { label: "mount -> render -> handle_params" },
        ],
        explanation:
          "On an initial page visit, mount/3 is called first to set up initial state, then handle_params/3 is called to process URL parameters, and finally render/1 produces the HTML output. This sequence runs twice — once for the static HTTP response and once when the WebSocket connects. Understanding this order is essential for knowing where to place initialization logic versus URL-dependent data loading.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "Live Counter with Reset",
        difficulty: "beginner",
        prompt:
          "Build a LiveView counter that:\n- Shows the current count\n- Has +1, -1, and Reset buttons\n- The reset button should set the count back to 0\n- Shows a message 'Count is negative!' in red when the count drops below 0\n\nWrite the full LiveView module with mount, render, and handle_event callbacks.",
        hints: [
          { text: "Use three separate `handle_event` clauses — one for each button event name." },
          { text: "Use a conditional `:if` attribute in HEEx to show the negative warning." },
          { text: "The `update/3` function is handy for incrementing: `update(socket, :count, &(&1 + 1))`." },
        ],
        solution: `defmodule MyAppWeb.CounterLive do
  use MyAppWeb, :live_view

  def mount(_params, _session, socket) do
    {:ok, assign(socket, count: 0)}
  end

  def render(assigns) do
    ~H\"\"\"
    <div>
      <h1>Count: {@count}</h1>
      <p :if={@count < 0} style="color: red;">Count is negative!</p>

      <button phx-click="increment">+1</button>
      <button phx-click="decrement">-1</button>
      <button phx-click="reset">Reset</button>
    </div>
    \"\"\"
  end

  def handle_event("increment", _params, socket) do
    {:noreply, update(socket, :count, &(&1 + 1))}
  end

  def handle_event("decrement", _params, socket) do
    {:noreply, update(socket, :count, &(&1 - 1))}
  end

  def handle_event("reset", _params, socket) do
    {:noreply, assign(socket, count: 0)}
  end
end`,
        walkthrough: [
          "`mount/3` initializes the count to 0. This runs for both the static render and the WebSocket connect.",
          "The template uses `{@count}` to display the current value. The `:if` attribute conditionally shows the warning.",
          "Each button has a different `phx-click` value that maps to a `handle_event` clause.",
          "`update/3` transforms the existing assign value — cleaner than `assign(socket, count: socket.assigns.count + 1)`.",
          "The reset handler uses `assign/2` to set count directly back to 0.",
        ],
      },
      {
        title: "Live Search with Debounce",
        difficulty: "intermediate",
        prompt:
          "Build a LiveView that searches a list of users as you type:\n- Show a text input with `phx-change` for live filtering\n- Use `phx-debounce=\"300\"` to avoid firing on every keystroke\n- Filter a hardcoded list of user maps by name (case-insensitive)\n- Display matching results in a list, or 'No results found' if empty\n- Show the count of matching results\n\nHardcoded data: `[%{name: \"Alice\", role: \"admin\"}, %{name: \"Bob\", role: \"user\"}, %{name: \"Charlie\", role: \"user\"}, %{name: \"Alicia\", role: \"moderator\"}]`",
        hints: [
          { text: "Wrap the input in a `<form>` with `phx-change` — individual input changes trigger the form's change event." },
          { text: "Use `String.contains?(String.downcase(name), String.downcase(query))` for case-insensitive filtering." },
          { text: "Set both `@query` and `@results` assigns in the event handler so the template can display both." },
        ],
        solution: `defmodule MyAppWeb.SearchLive do
  use MyAppWeb, :live_view

  @users [
    %{name: "Alice", role: "admin"},
    %{name: "Bob", role: "user"},
    %{name: "Charlie", role: "user"},
    %{name: "Alicia", role: "moderator"}
  ]

  def mount(_params, _session, socket) do
    {:ok, assign(socket, query: "", results: @users)}
  end

  def render(assigns) do
    ~H\"\"\"
    <div>
      <form phx-change="search">
        <input
          type="text"
          name="query"
          value={@query}
          placeholder="Search users..."
          phx-debounce="300"
        />
      </form>

      <p>{length(@results)} result(s) found</p>

      <ul :if={@results != []}>
        <li :for={user <- @results}>
          {user.name} — {user.role}
        </li>
      </ul>

      <p :if={@results == []}>No results found</p>
    </div>
    \"\"\"
  end

  def handle_event("search", %{"query" => query}, socket) do
    results = filter_users(query)
    {:noreply, assign(socket, query: query, results: results)}
  end

  defp filter_users(""), do: @users

  defp filter_users(query) do
    q = String.downcase(query)

    Enum.filter(@users, fn user ->
      String.contains?(String.downcase(user.name), q)
    end)
  end
end`,
        walkthrough: [
          "We store the user list as a module attribute `@users` since it's hardcoded. In a real app, this would come from a database.",
          "The form uses `phx-change` which fires on any input change within the form. `phx-debounce=\"300\"` waits 300ms after the user stops typing.",
          "The `handle_event` for \"search\" receives the form params with the query, filters the list, and updates both assigns.",
          "`filter_users/1` has a special clause for empty strings that returns all users, avoiding an unnecessary filter operation.",
          "The template uses `:if` and `:for` attributes for conditional rendering and iteration — clean, declarative HEEx syntax.",
        ],
      },
      {
        title: "Real-Time Chat Room",
        difficulty: "advanced",
        prompt:
          "Build a LiveView chat room that:\n- Has a text input and send button for posting messages\n- Broadcasts messages to all connected users via PubSub\n- Shows the last 20 messages, newest at the bottom\n- Each message has a username (from a socket assign, set to a random guest name on mount) and timestamp\n- Shows a 'X users online' count using Phoenix.Presence or a simple PubSub-based approach\n- Clears the input after sending\n\nWrite the full LiveView module.",
        hints: [
          { text: "Subscribe to a PubSub topic in mount when `connected?/1` is true." },
          { text: "Use `handle_info/2` to receive broadcast messages and prepend them to the message list." },
          { text: "Use `Enum.take/2` with a negative number or `Enum.take/2` after reversing to keep the last 20 messages." },
          { text: "For tracking online users, broadcast join/leave events and keep a MapSet of usernames." },
        ],
        solution: `defmodule MyAppWeb.ChatLive do
  use MyAppWeb, :live_view

  @topic "chat:lobby"

  def mount(_params, _session, socket) do
    username = "Guest_\#{:rand.uniform(9999)}"

    if connected?(socket) do
      Phoenix.PubSub.subscribe(MyApp.PubSub, @topic)
      Phoenix.PubSub.broadcast(MyApp.PubSub, @topic, {:user_joined, username})
    end

    socket =
      assign(socket,
        messages: [],
        username: username,
        online_users: MapSet.new([username]),
        form: to_form(%{"message" => ""})
      )

    {:ok, socket}
  end

  def terminate(_reason, socket) do
    Phoenix.PubSub.broadcast(MyApp.PubSub, @topic, {:user_left, socket.assigns.username})
    :ok
  end

  def render(assigns) do
    ~H\"\"\"
    <div>
      <h2>Chat Room</h2>
      <p>{MapSet.size(@online_users)} user(s) online</p>

      <div id="messages" phx-update="stream">
        <div :for={msg <- @messages} id={"msg-\#{msg.id}"}>
          <strong>{msg.username}</strong>
          <span>{msg.text}</span>
          <small>{msg.time}</small>
        </div>
      </div>

      <.form for={@form} phx-submit="send_message">
        <input type="text" name="message" value="" placeholder="Type a message..."
          autocomplete="off" />
        <button type="submit">Send</button>
      </.form>
    </div>
    \"\"\"
  end

  def handle_event("send_message", %{"message" => ""}, socket) do
    {:noreply, socket}
  end

  def handle_event("send_message", %{"message" => text}, socket) do
    message = %{
      id: System.unique_integer([:positive]),
      username: socket.assigns.username,
      text: text,
      time: Calendar.strftime(DateTime.utc_now(), "%H:%M")
    }

    Phoenix.PubSub.broadcast(MyApp.PubSub, @topic, {:new_message, message})
    {:noreply, assign(socket, form: to_form(%{"message" => ""}))}
  end

  def handle_info({:new_message, message}, socket) do
    messages = (socket.assigns.messages ++ [message]) |> Enum.take(-20)
    {:noreply, assign(socket, messages: messages)}
  end

  def handle_info({:user_joined, username}, socket) do
    online = MapSet.put(socket.assigns.online_users, username)
    {:noreply, assign(socket, online_users: online)}
  end

  def handle_info({:user_left, username}, socket) do
    online = MapSet.delete(socket.assigns.online_users, username)
    {:noreply, assign(socket, online_users: online)}
  end
end`,
        walkthrough: [
          "On mount, we generate a random guest name and subscribe to the chat PubSub topic. We broadcast a :user_joined event so others know we connected.",
          "The `terminate/2` callback fires when the user disconnects, broadcasting :user_left to update everyone's online count.",
          "When a message is sent, we broadcast it via PubSub rather than adding it directly — this way the sender also receives it through `handle_info`, keeping all clients consistent.",
          "The empty message guard clause in `handle_event` prevents sending blank messages.",
          "`handle_info({:new_message, ...})` appends the message and keeps only the last 20 with `Enum.take(-20)`.",
          "Online users are tracked with a MapSet — join adds, leave removes. In production, you'd use Phoenix.Presence for more robust tracking that handles crashes and network issues.",
          "The form is reset after sending by assigning a new empty form, clearing the input field.",
        ],
      },
    ],
  },
};

export default liveview;
