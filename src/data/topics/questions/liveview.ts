import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
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
];

export default questions;
