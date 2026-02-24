"use client";

import ConceptMapSVG from "./ConceptMapSVG";
import ConceptMapList from "./ConceptMapList";

export default function ConceptMap({ courseSlug }: { courseSlug: string }) {
  return (
    <>
      <div className="hidden md:block">
        <ConceptMapSVG courseSlug={courseSlug} />
      </div>
      <div className="md:hidden">
        <ConceptMapList courseSlug={courseSlug} />
      </div>
    </>
  );
}
