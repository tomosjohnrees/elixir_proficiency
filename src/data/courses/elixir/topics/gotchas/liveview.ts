import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Assigns Are the Single Source of Truth",
    description:
      "LiveView has no concept of local component state like React's useState. All state lives in socket.assigns, and the template re-renders whenever assigns change. If you store state outside of assigns (e.g., in module attributes or process dictionary), the template won't reflect those changes. Always use assign/3 or update/3 to modify state.",
    code: `# Wrong: storing state outside assigns
def handle_event("increment", _params, socket) do
  # This won't trigger a re-render
  Process.put(:count, Process.get(:count, 0) + 1)
  {:noreply, socket}
end

# Correct: all state goes through assigns
def handle_event("increment", _params, socket) do
  {:noreply, update(socket, :count, &(&1 + 1))}
end

# In mount, initialize all assigns
def mount(_params, _session, socket) do
  {:ok, assign(socket, count: 0)}
end`,
  },
  {
    title: "handle_event Must Return {:noreply, socket}",
    description:
      "Every handle_event/3 callback must return {:noreply, socket}. Returning just the socket, or forgetting the tuple wrapper, causes a cryptic match error. Unlike handle_info or handle_call in GenServer, there is no :reply option — LiveView events always communicate back to the client through assign changes, not explicit replies.",
    code: `# Wrong: returning just the socket
def handle_event("save", params, socket) do
  save_data(params)
  socket  # ** (FunctionClauseError)
end

# Wrong: trying to reply
def handle_event("save", params, socket) do
  result = save_data(params)
  {:reply, result, socket}  # Not valid for handle_event!
end

# Correct: always return {:noreply, socket}
def handle_event("save", params, socket) do
  case save_data(params) do
    {:ok, _} -> {:noreply, put_flash(socket, :info, "Saved!")}
    {:error, _} -> {:noreply, put_flash(socket, :error, "Failed")}
  end
end`,
  },
  {
    title: "LiveView Processes Are Stateful — Memory per Connection",
    description:
      "Each LiveView connection spawns a dedicated process that holds all assigns in memory for the lifetime of the connection. With thousands of concurrent users, this can consume significant memory. Be mindful of what you store in assigns — avoid holding large datasets, and use temporary_assigns or streams for collections that can be pushed to the client and discarded.",
    code: `# Dangerous: loading thousands of records into assigns
def mount(_params, _session, socket) do
  # Each connected user holds ALL messages in memory
  {:ok, assign(socket, messages: Messages.list_all())}
end

# Better: use streams to manage large collections efficiently
def mount(_params, _session, socket) do
  {:ok,
   socket
   |> stream(:messages, Messages.list_recent(50))}
end`,
  },
  {
    title: "temporary_assigns for Large Lists to Reduce Memory",
    description:
      "By default, assigns persist in memory for the entire LiveView session. For large lists that are rendered once and don't need to stay in memory, use temporary_assigns. After the initial render, temporary assigns reset to their default value, freeing memory. The tradeoff is that you must append/prepend new items rather than replacing the full list.",
    code: `# Without temporary_assigns: all messages stay in memory
def mount(_params, _session, socket) do
  {:ok, assign(socket, messages: Messages.list_all())}
end

# With temporary_assigns: messages are freed after render
def mount(_params, _session, socket) do
  {:ok,
   assign(socket, messages: Messages.list_all()),
   temporary_assigns: [messages: []]}
end

# When adding new messages, append — don't replace
def handle_info({:new_message, msg}, socket) do
  # The template must use phx-update="append" or "prepend"
  {:noreply, assign(socket, messages: [msg])}
end`,
  },
];

export default gotchas;
