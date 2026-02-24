import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What does 10 / 3 return in Ruby?",
    options: [
      { label: "3", correct: true },
      { label: "3.3333333333333335" },
      { label: "3.33" },
      { label: "An error" },
    ],
    explanation:
      "In Ruby, integer division returns an integer. 10 / 3 gives 3 because both operands are integers. To get a float result, at least one operand must be a float: 10.0 / 3 or 10 / 3.0.",
  },
  {
    question: "Which of these is NOT a valid way to create a string in Ruby?",
    options: [
      { label: "\"hello\"" },
      { label: "'hello'" },
      { label: "`hello`", correct: true },
      { label: "%q(hello)" },
    ],
    explanation:
      "Backticks in Ruby execute a shell command and return the output — they don't create a string literal in the usual sense. Double quotes, single quotes, and %q() are all string creation syntaxes. %q() behaves like single quotes (no interpolation), while %Q() behaves like double quotes.",
  },
  {
    question: "What is the value of x after: x = nil; x ||= 'hello'?",
    options: [
      { label: "nil" },
      { label: "'hello'", correct: true },
      { label: "An error" },
      { label: "false" },
    ],
    explanation:
      "The ||= operator assigns the right-hand value only if the variable is nil or false. Since x is nil, x ||= 'hello' assigns 'hello' to x. This is a very common Ruby idiom for setting default values.",
  },
  {
    question: "What does 'hello'.frozen? return in Ruby 3+?",
    options: [
      { label: "true" },
      { label: "false", correct: true },
      { label: "nil" },
      { label: "An error" },
    ],
    explanation:
      "String literals are mutable by default in Ruby 3+, unless you add the magic comment # frozen_string_literal: true at the top of the file. Without it, each string literal creates a new mutable String object. The freeze method or the magic comment makes strings immutable.",
  },
  {
    question: "Which values are falsy in Ruby?",
    options: [
      { label: "false, nil, 0, and \"\"" },
      { label: "false and nil only", correct: true },
      { label: "false, nil, 0, \"\", and []" },
      { label: "false only" },
    ],
    explanation:
      "Ruby has exactly two falsy values: false and nil. Everything else is truthy, including 0, empty strings \"\", empty arrays [], and even the symbol :false. This is simpler than many other languages.",
  },
  {
    question: "What does 5.class return in Ruby?",
    options: [
      { label: "Fixnum" },
      { label: "Integer", correct: true },
      { label: "Number" },
      { label: "Numeric" },
    ],
    explanation:
      "Since Ruby 2.4, Fixnum and Bignum were unified into a single Integer class. So 5.class returns Integer. Integer inherits from Numeric, but .class returns the most specific class, not the parent.",
  },
  {
    question: "What is the difference between puts and p in Ruby?",
    options: [
      { label: "puts calls .to_s, p calls .inspect", correct: true },
      { label: "They are aliases for the same method" },
      { label: "p prints to stderr, puts prints to stdout" },
      { label: "puts adds a newline, p does not" },
    ],
    explanation:
      "puts converts the object to a string using .to_s and prints it with a newline. p uses .inspect instead, which shows the object's representation (e.g., strings include quotes, nil shows as 'nil'). p also returns the object, making it useful for debugging.",
  },
  {
    question: "What does \"hello\" == 'hello' evaluate to?",
    options: [
      { label: "true", correct: true },
      { label: "false" },
      { label: "nil" },
      { label: "An error" },
    ],
    explanation:
      "In Ruby, double-quoted and single-quoted strings are the same type (String). The difference is only at parse time: double quotes support interpolation and escape sequences like \\n, while single quotes treat content literally (except for \\\\ and \\'). The resulting String objects are equal if they contain the same characters.",
  },
  {
    question: "What is the result of 2 ** 10 in Ruby?",
    options: [
      { label: "20" },
      { label: "1024", correct: true },
      { label: "An error — Ruby has no exponent operator" },
      { label: "100" },
    ],
    explanation:
      "** is Ruby's exponentiation operator. 2 ** 10 raises 2 to the power of 10, returning 1024. Ruby integers have arbitrary precision, so you can compute very large powers without overflow: 2 ** 1000 works perfectly.",
  },
  {
    question: "What does nil.to_i return?",
    options: [
      { label: "nil" },
      { label: "0", correct: true },
      { label: "An error (NoMethodError)" },
      { label: "false" },
    ],
    explanation:
      "nil has conversion methods that return sensible defaults: nil.to_i returns 0, nil.to_f returns 0.0, nil.to_s returns \"\", and nil.to_a returns []. This is different from calling Integer(nil), which raises a TypeError.",
  },
  {
    question: "What is the spaceship operator <=> used for?",
    options: [
      { label: "Bitwise comparison" },
      { label: "Combined comparison that returns -1, 0, or 1", correct: true },
      { label: "Pattern matching" },
      { label: "Null coalescing" },
    ],
    explanation:
      "The <=> (spaceship) operator compares two values and returns -1 (left is less), 0 (equal), or 1 (left is greater). It returns nil if the values aren't comparable. It's used by sort methods and is the basis of the Comparable module.",
  },
  {
    question: "What does 'hello'.object_id == 'hello'.object_id return?",
    options: [
      { label: "true" },
      { label: "false", correct: true },
      { label: "It depends on the Ruby version" },
      { label: "An error" },
    ],
    explanation:
      "Each string literal creates a new String object in memory (unless frozen string literals are enabled). So two 'hello' literals have different object_ids. This is unlike symbols and integers, which are immutable and reuse the same object. Use .equal? or compare object_ids to check identity.",
  },
  {
    question: "What does Integer('hello') do?",
    options: [
      { label: "Returns 0" },
      { label: "Returns nil" },
      { label: "Raises an ArgumentError", correct: true },
      { label: "Returns 'hello'.hash" },
    ],
    explanation:
      "Integer() is a strict conversion method (a Kernel method, not a class method). Unlike 'hello'.to_i (which returns 0 for non-numeric strings), Integer('hello') raises an ArgumentError because the string doesn't represent a valid integer. Use Integer() when you want to enforce valid input.",
  },
  {
    question: "Which variable naming convention indicates an instance variable in Ruby?",
    options: [
      { label: "variable" },
      { label: "@variable", correct: true },
      { label: "$variable" },
      { label: "@@variable" },
    ],
    explanation:
      "Ruby uses sigils (prefix characters) to indicate variable scope: no prefix for local variables, @ for instance variables, @@ for class variables, and $ for global variables. Constants start with an uppercase letter. This naming convention is enforced by the language, not just a style choice.",
  },
  {
    question: "What does 3.times.to_a return?",
    options: [
      { label: "[1, 2, 3]" },
      { label: "[0, 1, 2]", correct: true },
      { label: "[3, 3, 3]" },
      { label: "An error" },
    ],
    explanation:
      "3.times without a block returns an Enumerator that yields 0, 1, 2 (zero-indexed, up to but not including 3). Calling .to_a on it converts the enumerator to an array: [0, 1, 2]. If you want [1, 2, 3], use 1.upto(3).to_a instead.",
  },
];

export default questions;
