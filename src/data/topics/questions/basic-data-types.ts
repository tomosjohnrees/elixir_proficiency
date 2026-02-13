import type { QuizQuestion } from "@/lib/types";

const questions: QuizQuestion[] = [
  {
    question: "What does 10 / 3 return in Elixir?",
    options: [
      { label: "3" },
      { label: "3.3333333333333335", correct: true },
      { label: "3.33" },
      { label: "An error" },
    ],
    explanation:
      "The / operator in Elixir always returns a float, even when both operands are integers. To get integer division, use div(10, 3) which returns 3.",
  },
  {
    question: "Which of these is NOT an atom?",
    options: [
      { label: ":hello" },
      { label: "true" },
      { label: "\"ok\"", correct: true },
      { label: "nil" },
    ],
    explanation:
      "\"ok\" is a string (double-quoted), not an atom. :hello is an atom, and true and nil are special atoms (:true and :nil under the hood).",
  },
  {
    question: "What does 1 === 1.0 evaluate to?",
    options: [
      { label: "true" },
      { label: "false", correct: true },
      { label: "An error" },
      { label: "nil" },
    ],
    explanation:
      "The === operator checks both value and type. 1 is an integer and 1.0 is a float — different types, so it returns false. The == operator would return true because it allows number coercion.",
  },
  {
    question: "Which value is truthy in Elixir?",
    options: [
      { label: "false" },
      { label: "nil" },
      { label: "0", correct: true },
      { label: "All of the above are falsy" },
    ],
    explanation:
      "In Elixir, only false and nil are falsy. Everything else is truthy — including 0, empty strings \"\", and empty lists []. This differs from languages like JavaScript or Python.",
  },
  {
    question: "How do you concatenate two strings in Elixir?",
    options: [
      { label: "\"a\" + \"b\"" },
      { label: "\"a\" ++ \"b\"" },
      { label: "\"a\" <> \"b\"", correct: true },
      { label: "concat(\"a\", \"b\")" },
    ],
    explanation:
      "The <> operator is used for string concatenation in Elixir. The + operator is for numbers, ++ is for list concatenation, and there's no built-in concat function for strings.",
  },
  {
    question: "What is the result of is_atom(true) in Elixir?",
    options: [
      { label: "false" },
      { label: "true", correct: true },
      { label: "An ArgumentError" },
      { label: ":true" },
    ],
    explanation:
      "In Elixir, booleans are atoms under the hood. true is actually the atom :true and false is the atom :false. Therefore is_atom(true) returns true, and is_boolean(:true) also returns true.",
  },
  {
    question: "What does the expression 'hello' represent in Elixir?",
    options: [
      { label: "A string, same as \"hello\"" },
      { label: "A charlist (list of character codepoints)", correct: true },
      { label: "An atom" },
      { label: "A syntax error" },
    ],
    explanation:
      "Single-quoted values in Elixir are charlists, not strings. A charlist is a list of integer codepoints, so 'hello' is equivalent to [104, 101, 108, 108, 111]. Double-quoted values like \"hello\" are UTF-8 encoded binaries (strings). Confusing the two is a common mistake for newcomers.",
  },
  {
    question: "What does div(-7, 2) return in Elixir?",
    options: [
      { label: "-4" },
      { label: "-3", correct: true },
      { label: "-3.5" },
      { label: "3" },
    ],
    explanation:
      "Elixir's div/2 performs truncated integer division, meaning it rounds toward zero rather than toward negative infinity. So div(-7, 2) returns -3, not -4. This is important to understand when working with negative numbers and integer division.",
  },
  {
    question: "What happens when you evaluate the expression: not 0",
    options: [
      { label: "true, because 0 is falsy" },
      { label: "false, because 0 is truthy" },
      { label: "An ArgumentError, because not requires a boolean", correct: true },
      { label: "nil" },
    ],
    explanation:
      "The strict boolean operator not requires its argument to be an actual boolean (true or false). Passing 0 raises an ArgumentError. If you want to negate a truthy/falsy value, use the relaxed operator ! instead — !0 returns false because 0 is truthy in Elixir.",
  },
  {
    question: "Which of the following correctly describes Elixir's cross-type comparison ordering?",
    options: [
      { label: "Comparing different types always raises an error" },
      { label: "number < atom < reference < function < port < pid < tuple < map < list < bitstring", correct: true },
      { label: "atom < number < list < tuple < map < bitstring" },
      { label: "Types are compared alphabetically by their type name" },
    ],
    explanation:
      "Elixir defines a global term ordering that allows values of different types to be compared. The ordering is: number < atom < reference < function < port < pid < tuple < map < list < bitstring. This means 1 < :atom and {:a} < [1] are both true. This is essential knowledge for understanding how Enum.sort works on heterogeneous collections.",
  },
  {
    question: "What is the result of String.length(\"café\")?",
    options: [
      { label: "5" },
      { label: "4", correct: true },
      { label: "6" },
      { label: "An error because of the non-ASCII character" },
    ],
    explanation:
      "String.length/1 counts Unicode graphemes, not bytes. The string \"café\" contains 4 graphemes (c, a, f, é), so it returns 4. However, byte_size(\"café\") would return 5 because the é character takes 2 bytes in UTF-8 encoding. This distinction between grapheme count and byte size is critical when working with internationalized text.",
  },
  {
    question: "What does the expression 1.0e309 evaluate to in Elixir?",
    options: [
      { label: "A very large float" },
      { label: "Infinity" },
      { label: "A compile-time error due to float overflow", correct: true },
      { label: "0.0" },
    ],
    explanation:
      "Unlike some languages that return Infinity for float overflow, Elixir (via the BEAM) raises a compile-time error (TokenMissingError or equivalent) because 1.0e309 exceeds the maximum representable 64-bit IEEE 754 double-precision float. Elixir does not have Infinity or NaN as valid float values.",
  },
  {
    question: "What does nil && \"hello\" return?",
    options: [
      { label: "\"hello\"" },
      { label: "false" },
      { label: "nil", correct: true },
      { label: "An ArgumentError" },
    ],
    explanation:
      "The relaxed && operator short-circuits on falsy values. Since nil is falsy, it returns nil immediately without evaluating the right-hand side. Note that && returns the actual value that determined the result, not necessarily a boolean. This is different from the strict and operator, which would raise an ArgumentError because nil is not a boolean.",
  },
  {
    question: "What is the maximum size of an integer in Elixir?",
    options: [
      { label: "2^63 - 1 (same as a 64-bit signed integer)" },
      { label: "2^128 - 1" },
      { label: "There is no fixed maximum — integers have arbitrary precision", correct: true },
      { label: "It depends on the OS architecture (32-bit vs 64-bit)" },
    ],
    explanation:
      "Elixir integers have arbitrary precision, meaning they can grow as large as available memory allows. The BEAM VM automatically transitions between small integers (fitting in a machine word) and big integers (heap-allocated) transparently. There is no overflow and no need for a special BigInteger type.",
  },
  {
    question: "What does the expression \"hello\" > :world evaluate to?",
    options: [
      { label: "true", correct: true },
      { label: "false" },
      { label: "An ArgumentError because you can't compare strings and atoms" },
      { label: "nil" },
    ],
    explanation:
      "Elixir allows comparison between any types using the global term ordering: number < atom < reference < function < port < pid < tuple < map < list < bitstring. Since strings are bitstrings and atoms come before bitstrings in the ordering, \"hello\" > :world evaluates to true. This cross-type comparison capability is used internally by sorting functions.",
  },
];

export default questions;
