import type { TopicMeta } from "@/lib/types";

export const topicRegistry: TopicMeta[] = [
  // Foundations
  { slug: "basic-data-types", title: "Basic Data Types & Variables", description: "Integers, floats, strings, booleans, nil, type conversion, and variable assignment", number: 1, active: true },
  { slug: "operators-and-expressions", title: "Operators & Expressions", description: "Arithmetic, comparison, logical, ternary, range, and assignment operators", number: 2, active: false },
  { slug: "control-flow", title: "Control Flow", description: "if/unless, case/when, while/until, for, loop, break, next, and redo", number: 3, active: false },
  { slug: "methods", title: "Methods & Arguments", description: "Defining methods, default parameters, keyword arguments, splat operators, and return values", number: 4, active: false },
  { slug: "blocks-and-iterators", title: "Blocks & Iterators", description: "Block syntax, yield, block_given?, each, times, upto, and custom iterators", number: 5, active: false },
  { slug: "scope-and-closures", title: "Scope & Closures", description: "Local, instance, class, and global variables, lexical scope, and closure behavior", number: 6, active: false },

  // Data Processing
  { slug: "strings-in-depth", title: "Strings in Depth", description: "Interpolation, encoding, heredocs, frozen strings, and the String API", number: 7, active: false },
  { slug: "symbols", title: "Symbols", description: "Symbols vs strings, the symbol table, frozen symbols, and idiomatic usage", number: 8, active: false },
  { slug: "arrays", title: "Arrays", description: "Creation, indexing, slicing, common methods, sorting, and array manipulation", number: 9, active: false },
  { slug: "hashes", title: "Hashes", description: "Hash creation, default values, symbol keys, merging, and iteration", number: 10, active: false },
  { slug: "enumerables", title: "Enumerables & Lazy Enumerators", description: "Enumerable module, map, select, reduce, inject, group_by, and lazy evaluation", number: 11, active: false },
  { slug: "regular-expressions", title: "Regular Expressions", description: "Regexp literals, match operator, captures, named groups, and gsub/scan", number: 12, active: false },

  // Object-Oriented Programming
  { slug: "classes-and-objects", title: "Classes & Objects", description: "Class definition, initialize, instance variables, attr_accessor, and object identity", number: 13, active: false },
  { slug: "inheritance", title: "Inheritance & Method Lookup", description: "Single inheritance, super, method resolution order, and the ancestors chain", number: 14, active: false },
  { slug: "modules-and-mixins", title: "Modules & Mixins", description: "Include, extend, prepend, namespacing, and the mixin pattern", number: 15, active: false },
  { slug: "access-control", title: "Access Control & Encapsulation", description: "Public, private, protected methods, and encapsulation best practices", number: 16, active: false },
  { slug: "duck-typing", title: "Duck Typing & Polymorphism", description: "respond_to?, send, dynamic dispatch, and polymorphic design", number: 17, active: false },
  { slug: "structs-and-data", title: "Struct, Data & OpenStruct", description: "Struct class, Data class (Ruby 3.2+), OpenStruct, and value objects", number: 18, active: false },

  // Abstraction & Metaprogramming
  { slug: "procs-and-lambdas", title: "Procs, Lambdas & Closures", description: "Proc.new, lambda, Method objects, currying, and the & operator", number: 19, active: false },
  { slug: "error-handling", title: "Error Handling", description: "begin/rescue/ensure/raise, custom exceptions, retry, and exception hierarchy", number: 20, active: false },
  { slug: "pattern-matching", title: "Pattern Matching", description: "case/in expressions, find patterns, pin operator, and guard clauses (Ruby 3+)", number: 21, active: false },
  { slug: "metaprogramming", title: "Metaprogramming", description: "define_method, method_missing, respond_to_missing?, class_eval, and instance_eval", number: 22, active: false },
  { slug: "dsls", title: "DSLs & Advanced Metaprogramming", description: "Building DSLs, hooks, inherited, included, method_added, and open classes", number: 23, active: false },

  // Ecosystem
  { slug: "gems-and-bundler", title: "RubyGems & Bundler", description: "Gem management, Gemfile, Bundler workflow, and creating gems", number: 24, active: false },
  { slug: "testing", title: "Testing with RSpec & Minitest", description: "RSpec describe/context/it, Minitest assertions, mocks, stubs, and TDD workflow", number: 25, active: false },
  { slug: "rack-and-web", title: "Rack & Web Basics", description: "Rack interface, middleware, request/response cycle, and Sinatra basics", number: 26, active: false },
  { slug: "rails-overview", title: "Rails Overview", description: "MVC architecture, routing, controllers, views, and the Rails way", number: 27, active: false },
  { slug: "active-record", title: "Active Record Basics", description: "Migrations, associations, validations, callbacks, and query interface", number: 28, active: false },

  // Tooling & Advanced
  { slug: "concurrency", title: "Concurrency & Ractors", description: "Threads, Mutex, Fiber, Ractor (Ruby 3+), and the GVL", number: 29, active: false },
  { slug: "debugging-and-tooling", title: "Debugging & Profiling", description: "IRB, Pry, debug gem, Benchmark, and profiling tools", number: 30, active: false },
];
