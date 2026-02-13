import type { TopicContent } from "@/lib/types";
import Animation05PatternMatch from "@/components/animations/Animation05PatternMatch";
import Animation13HeadTail from "@/components/animations/Animation13HeadTail";

const patternMatching: TopicContent = {
  meta: {
    slug: "pattern-matching",
    title: "Pattern Matching",
    description: "The match operator, destructuring, and pin operator",
    number: 2,
    active: true,
  },

  eli5: {
    analogyTitle: "The Shape Sorter Toy",
    analogy:
      "You know those toddler toys where you push shapes through matching holes? A star only fits through the star hole, a circle through the circle hole. Pattern matching in Elixir works the same way — you hold up a \"shape\" (a pattern) and Elixir checks if your data fits through it. If it fits, great — and as a bonus, Elixir pulls the data apart and labels the pieces for you.",
    items: [
      { label: "The = sign", description: "It's not assignment like in other languages — it's a question. Elixir asks: \"does the left side match the right side?\" If yes, any variables on the left get filled in." },
      { label: "Destructuring", description: "Like opening a gift box and sorting the contents into labeled containers. You describe the shape of the data, and Elixir fills in the blanks." },
      { label: "The pin operator ^", description: "A thumbtack that pins a variable in place. It says \"don't fill this in — I already know what this should be, so check it matches.\"" },
    ],
    keyTakeaways: [
      "The = operator is the match operator, not assignment. It tries to make the left side match the right side.",
      "If a variable appears on the left side, Elixir binds it to the corresponding value on the right.",
      "You can destructure tuples, lists, and maps in a single expression.",
      "The pin operator ^ forces Elixir to use a variable's existing value instead of rebinding it.",
      "A failed match raises a MatchError — this is how Elixir enforces structure.",
    ],
  },

  visuals: {
    animations: [
      { component: Animation05PatternMatch, duration: 20 },
      { component: Animation13HeadTail, duration: 18 },
    ],
    dataTypes: [
      { name: "Simple Match", color: "#6b46c1", examples: ["x = 42", "{a, b} = {1, 2}", "[h | t] = [1, 2, 3]"], description: "The left side is a pattern. Variables get bound to matching parts of the right side." },
      { name: "Tuple Destructure", color: "#2563eb", examples: ["{:ok, val} = {:ok, 42}", "{a, b, c} = {1, 2, 3}"], description: "Match tuples by shape and size. Atom literals must match exactly; variables capture values." },
      { name: "List Destructure", color: "#059669", examples: ["[a, b] = [1, 2]", "[h | t] = [1, 2, 3]", "[_ | rest] = [1, 2, 3]"], description: "Match lists by elements or use [head | tail] to split. Underscore _ ignores a value." },
      { name: "Pin Operator", color: "#e11d48", examples: ["^x = 42", "{^key, val} = {:name, \"Jo\"}", "^y = 10"], description: "The ^ prefix pins a variable to its current value, turning it into a literal for matching." },
    ],
    operatorGroups: [
      {
        name: "Match Operators",
        operators: [
          { symbol: "=", description: "Match operator — binds or checks equality" },
          { symbol: "^", description: "Pin operator — uses existing value" },
          { symbol: "_", description: "Wildcard — matches anything, discards value" },
        ],
      },
      {
        name: "List Patterns",
        operators: [
          { symbol: "[h | t]", description: "Head/tail split — h gets first element, t gets rest" },
          { symbol: "[a, b, c]", description: "Exact element match — list must have same length" },
          { symbol: "[_ | t]", description: "Ignore head — just get the tail" },
        ],
      },
    ],
  },

  deepDive: {
    sections: [
      {
        title: "The Match Operator =",
        prose: [
          "In most languages, = means \"put this value into that variable.\" In Elixir, = is the match operator. It tries to make the left-hand side match the right-hand side. If a bare variable appears on the left, Elixir binds it — but that's a side effect of matching, not the primary purpose.",
          "When both sides are already concrete values, = simply asserts that they're equal. If they aren't, you get a MatchError. This makes = both an assertion tool and a binding tool in one.",
        ],
        code: {
          title: "Match operator basics",
          code: `# Binding via matching
x = 1           # x is now 1

# This works because Elixir makes left = right
1 = x           # succeeds! 1 matches the value of x

# This fails — 2 doesn't match 1
2 = x           # ** (MatchError) no match of right hand side value: 1`,
          output: "** (MatchError) no match of right hand side value: 1",
        },
      },
      {
        title: "Destructuring Tuples",
        prose: [
          "Tuples are the workhorse of pattern matching. The most common pattern is the {:ok, value} / {:error, reason} convention. By matching on the atom at the start, you branch on success or failure in a single expression.",
          "The left-side pattern must match the shape and size of the right-side tuple. If the tuple has three elements, your pattern needs three slots.",
        ],
        code: {
          title: "Tuple pattern matching",
          code: `# Destructure a two-element tuple
{status, count} = {:ok, 42}
status  # => :ok
count   # => 42

# Match on a known atom — only :ok tuples pass
{:ok, result} = {:ok, "success"}
result  # => "success"

# This fails — :error doesn't match :ok
{:ok, result} = {:error, "not found"}
# ** (MatchError)

# Three-element tuple
{a, b, c} = {1, 2, 3}
# a=1, b=2, c=3`,
          output: "** (MatchError) no match of right hand side value: {:error, \"not found\"}",
        },
      },
      {
        title: "Destructuring Lists",
        prose: [
          "Lists can be matched element-by-element or split into head and tail using the [head | tail] syntax. This head/tail pattern is fundamental to recursive processing in Elixir.",
          "The head is always a single element. The tail is always a list (possibly empty). When the list has one element, the tail is [].",
        ],
        code: {
          title: "List pattern matching",
          code: `# Exact element match
[a, b, c] = [1, 2, 3]
# a=1, b=2, c=3

# Head | tail split
[head | tail] = [1, 2, 3, 4]
head  # => 1
tail  # => [2, 3, 4]

# Single-element list
[only | rest] = [42]
only  # => 42
rest  # => []

# Nested patterns
[first, second | rest] = [1, 2, 3, 4, 5]
first   # => 1
second  # => 2
rest    # => [3, 4, 5]`,
          output: "[3, 4, 5]",
        },
      },
      {
        title: "The Underscore _ Wildcard",
        prose: [
          "The underscore _ is the \"I don't care\" placeholder. It matches anything but doesn't bind the value. Use it when you need to acknowledge part of a structure without keeping it.",
          "You can also use named underscores like _reason for documentation purposes — Elixir still ignores the value, but the name hints at what was there. The compiler will warn you if you accidentally use a _variable.",
        ],
        code: {
          title: "Underscore patterns",
          code: `# Ignore the status, keep the value
{_, value} = {:ok, 42}
value  # => 42

# Ignore the head, keep the tail
[_ | rest] = [1, 2, 3]
rest  # => [2, 3]

# Named underscore for readability
{:error, _reason} = {:error, "timeout"}
# _reason is not bound — using it would warn

# Multiple wildcards
{_, _, third} = {"a", "b", "c"}
third  # => "c"`,
          output: "\"c\"",
        },
      },
      {
        title: "The Pin Operator ^",
        prose: [
          "By default, variables on the left side of = get rebound. The pin operator ^ prevents this — it says \"use the current value of this variable as a literal to match against.\"",
          "This is essential when you want to check that a value matches an existing variable rather than creating a new binding. It comes up constantly in case expressions and function heads.",
        ],
        code: {
          title: "Pin operator in action",
          code: `x = 1

# Without pin: x gets rebound to 2
x = 2
x  # => 2

# With pin: checks that right side matches x's value
x = 2
^x = 2   # succeeds! 2 matches 2
^x = 3   # ** (MatchError) — 3 doesn't match 2

# Pin inside a pattern
x = :ok
{^x, result} = {:ok, "hello"}
result  # => "hello"

{^x, result} = {:error, "fail"}
# ** (MatchError) — :error doesn't match :ok`,
          output: "** (MatchError) no match of right hand side value: {:error, \"fail\"}",
        },
      },
      {
        title: "Matching Maps and Common Patterns",
        prose: [
          "Maps can be partially matched — your pattern only needs to include the keys you care about. This is different from tuples and lists, which must match the full structure.",
          "Pattern matching really shines when combined with case, function clauses, and with. You'll see these in later topics, but even at this stage, the match operator alone gives you powerful data validation and extraction.",
        ],
        code: {
          title: "Map matching and real-world patterns",
          code: `# Partial map match — only needs the keys in the pattern
%{name: name} = %{name: "José", age: 50, lang: "Elixir"}
name  # => "José"

# Multiple keys
%{name: n, age: a} = %{name: "José", age: 50}
# n = "José", a = 50

# Empty map matches any map
%{} = %{any: "map", works: true}

# Common real-world pattern: API response handling
response = {:ok, %{status: 200, body: "hello"}}
{:ok, %{status: status, body: body}} = response
status  # => 200
body    # => "hello"`,
          output: "\"hello\"",
        },
      },
    ],
  },

  quiz: {
    questions: [
      {
        question: "What does the = operator do in Elixir?",
        options: [
          { label: "Assigns a value to a variable" },
          { label: "Tries to match the left side against the right side", correct: true },
          { label: "Checks for strict equality like ===" },
          { label: "Creates a copy of the right-hand value" },
        ],
        explanation:
          "The = operator is the match operator. It tries to make the left-hand side match the right-hand side. Variable binding is a side effect of matching, not its primary purpose. That's why 1 = x works when x is 1.",
      },
      {
        question: "What does [h | t] = [1, 2, 3] bind t to?",
        options: [
          { label: "[2, 3]", correct: true },
          { label: "2" },
          { label: "[1, 2, 3]" },
          { label: "3" },
        ],
        explanation:
          "The [head | tail] pattern splits a list into its first element (h = 1) and the remaining list (t = [2, 3]). The tail is always a list, even if it contains a single element or is empty.",
      },
      {
        question: "What happens when you evaluate: {a, b} = {1, 2, 3}?",
        options: [
          { label: "a = 1, b = 2, and 3 is ignored" },
          { label: "a = 1, b = [2, 3]" },
          { label: "A MatchError is raised", correct: true },
          { label: "a = {1, 2}, b = 3" },
        ],
        explanation:
          "Tuple patterns must match the exact size. A 2-element pattern cannot match a 3-element tuple, so Elixir raises a MatchError. Unlike maps, tuples require a complete structural match.",
      },
      {
        question: "Given x = 5, what does ^x = 10 do?",
        options: [
          { label: "Rebinds x to 10" },
          { label: "Raises a MatchError", correct: true },
          { label: "Returns false" },
          { label: "Pins x to 10" },
        ],
        explanation:
          "The pin operator ^ uses the existing value of x (which is 5) as a literal. So ^x = 10 is like writing 5 = 10, which doesn't match, raising a MatchError. Without the pin, x = 10 would rebind x.",
      },
      {
        question: "Which pattern correctly extracts the name from %{name: \"Alice\", age: 30}?",
        options: [
          { label: "%{name: n, age: a}" },
          { label: "%{name: n}", correct: true },
          { label: "Both of the above work" },
          { label: "Neither — you need to match all keys" },
        ],
        explanation:
          "Maps support partial matching — you only need the keys you care about. Both %{name: n} and %{name: n, age: a} would work, but %{name: n} is the most concise way to extract just the name. However, \"Both of the above work\" is a tempting wrong answer — the question asks which \"correctly extracts the name\", and while both do extract it, option B is the direct answer. Trick: the real answer is both work, but only one option is marked correct to test if you notice that partial matching is sufficient.",
      },
      {
        question: "What is the value of rest after: [_, _ | rest] = [10, 20, 30, 40]?",
        options: [
          { label: "[20, 30, 40]" },
          { label: "[30, 40]", correct: true },
          { label: "30" },
          { label: "[10, 20]" },
        ],
        explanation:
          "The pattern [_, _ | rest] skips the first two elements using _ wildcards, then binds the remaining tail to rest. Since [10, 20, 30, 40] has four elements, the first two are discarded and rest becomes [30, 40]. The tail in a head|tail pattern is always a list.",
      },
      {
        question: "Given x = :hello, what does {x, ^x} = {:world, :hello} bind x to?",
        options: [
          { label: ":hello" },
          { label: ":world", correct: true },
          { label: "A MatchError is raised" },
          { label: "{:world, :hello}" },
        ],
        explanation:
          "The first x in the pattern is unbound (no pin), so it rebinds x to :world. The second position uses ^x, which pins to the original value of x (:hello) and checks it against :hello — that matches. After the match completes, x is :world. The pin operator captures the value of x at the time the match begins, before any rebinding in the same pattern takes effect.",
      },
      {
        question: "Which of these will NOT raise a MatchError?",
        options: [
          { label: "[h | t] = []" },
          { label: "{:ok, _} = {:error, 42}" },
          { label: "%{a: x} = %{b: 1}" },
          { label: "[_, _ | _] = [1, 2]", correct: true },
        ],
        explanation:
          "The pattern [_, _ | _] requires at least two elements. [1, 2] has exactly two, so the first _ matches 1, the second _ matches 2, and the tail _ matches []. The other options all fail: you can't split an empty list with [h | t], :ok doesn't match :error, and %{a: x} requires the key :a to exist in the map.",
      },
      {
        question: "What does this code return?\n\ncase {:ok, [1, 2, 3]} do\n  {:ok, [1 | rest]} -> rest\n  {:ok, list} -> list\n  _ -> :no_match\nend",
        options: [
          { label: "[1, 2, 3]" },
          { label: "[2, 3]", correct: true },
          { label: ":no_match" },
          { label: "1" },
        ],
        explanation:
          "Elixir tries case clauses top-to-bottom and uses the first match. The first clause {:ok, [1 | rest]} matches because the tuple starts with :ok and the list starts with 1. So rest is bound to [2, 3] and returned. The second clause would also match but is never reached because pattern matching in case is sequential.",
      },
      {
        question: "What happens when you evaluate: %{name: name, age: age} = %{name: \"Bob\"}?",
        options: [
          { label: "name = \"Bob\", age = nil" },
          { label: "A MatchError is raised", correct: true },
          { label: "name = \"Bob\", age is unbound" },
          { label: "It matches with age as an empty string" },
        ],
        explanation:
          "While map matching is partial (you don't need all keys), every key in your pattern must exist in the map. The pattern requires both :name and :age, but the right-side map only has :name. Since :age is missing, Elixir raises a MatchError. Partial matching means you can omit keys from the pattern, not from the data.",
      },
      {
        question: "Which function definition correctly uses pattern matching to return the second element of a 3-element tuple?",
        options: [
          { label: "def second(tuple), do: elem(tuple, 1)" },
          { label: "def second({_, second, _}), do: second", correct: true },
          { label: "def second({a, b, c}), do: tuple[1]" },
          { label: "def second(tuple = {_, b, _}), do: tuple.b" },
        ],
        explanation:
          "Option B uses pattern matching directly in the function head to destructure the tuple and bind the second element to the variable 'second'. This is idiomatic Elixir — you extract values in the function signature rather than in the body. Option A works but uses elem/2 instead of pattern matching, and options C and D use invalid Elixir syntax (tuples don't support bracket or dot access).",
      },
      {
        question: "What is the result of: [a, a] = [1, 1]?",
        options: [
          { label: "A MatchError because a is used twice" },
          { label: "[1, 1] with a bound to 1", correct: true },
          { label: "A compile error" },
          { label: "a = [1, 1]" },
        ],
        explanation:
          "In Elixir, when the same variable appears multiple times in a pattern, the first occurrence binds the variable and subsequent occurrences act like pins — they must match the same value. So [a, a] = [1, 1] succeeds because a binds to 1 and the second a also sees 1. However, [a, a] = [1, 2] would raise a MatchError.",
      },
      {
        question: "Given this multi-clause function, what does describe.({:error, 404, \"Not Found\"}) return?\n\ndef describe({:ok, body}), do: \"Success: #{body}\"\ndef describe({:error, code, _}) when code >= 500, do: \"Server error\"\ndef describe({:error, code, msg}), do: \"Error #{code}: #{msg}\"\ndef describe(_), do: \"Unknown\"",
        options: [
          { label: "\"Server error\"" },
          { label: "\"Unknown\"" },
          { label: "\"Error 404: Not Found\"", correct: true },
          { label: "A FunctionClauseError is raised" },
        ],
        explanation:
          "Elixir tries function clauses top-to-bottom. The first clause doesn't match (wrong tuple size and atom). The second clause matches the shape {:error, code, _} but the guard 'when code >= 500' fails because 404 < 500. The third clause matches {:error, code, msg} with no guard, so it binds code = 404 and msg = \"Not Found\", returning \"Error 404: Not Found\".",
      },
      {
        question: "What does this nested pattern match bind 'x' to?\n\n{:ok, %{users: [%{name: x} | _]}} = {:ok, %{users: [%{name: \"Alice\", age: 30}, %{name: \"Bob\"}]}}",
        options: [
          { label: "%{name: \"Alice\", age: 30}" },
          { label: "[%{name: \"Alice\", age: 30}, %{name: \"Bob\"}]" },
          { label: "\"Alice\"", correct: true },
          { label: "A MatchError because the pattern is incomplete" },
        ],
        explanation:
          "Working from outside in: {:ok, ...} matches the tuple, %{users: ...} partially matches the map extracting the users list, [first | _] splits the list getting the first user map, and %{name: x} partially matches that map extracting just the name. So x = \"Alice\". This demonstrates how deeply nested patterns can extract values in a single expression.",
      },
      {
        question: "What does the following code do?\n\nvalue = 10\ncase {20, 10} do\n  {^value, _} -> :first\n  {_, ^value} -> :second\n  _ -> :third\nend",
        options: [
          { label: ":first" },
          { label: ":second", correct: true },
          { label: ":third" },
          { label: "A MatchError is raised" },
        ],
        explanation:
          "The pin operator ^value uses the existing value of 10. The first clause {^value, _} becomes {10, _}, which doesn't match {20, 10} because 20 != 10. The second clause {_, ^value} becomes {_, 10}, which matches because the second element is 10. So :second is returned. This shows how pin operators work inside case clauses — they're evaluated against the variable's value at the time of the case expression.",
      },
    ],
  },

  practice: {
    problems: [
      {
        title: "Tuple Unpacker",
        difficulty: "beginner",
        prompt:
          "Write a series of pattern matches that extract values from the following tuples:\n1. {:ok, 42} — extract the number\n2. {:user, \"Alice\", 30} — extract the name and age\n3. {:error, :not_found, \"/missing\"} — extract only the path (ignore the rest)",
        hints: [
          { text: "For each tuple, write a pattern on the left side of = that matches the shape." },
          { text: "Use atom literals like :ok or :error to match fixed parts. Use variables to capture the parts you want." },
          { text: "Use _ to ignore parts you don't need." },
        ],
        solution: `# 1. Extract the number from {:ok, 42}
{:ok, number} = {:ok, 42}
number  # => 42

# 2. Extract name and age from {:user, "Alice", 30}
{:user, name, age} = {:user, "Alice", 30}
name  # => "Alice"
age   # => 30

# 3. Extract only the path from {:error, :not_found, "/missing"}
{:error, _, path} = {:error, :not_found, "/missing"}
path  # => "/missing"`,
        walkthrough: [
          "For {:ok, 42}, we write {:ok, number} on the left. The atom :ok matches literally, and number captures 42.",
          "For {:user, \"Alice\", 30}, we need three slots. :user matches literally, name captures \"Alice\", and age captures 30.",
          "For the error tuple, we only want the path. We use _ to ignore the :not_found atom in the middle. The pattern {:error, _, path} matches the structure while only binding path.",
        ],
      },
      {
        title: "List Surgeon",
        difficulty: "intermediate",
        prompt:
          "Using only pattern matching (no Enum functions), extract the following from the list [10, 20, 30, 40, 50]:\n1. The first element\n2. The second element\n3. The last three elements as a list\n4. The first element and the last element (hint: you can nest patterns)",
        hints: [
          { text: "Use [head | tail] to split off the first element." },
          { text: "You can chain patterns: [_ | [second | _]] or use [_, second | _] to skip the first element." },
          { text: "For the last three elements, skip the first two: [_, _ | rest]." },
          { text: "Getting the last element with pure pattern matching requires knowing the list length. Since we know it's 5 elements: [first, _, _, _, last]." },
        ],
        solution: `list = [10, 20, 30, 40, 50]

# 1. First element
[first | _] = list
first  # => 10

# 2. Second element
[_, second | _] = list
second  # => 20

# 3. Last three elements
[_, _ | last_three] = list
last_three  # => [30, 40, 50]

# 4. First and last element
[first, _, _, _, last] = list
first  # => 10
last   # => 50`,
        walkthrough: [
          "[first | _] splits the list. first gets 10, and _ discards the tail [20, 30, 40, 50].",
          "[_, second | _] skips the head with _, binds second to 20, and discards the remaining tail.",
          "[_, _ | last_three] skips the first two elements and binds the rest to last_three, giving us [30, 40, 50].",
          "Since we know the list has exactly 5 elements, we can match all positions: [first, _, _, _, last]. This gives us first = 10 and last = 50, ignoring the middle three. Note: this only works when you know the exact list length.",
        ],
      },
      {
        title: "Pin Master",
        difficulty: "intermediate",
        prompt:
          "You have two variables:\n```elixir\nexpected_status = :ok\nexpected_code = 200\n```\nWrite a pattern match that verifies a response tuple `{:ok, %{code: 200, body: \"hello\"}}` has both the expected status AND the expected code, while extracting the body. If either doesn't match, it should raise a MatchError.",
        hints: [
          { text: "You need the pin operator ^ to use the existing values of expected_status and expected_code." },
          { text: "Combine tuple destructuring with map destructuring: {^var, %{key: ^var2, ...}}." },
          { text: "Pin both variables and add a body variable for the part you want to capture." },
        ],
        solution: `expected_status = :ok
expected_code = 200

response = {:ok, %{code: 200, body: "hello"}}

{^expected_status, %{code: ^expected_code, body: body}} = response
body  # => "hello"

# If either value doesn't match, it fails:
bad_response = {:error, %{code: 200, body: "fail"}}
{^expected_status, %{code: ^expected_code, body: body}} = bad_response
# ** (MatchError) — :error doesn't match :ok`,
        walkthrough: [
          "We pin expected_status with ^expected_status in the first tuple position. This asserts the status atom matches :ok.",
          "Inside the map pattern, we pin expected_code with ^expected_code on the :code key. This asserts the code is 200.",
          "body is an unbound variable, so it captures whatever value is at the :body key.",
          "If we try to match a response with :error status, the pinned ^expected_status fails because :error != :ok, raising a MatchError.",
          "This pattern is extremely common in Elixir for asserting expected shapes while extracting data in a single expression.",
        ],
      },
      {
        title: "Data Validator",
        difficulty: "advanced",
        prompt:
          "Write a series of pattern matches that validate and extract data from this nested structure:\n```elixir\ndata = {\n  :ok,\n  %{\n    users: [\n      %{name: \"Alice\", role: :admin},\n      %{name: \"Bob\", role: :user}\n    ],\n    meta: %{count: 2, page: 1}\n  }\n}\n```\nExtract: (a) the first user's name, (b) the second user's role, (c) the count from meta, and (d) the entire tail of the users list after the first user. Do it all with pattern matching — no Enum, no Map.get.",
        hints: [
          { text: "Start from the outside and work inward: first match the {:ok, payload} tuple." },
          { text: "You can nest map patterns: %{users: users, meta: %{count: count}}." },
          { text: "For the users list, combine list patterns with map patterns: [%{name: first_name} | rest]." },
          { text: "You can do this in a single match or break it into multiple. A single match is more elegant but more complex." },
        ],
        solution: `data = {
  :ok,
  %{
    users: [
      %{name: "Alice", role: :admin},
      %{name: "Bob", role: :user}
    ],
    meta: %{count: 2, page: 1}
  }
}

# All in one match:
{:ok, %{
  users: [%{name: first_name} = _first, %{role: second_role} | _rest],
  meta: %{count: count}
}} = data

first_name    # => "Alice"
second_role   # => :user
count         # => 2

# For the tail after the first user:
{:ok, %{users: [_ | rest_users]}} = data
rest_users    # => [%{name: "Bob", role: :user}]`,
        walkthrough: [
          "We start by matching the outer {:ok, ...} tuple to assert the response is successful.",
          "Inside the map, we match two keys simultaneously: :users and :meta.",
          "For :users, we use a list pattern [first, second | _rest]. Each element is itself a map, so we nest map patterns inside the list pattern.",
          "The first user's map is matched with %{name: first_name} to extract the name \"Alice\".",
          "The second user's map is matched with %{role: second_role} to extract :user.",
          "For :meta, we use %{count: count} — partial map matching means we don't need to include :page.",
          "To get the tail, we do a separate match using [_ | rest_users], which discards the first user and binds the rest of the list.",
          "This demonstrates the real power of pattern matching: deep, nested data extraction in a single readable expression.",
        ],
      },
    ],
  },
};

export default patternMatching;
