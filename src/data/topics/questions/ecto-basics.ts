import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
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
  {
    question: "What happens if you call `Repo.insert/2` with an invalid changeset (where `changeset.valid?` is false)?",
    options: [
      { label: "It raises an Ecto.InvalidChangesetError" },
      { label: "It inserts the record anyway but logs a warning" },
      { label: "It returns `{:error, changeset}` without hitting the database", correct: true },
      { label: "It silently ignores the insert and returns `{:ok, nil}`" },
    ],
    explanation:
      "When a changeset is invalid, Repo.insert/2 short-circuits and returns {:error, changeset} without ever sending a query to the database. This makes it safe and efficient to pattern match on the result tuple to handle success and failure cases in your controller or context functions.",
  },
  {
    question: "In an Ecto.Multi pipeline, what happens if one of the operations fails?",
    options: [
      { label: "All previous successful operations are committed and the rest are skipped" },
      { label: "The entire transaction is rolled back and an error tuple is returned", correct: true },
      { label: "Ecto retries the failed operation up to three times" },
      { label: "The failed operation is skipped and the remaining operations continue" },
    ],
    explanation:
      "Ecto.Multi wraps all operations in a database transaction. If any operation returns an error, the entire transaction is rolled back — none of the changes are persisted. The return value is {:error, failed_operation_name, failed_value, changes_so_far}, which lets you identify exactly which step failed.",
  },
  {
    question: "What is the key difference between `Repo.preload(user, :posts)` and using `join` with `preload` in a query?",
    options: [
      { label: "There is no difference; both produce identical SQL" },
      { label: "Repo.preload issues a separate query; join + preload fetches data in a single query", correct: true },
      { label: "Repo.preload is for has_many; join is only for belongs_to" },
      { label: "Repo.preload works synchronously; join preloads asynchronously" },
    ],
    explanation:
      "Repo.preload/3 issues one or more additional SELECT queries to fetch the associated records after the initial query. Using join with preload in the query itself loads the association data in a single SQL query with a JOIN. The join approach can be more efficient but may return duplicate parent rows when preloading has_many associations.",
  },
  {
    question: "What is a schemaless changeset, and when would you use one?",
    options: [
      { label: "A changeset that automatically infers types from the database" },
      { label: "A changeset built from a `{data, types}` tuple instead of a schema struct, useful for validating data that doesn't map to a database table", correct: true },
      { label: "A changeset that skips all validations for performance" },
      { label: "A changeset that works with embedded schemas only" },
    ],
    explanation:
      "Schemaless changesets are created by passing a {data, types} tuple (e.g., {%{}, %{email: :string, age: :integer}}) to cast/4 instead of a schema struct. They are ideal for validating form data, API parameters, or search filters that don't correspond to any database table — giving you all of Ecto's validation power without needing a schema module.",
  },
  {
    question: "Given this code:\n\n```\nfrom(u in User,\n  join: p in assoc(u, :posts),\n  group_by: u.id,\n  having: count(p.id) > 5,\n  select: {u.name, count(p.id)}\n)\n```\n\nWhat does this query return?",
    options: [
      { label: "All users along with their first 5 posts" },
      { label: "The names and post counts of users who have more than 5 posts", correct: true },
      { label: "The total number of users who have exactly 5 posts" },
      { label: "A list of posts grouped by user, limited to 5 per group" },
    ],
    explanation:
      "This query joins users with their posts, groups by user, then uses `having` to filter groups where the post count exceeds 5. The `select` returns tuples of the user's name and their post count. The `having` clause works like `where` but operates on aggregated values after the GROUP BY — a crucial distinction for writing correct aggregate queries.",
  },
  {
    question: "What is the correct way to build a dynamic query where filters are conditionally applied based on user input?",
    options: [
      { label: "Use string concatenation to build the SQL query dynamically" },
      { label: "Use `Ecto.Query.dynamic/2` to build composable where-clause fragments", correct: true },
      { label: "Create a separate query function for every possible filter combination" },
      { label: "Use raw SQL with `Ecto.Adapters.SQL.query/3` for all dynamic queries" },
    ],
    explanation:
      "Ecto.Query.dynamic/2 lets you build query expressions at runtime that can be composed together. You can conditionally add filters by reducing over user input params and combining dynamic expressions with `dynamic([u], ^existing and ^new_filter)`. This keeps your queries safe from SQL injection while supporting arbitrary filter combinations.",
  },
  {
    question: "What does `Ecto.Multi.run/3` allow you to do that `Ecto.Multi.insert/3` and `Ecto.Multi.update/3` cannot?",
    options: [
      { label: "It runs operations outside of the database transaction" },
      { label: "It executes an arbitrary function that can access the results of previous Multi steps", correct: true },
      { label: "It runs multiple inserts in parallel for better performance" },
      { label: "It allows you to skip validation on changesets" },
    ],
    explanation:
      "Multi.run/3 accepts a function that receives the repo and all changes accumulated so far, letting you execute arbitrary logic — such as calling external APIs, computing values from prior steps, or performing conditional operations. The function must return {:ok, value} or {:error, reason}, and like all Multi operations, a failure triggers a full rollback.",
  },
  {
    question: "What is the difference between `validate_required/3` and a `null: false` constraint in a migration?",
    options: [
      { label: "They are equivalent — both prevent nil values at the same level" },
      { label: "validate_required checks at the application level before DB contact; null: false is enforced by the database as a last line of defense", correct: true },
      { label: "validate_required is for strings only; null: false works for all types" },
      { label: "null: false replaces validate_required, so you only need one" },
    ],
    explanation:
      "validate_required/3 is an application-level check that prevents blank or nil values before a query is sent to the database, giving you friendly error messages. The `null: false` migration constraint is enforced by the database itself and will raise a hard error if violated. Best practice is to use both: validate_required for user-friendly feedback, and null: false as a safety net at the database level.",
  },
  {
    question: "When using `cast_assoc/3` in a changeset, what must be true about the associated schema?",
    options: [
      { label: "It must define a `changeset/2` function that `cast_assoc` will invoke to validate the nested data", correct: true },
      { label: "It must be an embedded schema, not a regular schema" },
      { label: "It must have a `belongs_to` association pointing back to the parent" },
      { label: "It must use the same Repo as the parent schema" },
    ],
    explanation:
      "cast_assoc/3 expects the associated schema module to have a changeset/2 function, which it calls to cast and validate the nested association data. You can override this by passing the `:with` option (e.g., `cast_assoc(:comments, with: &Comment.update_changeset/2)`). This ensures that nested data goes through proper validation, maintaining data integrity across parent-child relationships.",
  },
  {
    question: "What does `Repo.transaction/2` return when used with an `Ecto.Multi` that has three named steps: `:user`, `:profile`, and `:welcome_email`?",
    options: [
      { label: "`{:ok, multi}` where multi is the original Ecto.Multi struct" },
      { label: "`{:ok, %{user: user, profile: profile, welcome_email: email}}` — a map of all operation results keyed by their names", correct: true },
      { label: "`{:ok, [user, profile, email]}` — a list of results in order" },
      { label: "`{:ok, last_result}` — only the result of the final operation" },
    ],
    explanation:
      "When all operations succeed, Repo.transaction/2 with an Ecto.Multi returns {:ok, map} where the map contains every operation's result keyed by the atom name you gave it. This is powerful because you can immediately destructure the result: `{:ok, %{user: user, profile: profile}} = Repo.transaction(multi)`. On failure, you get {:error, failed_step, failed_value, changes_so_far}.",
  },
];

export default questions;
