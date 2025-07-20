"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createLinkMap(notes) {
  const linkMap = new Map();
  for (const note of notes) {
    // console.log(note);
    for (const link of note.links) {
      console.log(link);
      const targetTitle = link.targetTitle;
      const date = link.date;

      let backlinkEntryMap = linkMap.get(targetTitle);
      if (!backlinkEntryMap) {
        backlinkEntryMap = new Map();
        linkMap.set(targetTitle, backlinkEntryMap);
      }
      let contextList = backlinkEntryMap.get(note.title);
      if (!contextList) {
        contextList = [];
        backlinkEntryMap.set(note.title, contextList);
      }
      if (link.context) {
        contextList.push(link.context);
      }
    }
  }
  // console.log(linkMap.get("test2")); // need to add date here
  return linkMap;
}
exports.default = createLinkMap;
//# sourceMappingURL=createLinkMap.js.map
