import type { TaggedQuizQuestion } from "@/lib/types";
import basicDataTypes from "@/data/topics/basic-data-types";
import patternMatching from "@/data/topics/pattern-matching";
import listsAndTuples from "@/data/topics/lists-and-tuples";
import mapsAndStructs from "@/data/topics/maps-and-structs";
import controlFlow from "@/data/topics/control-flow";
import functionsAndModules from "@/data/topics/functions-and-modules";
import recursion from "@/data/topics/recursion";
import enumerables from "@/data/topics/enumerables";
import stringsInDepth from "@/data/topics/strings-in-depth";
import processes from "@/data/topics/processes";
import genserver from "@/data/topics/genserver";
import supervisors from "@/data/topics/supervisors";
import mixAndOtp from "@/data/topics/mix-and-otp";
import testing from "@/data/topics/testing";
import protocols from "@/data/topics/protocols";
import behaviours from "@/data/topics/behaviours";
import macros from "@/data/topics/macros";
import errorHandling from "@/data/topics/error-handling";
import comprehensions from "@/data/topics/comprehensions";
import sigils from "@/data/topics/sigils";
import ectoBasics from "@/data/topics/ecto-basics";
import phoenixBasics from "@/data/topics/phoenix-basics";
import liveview from "@/data/topics/liveview";
import concurrencyPatterns from "@/data/topics/concurrency-patterns";
import deployment from "@/data/topics/deployment";

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
