import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Protocols Dispatch on the First Argument Only",
    description:
      "Protocol dispatch is based solely on the type of the first argument. You cannot dispatch on multiple arguments or on argument values. If you need different behavior based on two types, you'll need to handle that logic inside the implementation or use pattern matching within the protocol function.",
    code: `defprotocol Renderable do
  def render(data, format)
end

# Dispatch is ONLY on 'data', not on 'format'
defimpl Renderable, for: User do
  def render(user, :json), do: Jason.encode!(user)
  def render(user, :html), do: "<p>\#{user.name}</p>"
  # Must handle format variants inside the implementation
end

# You CANNOT do this:
# defimpl Renderable, for: {User, :json} do ...`,
  },
  {
    title: "Any Fallback Silently Catches Missing Implementations",
    description:
      "Using @fallback_to_any true with a defimpl for Any means any type without an explicit implementation will silently use the fallback. This can mask bugs where you forgot to implement the protocol for a specific type. Without the fallback, you get a clear Protocol.UndefinedError pointing to the missing implementation.",
    code: `defprotocol Describable do
  @fallback_to_any true
  def describe(term)
end

defimpl Describable, for: Any do
  def describe(term), do: "A \#{inspect(term)}"
end

# This works, but is it what you wanted?
Describable.describe(%UnexpectedStruct{})
#=> "A %UnexpectedStruct{}"
# No error — the missing implementation is hidden!

# Without @fallback_to_any, you'd get:
# ** (Protocol.UndefinedError) protocol Describable
#    not implemented for %UnexpectedStruct{}`,
  },
  {
    title: "Protocol Consolidation Behaves Differently in Dev vs Prod",
    description:
      "In development (Mix), protocols are not consolidated — dispatch goes through a slower path that checks for implementations at runtime. In production (releases), protocols are consolidated at compile time for performance. This means a protocol implementation added at runtime works in dev but fails silently in a release.",
    code: `# This works in dev because protocols aren't consolidated:
defimpl MyProtocol, for: DynamicStruct do
  def my_func(data), do: data
end

# In production releases, protocols are consolidated
# at compile time. Runtime implementations won't be found.

# mix.exs — consolidation is automatic in releases
# To disable for debugging:
def project do
  [
    consolidate_protocols: false  # don't do this in prod!
  ]
end`,
  },
  {
    title: "Implementing for a Struct vs Its Underlying Map",
    description:
      "Structs are maps under the hood, but protocol dispatch distinguishes between them. An implementation for Map won't be used for structs, and an implementation for a specific struct won't apply to plain maps. If you implement for Map and expect it to cover your structs, you'll get a Protocol.UndefinedError.",
    code: `defprotocol Sizeable do
  def size(data)
end

defimpl Sizeable, for: Map do
  def size(map), do: map_size(map)
end

# This works:
Sizeable.size(%{a: 1, b: 2})
#=> 2

# This FAILS — structs are not dispatched as Map:
Sizeable.size(%User{name: "Alice"})
#=> ** (Protocol.UndefinedError)

# You need a separate implementation for the struct:
defimpl Sizeable, for: User do
  def size(_user), do: 1
end`,
  },
];

export default gotchas;
