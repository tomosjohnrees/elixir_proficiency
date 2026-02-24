import type { TaggedQuizQuestion } from "@/lib/types";
import basicDataTypes from "@/data/courses/elixir/topics/basic-data-types";
import patternMatching from "@/data/courses/elixir/topics/pattern-matching";
import listsAndTuples from "@/data/courses/elixir/topics/lists-and-tuples";
import mapsAndStructs from "@/data/courses/elixir/topics/maps-and-structs";
import controlFlow from "@/data/courses/elixir/topics/control-flow";
import functionsAndModules from "@/data/courses/elixir/topics/functions-and-modules";
import recursion from "@/data/courses/elixir/topics/recursion";
import enumerables from "@/data/courses/elixir/topics/enumerables";
import stringsInDepth from "@/data/courses/elixir/topics/strings-in-depth";
import processes from "@/data/courses/elixir/topics/processes";
import genserver from "@/data/courses/elixir/topics/genserver";
import supervisors from "@/data/courses/elixir/topics/supervisors";
import mixAndOtp from "@/data/courses/elixir/topics/mix-and-otp";
import testing from "@/data/courses/elixir/topics/testing";
import protocols from "@/data/courses/elixir/topics/protocols";
import behaviours from "@/data/courses/elixir/topics/behaviours";
import macros from "@/data/courses/elixir/topics/macros";
import errorHandling from "@/data/courses/elixir/topics/error-handling";
import comprehensions from "@/data/courses/elixir/topics/comprehensions";
import sigils from "@/data/courses/elixir/topics/sigils";
import ectoBasics from "@/data/courses/elixir/topics/ecto-basics";
import phoenixBasics from "@/data/courses/elixir/topics/phoenix-basics";
import liveview from "@/data/courses/elixir/topics/liveview";
import concurrencyPatterns from "@/data/courses/elixir/topics/concurrency-patterns";
import deployment from "@/data/courses/elixir/topics/deployment";

const allTopics = [
  basicDataTypes,
  patternMatching,
  listsAndTuples,
  mapsAndStructs,
  controlFlow,
  functionsAndModules,
  recursion,
  enumerables,
  stringsInDepth,
  processes,
  genserver,
  supervisors,
  mixAndOtp,
  testing,
  protocols,
  behaviours,
  macros,
  errorHandling,
  comprehensions,
  sigils,
  ectoBasics,
  phoenixBasics,
  liveview,
  concurrencyPatterns,
  deployment,
];

export const quizPool: TaggedQuizQuestion[] = allTopics.flatMap((topic) =>
  topic.quiz.questions.map((q) => ({
    ...q,
    topicSlug: topic.meta.slug,
    topicTitle: topic.meta.title,
    topicNumber: topic.meta.number,
  }))
);
