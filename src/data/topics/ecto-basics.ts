import type { TopicContent } from "@/lib/types";

const ectoBasics: TopicContent = {
  meta: {
    slug: "ecto-basics",
    title: "Ecto Basics",
    description: "Schemas, changesets, and basic queries",
    number: 21,
    active: true,
  },

  eli5: {
    analogyTitle: "The Careful Librarian",
    analogy:
      "Imagine a very organized librarian who manages a huge collection of books. Before any book goes on a shelf, the librarian checks it against a strict form: Does it have a title? Is the ISBN the right format? Is the publication year reasonable? If anything is wrong, the librarian writes down every problem on a rejection slip and hands the book back — nothing gets shelved until it's perfect.",
    items: [
      { label: "Schemas", description: "The catalog cards. They describe what a 'book' looks like — its title, author, year, and ISBN. Every record in your database has a schema that defines its shape." },
      { label: "Changesets", description: "The rejection slips. Before any data touches the database, a changeset validates it, tracks what changed, and collects any errors. Nothing sneaks past the librarian." },
      { label: "Queries", description: "The search system. Instead of wandering the shelves, you describe what you want — 'all books by this author published after 2020' — and the system finds them for you." },
      { label: "Repo", description: "The library building itself. It's the connection to the actual database. All reads and writes go through the Repo — the single door in and out of the library." },
    ],
    keyTakeaways: [
      "Ecto is not an ORM — it's a toolkit for data mapping and validation that keeps your data layer explicit.",
      "Schemas define the shape of your data and map database tables to Elixir structs.",
      "Changesets are the gatekeepers: they validate, cast, and track changes before anything hits the database.",
      "Queries are composable — you build them up piece by piece, and they only execute when you pass them to the Repo.",
      "The Repo is your single interface to the database — all inserts, updates, deletes, and reads go through it.",
    ],
  },

  visuals: {
    dataTypes: [
      { name: "Schema", color: "#2563eb", examples: ["schema \"users\" do", "field :name, :string", "field :age, :integer", "timestamps()"], description: "Defines the structure of a database record. Maps table columns to Elixir struct fields with types." },
      { name: "Changeset", color: "#d97706", examples: ["cast(user, attrs, [:name])", "validate_required([:name])", "validate_length(:name, min: 2)", "changeset.valid?"], description: "A data structure that tracks changes, casts types, and collects validation errors before database operations." },
      { name: "Query", color: "#059669", examples: ["from u in User", "where: u.age > 18", "select: u.name", "order_by: [asc: u.name]"], description: "Composable database queries built with keyword syntax or pipe-based expressions. Compiled to SQL." },
      { name: "Repo", color: "#e11d48", examples: ["Repo.all(query)", "Repo.get(User, 1)", "Repo.insert(changeset)", "Repo.delete(user)"], description: "The database interface module. Every read and write operation goes through the Repo." },
      { name: "Migration", color: "#7c3aed", examples: ["create table(:users)", "add :name, :string", "add :age, :integer", "create index(:users, [:email])"], description: "Version-controlled database schema changes. Each migration modifies the database structure incrementally." },
      { name: "Association", color: "#0891b2", examples: ["has_many :posts, Post", "belongs_to :user, User", "has_one :profile, Profile"], description: "Relationships between schemas. Ecto models one-to-one, one-to-many, and many-to-many associations." },
    ],
    operatorGroups: [],
  },

  deepDive: {
    sections: [
      {
        title: "Schemas",
        prose: [
          "An Ecto schema maps a database table to an Elixir struct. You define it inside a module using the `schema` macro, listing each field with its name and type. Ecto supports types like `:string`, `:integer`, `:boolean`, `:float`, `:date`, `:utc_datetime`, `:map`, and many more.",
          "The `timestamps()` macro automatically adds `inserted_at` and `updated_at` fields. By default, the schema's primary key is an auto-incrementing integer `:id`, but you can customize this with `@primary_key`.",
          "Schemas are just structs under the hood. You can pattern match on them, pass them to functions, and use them anywhere you'd use a regular map — but with the added benefit of compile-time field checking.",
        ],
        code: {
          title: "Defining a schema",
          code: `defmodule MyApp.Accounts.User do
  use Ecto.Schema

  schema "users" do
    field :name, :string
    field :email, :string
    field :age, :integer
    field :active, :boolean, default: true

    timestamps()
  end
end

# The schema creates a struct
%MyApp.Accounts.User{}
# => %MyApp.Accounts.User{
#      id: nil, name: nil, email: nil,
#      age: nil, active: true,
#      inserted_at: nil, updated_at: nil
#    }`,
          output: "%MyApp.Accounts.User{id: nil, name: nil, email: nil, age: nil, active: true, ...}",
        },
      },
      {
        title: "Changesets",
        prose: [
          "Changesets are the heart of Ecto's data validation. A changeset wraps a struct (or schema), applies incoming parameters, casts them to the right types, and runs validations. If anything fails, the changeset collects all errors without touching the database.",
          "The typical pattern is to define a `changeset/2` function in your schema module that chains `cast/4` (which picks allowed fields and converts types) with validation functions like `validate_required/3`, `validate_format/3`, and `validate_length/3`.",
          "Changesets are explicit — you choose exactly which fields external data can modify. This prevents mass-assignment vulnerabilities by design. If a field isn't listed in `cast`, it can't be changed by user input.",
        ],
        code: {
          title: "Building changesets",
          code: `defmodule MyApp.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :name, :string
    field :email, :string
    field :age, :integer
    timestamps()
  end

  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name, :email, :age])
    |> validate_required([:name, :email])
    |> validate_format(:email, ~r/@/)
    |> validate_number(:age, greater_than: 0, less_than: 150)
    |> unique_constraint(:email)
  end
end

# Valid changeset
changeset = User.changeset(%User{}, %{name: "Alice", email: "alice@example.com", age: 30})
changeset.valid?  # => true
changeset.changes # => %{name: "Alice", email: "alice@example.com", age: 30}

# Invalid changeset
bad = User.changeset(%User{}, %{name: "", email: "no-at-sign"})
bad.valid?  # => false
bad.errors  # => [name: {"can't be blank", [...]}, email: {"has invalid format", [...]}]`,
          output: "[name: {\"can't be blank\", [...]}, email: {\"has invalid format\", [...]}]",
        },
      },
      {
        title: "Common Validations",
        prose: [
          "Ecto ships with a rich set of built-in validations. `validate_required/3` checks for non-nil, non-empty values. `validate_format/3` tests against a regex. `validate_length/3` checks string length or list size. `validate_inclusion/3` and `validate_exclusion/3` check membership in a list.",
          "For database-level constraints, use `unique_constraint/3`, `foreign_key_constraint/3`, and `check_constraint/3`. These don't validate in memory — they rely on the database to enforce the rule and convert constraint violations into friendly error messages.",
          "You can also write custom validations with `validate_change/3`, which takes a field name and a function that receives the field and its value, returning a list of errors (empty if valid).",
        ],
        code: {
          title: "Validation examples",
          code: `def changeset(user, attrs) do
  user
  |> cast(attrs, [:name, :email, :age, :role, :bio])
  |> validate_required([:name, :email])
  |> validate_length(:name, min: 2, max: 100)
  |> validate_format(:email, ~r/^[^@]+@[^@]+$/)
  |> validate_number(:age, greater_than_or_equal_to: 0)
  |> validate_inclusion(:role, ["admin", "user", "moderator"])
  |> validate_length(:bio, max: 500)
  |> unique_constraint(:email)
end

# Custom validation
def changeset(event, attrs) do
  event
  |> cast(attrs, [:starts_at, :ends_at])
  |> validate_required([:starts_at, :ends_at])
  |> validate_change(:ends_at, fn :ends_at, ends_at ->
    if DateTime.compare(ends_at, event.starts_at) == :gt do
      []
    else
      [ends_at: "must be after start time"]
    end
  end)
end`,
          output: "[]",
        },
      },
      {
        title: "Basic Queries",
        prose: [
          "Ecto queries use the `from` macro with a keyword-based syntax that reads almost like SQL. You specify the source (a schema or table), add `where`, `select`, `order_by`, `limit`, and `offset` clauses, and then pass the query to `Repo` to execute it.",
          "Queries are composable — you can build a base query and then pipe additional clauses onto it. This is powerful for building dynamic queries where filters are conditionally applied. The query doesn't touch the database until you call a Repo function.",
        ],
        code: {
          title: "Writing queries",
          code: `import Ecto.Query

# Basic query: all active users
from(u in User, where: u.active == true)
|> Repo.all()

# Select specific fields
from(u in User,
  where: u.age >= 18,
  select: {u.name, u.email},
  order_by: [asc: u.name]
)
|> Repo.all()
# => [{"Alice", "alice@ex.com"}, {"Bob", "bob@ex.com"}]

# Composable queries
def base_query, do: from(u in User, where: u.active == true)

def by_age(query, min_age) do
  from u in query, where: u.age >= ^min_age
end

def sorted(query) do
  from u in query, order_by: [desc: u.inserted_at]
end

# Chain them together
base_query() |> by_age(21) |> sorted() |> Repo.all()`,
          output: "[%User{name: \"Alice\", ...}, %User{name: \"Bob\", ...}]",
        },
      },
      {
        title: "Repo Operations",
        prose: [
          "The Repo module is your gateway to the database. It provides functions for all CRUD operations: `Repo.insert/2` takes a changeset, `Repo.update/2` takes a changeset with changes, `Repo.delete/2` takes a struct, and `Repo.all/2` executes a query.",
          "Single-record lookups use `Repo.get/3` (by primary key), `Repo.get_by/3` (by field values), and `Repo.one/2` (expects exactly one result from a query). All insert/update/delete operations return `{:ok, struct}` or `{:error, changeset}` tuples, making them easy to pattern match on.",
        ],
        code: {
          title: "CRUD with Repo",
          code: `# Create
{:ok, user} = %User{}
  |> User.changeset(%{name: "Alice", email: "alice@example.com"})
  |> Repo.insert()

# Read
user = Repo.get(User, 1)              # by primary key
user = Repo.get_by(User, email: "alice@example.com")  # by field

# Update
{:ok, updated} = user
  |> User.changeset(%{name: "Alice Smith"})
  |> Repo.update()

# Delete
{:ok, deleted} = Repo.delete(user)

# Handle errors
case Repo.insert(changeset) do
  {:ok, user} -> IO.puts("Created \#{user.name}")
  {:error, changeset} -> IO.inspect(changeset.errors)
end`,
          output: "Created Alice",
        },
      },
      {
        title: "Migrations",
        prose: [
          "Migrations are version-controlled files that modify your database schema. You create them with `mix ecto.gen.migration`, and each one gets a timestamp prefix so they run in order. Inside a migration, you use functions like `create table/2`, `add/3`, `alter table/2`, and `create index/2`.",
          "Migrations are reversible by default — Ecto can figure out the inverse of most operations. For complex changes, you can define explicit `up/0` and `down/0` functions. Run migrations with `mix ecto.migrate` and roll back with `mix ecto.rollback`.",
        ],
        code: {
          title: "Writing migrations",
          code: `# Generated with: mix ecto.gen.migration create_users
defmodule MyApp.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :name, :string, null: false
      add :email, :string, null: false
      add :age, :integer
      add :active, :boolean, default: true

      timestamps()
    end

    create unique_index(:users, [:email])
  end
end

# Later migration: add a field
defmodule MyApp.Repo.Migrations.AddBioToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :bio, :text
    end
  end
end

# Run with: mix ecto.migrate
# Rollback with: mix ecto.rollback`,
          output: "Migrated in 0.0s",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "What does the `cast/4` function do in a changeset pipeline?",
        options: [
          { label: "Converts the schema to SQL" },
          { label: "Filters allowed fields and converts parameter types to match the schema", correct: true },
          { label: "Sends the changeset to the database" },
          { label: "Creates a new schema struct from a map" },
        ],
        explanation:
          "cast/4 takes a struct, parameters, and a list of allowed fields. It filters out any fields not in the allowed list and converts parameter values to the types defined in the schema. This is your first line of defense against unexpected input.",
      },
      {
        question: "When does an Ecto query actually hit the database?",
        options: [
          { label: "As soon as you call `from`" },
          { label: "When you add a `where` clause" },
          { label: "When you pass it to a Repo function like Repo.all/2", correct: true },
          { label: "Queries are evaluated lazily, one row at a time" },
        ],
        explanation:
          "Ecto queries are data structures — they don't execute until you pass them to a Repo function. This is what makes them composable: you can build up a query piece by piece, and it only runs when you're ready.",
      },
      {
        question: "What does `unique_constraint/3` do differently from `validate_format/3`?",
        options: [
          { label: "Nothing — they both validate in memory" },
          { label: "unique_constraint checks the database; validate_format checks in memory", correct: true },
          { label: "unique_constraint is faster because it skips validation" },
          { label: "validate_format works on strings; unique_constraint works on integers" },
        ],
        explanation:
          "validate_format/3 checks the value in memory against a regex before any database call. unique_constraint/3 relies on a database unique index — it only triggers if the database rejects the insert/update. You need both: in-memory validations for fast feedback, and constraints for data integrity.",
      },
      {
        question: "What does `Repo.get(User, 42)` return if no user with id 42 exists?",
        options: [
          { label: "An empty list []" },
          { label: "{:error, :not_found}" },
          { label: "nil", correct: true },
          { label: "Raises a Ecto.NoResultsError" },
        ],
        explanation:
          "Repo.get returns nil when no record is found. If you want to raise an error instead, use Repo.get!/2 (with the bang). This is a common Elixir convention — the bang version raises, the regular version returns nil.",
      },
      {
        question: "What is the purpose of the `^` (pin) operator in Ecto queries?",
        options: [
          { label: "It marks a field as required" },
          { label: "It interpolates an external Elixir variable into the query", correct: true },
          { label: "It creates a database index" },
          { label: "It pins the query to a specific table" },
        ],
        explanation:
          "In Ecto queries, ^ pins an Elixir variable so its value is interpolated into the query as a parameter. Without ^, Ecto would treat the name as a database column reference. This is similar to how ^ works in pattern matching — it uses the existing value rather than rebinding.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "Define a Schema and Changeset",
        difficulty: "beginner",
        prompt:
          "Define a `Product` schema for a table called \"products\" with fields: `name` (string, required), `price` (decimal, required, must be > 0), `description` (string, optional, max 1000 characters), and `in_stock` (boolean, default true). Write a `changeset/2` function that validates all the rules.",
        hints: [
          { text: "Use `use Ecto.Schema` and `import Ecto.Changeset` at the top of your module." },
          { text: "The `field` macro takes a name, type, and optional keyword list with defaults." },
          { text: "Chain validations: cast -> validate_required -> validate_number -> validate_length." },
        ],
        solution: `defmodule MyApp.Catalog.Product do
  use Ecto.Schema
  import Ecto.Changeset

  schema "products" do
    field :name, :string
    field :price, :decimal
    field :description, :string
    field :in_stock, :boolean, default: true

    timestamps()
  end

  def changeset(product, attrs) do
    product
    |> cast(attrs, [:name, :price, :description, :in_stock])
    |> validate_required([:name, :price])
    |> validate_number(:price, greater_than: 0)
    |> validate_length(:description, max: 1000)
  end
end`,
        walkthrough: [
          "We use `use Ecto.Schema` to get the schema/2 macro and `import Ecto.Changeset` for the validation functions.",
          "The schema block maps to a \"products\" table, with each `field` defining a column, its Elixir type, and optional defaults.",
          "`timestamps()` adds `inserted_at` and `updated_at` fields automatically.",
          "In `changeset/2`, `cast` picks the allowed fields and converts incoming params to the right types.",
          "`validate_required` ensures name and price are present. `validate_number` checks price > 0. `validate_length` caps description at 1000 characters.",
          "Notice `in_stock` is castable but not required — it has a default of true, so it's fine if it's omitted.",
        ],
      },
      {
        title: "Composable Query Builder",
        difficulty: "intermediate",
        prompt:
          "Write a module `ProductQuery` with composable query functions:\n- `base/0` — returns all products that are in stock\n- `cheaper_than/2` — takes a query and a max price, adds a price filter\n- `search/2` — takes a query and a search term, filters by name using `ilike`\n- `sorted_by_price/1` — takes a query, orders by price ascending\n\nShow how to chain them: find all in-stock products under $50 matching \"shirt\", sorted by price.",
        hints: [
          { text: "Each function should return a query, so they can be piped together." },
          { text: "Use `from p in query, where: ...` to extend an existing query." },
          { text: "For `ilike`, use `ilike(p.name, ^pattern)` where pattern includes % wildcards." },
        ],
        solution: `defmodule MyApp.Catalog.ProductQuery do
  import Ecto.Query

  alias MyApp.Catalog.Product

  def base do
    from p in Product, where: p.in_stock == true
  end

  def cheaper_than(query, max_price) do
    from p in query, where: p.price <= ^max_price
  end

  def search(query, term) do
    pattern = "%\#{term}%"
    from p in query, where: ilike(p.name, ^pattern)
  end

  def sorted_by_price(query) do
    from p in query, order_by: [asc: p.price]
  end
end

# Usage
alias MyApp.Catalog.ProductQuery

ProductQuery.base()
|> ProductQuery.cheaper_than(50)
|> ProductQuery.search("shirt")
|> ProductQuery.sorted_by_price()
|> Repo.all()`,
        walkthrough: [
          "Each function takes a query (or starts one) and returns a query — this is the composable query pattern.",
          "`base/0` creates the initial query scoped to in-stock products.",
          "`cheaper_than/2` uses `^max_price` to pin the Elixir variable into the query safely (preventing SQL injection).",
          "`search/2` builds a wildcard pattern and uses `ilike` for case-insensitive matching.",
          "The final pipeline reads naturally: start with base, add filters, sort, then execute with Repo.all.",
          "The query is only compiled to SQL and sent to the database when `Repo.all()` is called — everything before that is just building a data structure.",
        ],
      },
      {
        title: "Multi-step Changeset Validation",
        difficulty: "advanced",
        prompt:
          "Create a `Registration` schema and changeset for a user sign-up flow with these requirements:\n- `email` (required, must contain @, must be unique)\n- `password` (required, minimum 8 characters, must contain at least one digit)\n- `password_confirmation` must match `password`\n- `username` (required, 3-20 chars, only alphanumeric and underscores, must be unique)\n- Store a `password_hash` field instead of the raw password (simulate hashing with `String.reverse/1`)\n\nThe raw `password` and `password_confirmation` should be virtual fields (not stored in the database).",
        hints: [
          { text: "Use `field :password, :string, virtual: true` for fields that shouldn't be persisted to the database." },
          { text: "Use `validate_confirmation/3` to check that password_confirmation matches password." },
          { text: "Use `validate_format/3` with a regex for the digit check and username character validation." },
          { text: "Use `put_change/3` to set the password_hash after validation passes." },
        ],
        solution: `defmodule MyApp.Accounts.Registration do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :username, :string
    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true
    field :password_hash, :string

    timestamps()
  end

  def changeset(registration, attrs) do
    registration
    |> cast(attrs, [:email, :username, :password, :password_confirmation])
    |> validate_required([:email, :username, :password])
    |> validate_format(:email, ~r/^[^@]+@[^@]+$/, message: "must contain @")
    |> validate_length(:password, min: 8)
    |> validate_format(:password, ~r/\\d/, message: "must contain at least one digit")
    |> validate_confirmation(:password, message: "does not match password")
    |> validate_length(:username, min: 3, max: 20)
    |> validate_format(:username, ~r/^[a-zA-Z0-9_]+$/,
      message: "only letters, numbers, and underscores allowed")
    |> unique_constraint(:email)
    |> unique_constraint(:username)
    |> hash_password()
  end

  defp hash_password(changeset) do
    case get_change(changeset, :password) do
      nil -> changeset
      password -> put_change(changeset, :password_hash, String.reverse(password))
    end
  end
end

# Valid registration
changeset = Registration.changeset(%Registration{}, %{
  email: "alice@example.com",
  username: "alice_42",
  password: "secret123",
  password_confirmation: "secret123"
})
changeset.valid?  # => true
changeset.changes.password_hash  # => "321terces"`,
        walkthrough: [
          "Virtual fields (`:virtual: true`) exist on the struct but aren't persisted to the database — perfect for password and confirmation.",
          "`cast` includes all four input fields. The password_hash is never in the cast list — it's set programmatically, never from user input.",
          "Validations are chained in order: required fields first, then format and length checks.",
          "`validate_confirmation` automatically looks for a field named `password_confirmation` when validating `:password`.",
          "The `hash_password/1` helper uses `get_change/2` to check if the password was actually changed, and only then sets the hash. This prevents re-hashing on updates that don't touch the password.",
          "`unique_constraint` for email and username will catch duplicates at the database level — you need corresponding unique indexes in your migration.",
        ],
      },
    ],
  },
};

export default ectoBasics;
