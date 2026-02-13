"use client";

import ConceptMapSVG from "./ConceptMapSVG";
import ConceptMapList from "./ConceptMapList";

export default function ConceptMap() {
  return (
    <>
      <div className="hidden md:block">
        <ConceptMapSVG />
      </div>
      <div className="md:hidden">
        <ConceptMapList />
      </div>
    </>
  );
}
