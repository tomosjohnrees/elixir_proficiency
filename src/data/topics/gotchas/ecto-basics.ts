import type { Gotcha } from "@/lib/types";

const gotchas: Gotcha[] = [
  {
    title: "Changesets Validate But Don't Touch the Database",
    description:
      "A changeset is just a data structure that tracks changes and validations. Calling Ecto.Changeset.change/2 or cast/4 does not insert, update, or delete anything. You must explicitly pass the changeset to a Repo function (insert, update, delete) to persist changes. This is a common source of confusion for newcomers who expect validation to also save.",
    code: `# This only builds a changeset — nothing is saved
changeset = User.changeset(%User{}, %{name: "Alice", email: "alice@example.com"})
#=> #Ecto.Changeset<valid?: true, ...>

# You must explicitly insert it
case Repo.insert(changeset) do
  {:ok, user} -> IO.puts("Saved: \#{user.name}")
  {:error, changeset} -> IO.inspect(changeset.errors)
end`,
  },
  {
    title: "Repo.insert vs Repo.insert! — Bang Functions Raise",
    description:
      "Ecto Repo functions come in two flavors: non-bang (insert, update, delete) return {:ok, struct} or {:error, changeset} tuples, while bang versions (insert!, update!, delete!) return the struct directly or raise Ecto.InvalidChangesetError. Use the tuple version when you need to handle errors gracefully, and the bang version when failure should crash the process.",
    code: `# Non-bang: returns a tuple, lets you handle errors
case Repo.insert(changeset) do
  {:ok, user} -> user
  {:error, changeset} -> handle_error(changeset)
end

# Bang: raises on failure — useful in seeds or scripts
user = Repo.insert!(changeset)

# Common mistake: pattern matching on a bang function
# {:ok, user} = Repo.insert!(changeset)
# ** This crashes because insert! returns the struct, not a tuple`,
  },
  {
    title: "N+1 Queries — Preload vs Lazy Loading",
    description:
      "Ecto does not lazily load associations. If you access an association that hasn't been preloaded, you get an Ecto.Association.NotLoaded struct, not an automatic database query. This is intentional — it prevents hidden N+1 queries. You must explicitly preload associations with Repo.preload/2 or by joining in the query.",
    code: `# Without preload: association is NOT loaded
user = Repo.get!(User, 1)
user.posts
#=> #Ecto.Association.NotLoaded<...>

# Option 1: Preload after fetching
user = Repo.get!(User, 1) |> Repo.preload(:posts)
user.posts
#=> [%Post{}, ...]

# Option 2: Preload in the query (single query with join)
query = from u in User,
  where: u.id == 1,
  preload: [posts: ^from(p in Post, order_by: p.inserted_at)]

user = Repo.one!(query)`,
  },
  {
    title: "Ecto Queries Are Composable But Executed Lazily",
    description:
      "Ecto.Query structs are just data — they describe a query but don't execute it. Queries are only sent to the database when passed to a Repo function like Repo.all/1 or Repo.one/1. This makes them highly composable, but it also means building a query has no side effects, and forgetting to call a Repo function means nothing happens.",
    code: `# These just build query structs — no database call yet
query = from u in User, where: u.active == true
query = from u in query, order_by: [desc: u.inserted_at]
query = from u in query, limit: 10

# Nothing has been executed! You must call a Repo function:
users = Repo.all(query)

# Common mistake: forgetting to execute
def list_active_users do
  from u in User, where: u.active == true
  # Returns the query struct, not actual users!
end`,
  },
];

export default gotchas;
