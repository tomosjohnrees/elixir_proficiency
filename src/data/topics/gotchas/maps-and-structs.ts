import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Map.get Returns nil, Not an Error",
    description:
      "Accessing a missing key with Map.get/2 or the bracket syntax map[:key] returns nil instead of raising an error. This can cause silent bugs where nil propagates through your code. Use Map.fetch/2 or Map.fetch!/2 when you need to know if a key exists.",
    code: `user = %{name: "Alice"}

# Returns nil silently — no error
Map.get(user, :email)
#=> nil

user[:email]
#=> nil

# Use fetch to explicitly handle missing keys
Map.fetch(user, :email)
#=> :error

Map.fetch!(user, :email)
#=> ** (KeyError) key :email not found in: %{name: "Alice"}

# Dot syntax DOES raise on missing atom keys
user.email
#=> ** (KeyError) key :email not found`,
  },
  {
    title: "Struct Update Syntax Only Works for Existing Keys",
    description:
      "The update syntax %MyStruct{struct | key: value} only allows updating keys that the struct already defines. Trying to set a key that isn't part of the struct definition raises a KeyError. This is a feature for safety, but catches people who expect map-like flexibility.",
    code: `defmodule User do
  defstruct [:name, :email]
end

user = %User{name: "Alice", email: "alice@example.com"}

# This works — :name is a defined key
%User{user | name: "Bob"}
#=> %User{name: "Bob", email: "alice@example.com"}

# This fails — :age is not in the struct
%User{user | age: 30}
#=> ** (KeyError) key :age not found in: %User{...}`,
  },
  {
    title: "Structs Are Maps but Don't Implement Enumerable",
    description:
      "Structs are built on top of maps (with a __struct__ key), but they don't implement the Enumerable protocol by default. You can't directly pass a struct to Enum.map/2 or Enum.filter/2 without first converting it to a map with Map.from_struct/1.",
    code: `defmodule User do
  defstruct [:name, :email]
end

user = %User{name: "Alice", email: "alice@example.com"}

# This fails
Enum.map(user, fn {k, v} -> {k, v} end)
#=> ** (Protocol.UndefinedError) protocol Enumerable
#     not implemented for %User{...}

# Convert to a map first
user |> Map.from_struct() |> Enum.map(fn {k, v} -> {k, v} end)
#=> [name: "Alice", email: "alice@example.com"]`,
  },
  {
    title: "Dot Notation Only Works for Atom Keys",
    description:
      "The map.key dot notation only works when keys are atoms. For string keys or any other type, you must use the bracket syntax map[key] or Map.get/2. Since JSON parsing typically produces string keys, this is a frequent source of errors.",
    code: `# Atom keys — dot notation works
atom_map = %{name: "Alice"}
atom_map.name
#=> "Alice"

# String keys — dot notation fails
string_map = %{"name" => "Alice"}
string_map.name
#=> ** (KeyError) key :name not found

# Use bracket syntax for string keys
string_map["name"]
#=> "Alice"

# JSON.decode usually returns string keys
{:ok, data} = Jason.decode(~s({"name": "Alice"}))
data["name"]    #=> "Alice"
# data.name     #=> ** (KeyError)`,
  },
];

export default gotchas;
