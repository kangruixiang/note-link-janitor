"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
const getBacklinksBlock_1 = require("./getBacklinksBlock");
const processor_1 = require("./processor");
function updateBacklinks(tree, noteContents, backlinks) {
  let insertionOffset;
  let oldEndOffset = -1;
  const backlinksInfo = getBacklinksBlock_1.default(tree);
  if (backlinksInfo.isPresent) {
    insertionOffset = backlinksInfo.start.position.start.offset;
    oldEndOffset = backlinksInfo.until
      ? backlinksInfo.until.position.start.offset
      : noteContents.length;
  } else {
    noteContents = noteContents + "\n\n";
    insertionOffset = backlinksInfo.insertionPoint
      ? backlinksInfo.insertionPoint.position.start.line
      : noteContents.length;
    // console.log(noteContents.length);
  }
  if (oldEndOffset === -1) {
    oldEndOffset = insertionOffset;
    // console.log(oldEndOffset, insertionOffset);
  }
  let backlinksString = "";
  if (backlinks.length > 0) {
    // const backlinkNodes = backlinks.map((entry) => ({
    //   type: "listItem",
    //   spread: false,
    //   children: [
    //     {
    //       type: "paragraph",
    //       children: [
    //         {
    //           type: "wikiLink",
    //           value: entry.sourceTitle,
    //           data: { alias: entry.sourceTitle },
    //         },
    //       ],
    //     },
    //     {
    //       type: "list",
    //       ordered: false,
    //       spread: false,
    //       children: entry.context.map((block) => ({
    //         type: "listItem",
    //         spread: false,
    //         children: [block],
    //       })),
    //     },
    //   ],
    // }));
    // const backlinkContainer = {
    //   type: "root",
    //   children: [
    //     {
    //       type: "list",
    //       ordered: false,
    //       spread: false,
    //       children: backlinkNodes,
    //     },
    //   ],
    // };
    console.log(backlinks);
    backlinksString = `## Backlinks\n${backlinks
      .map(
        (entry) =>
          `- [[${entry.sourceTitle}]] - ${entry.date}\n${entry.context
            .map(
              (block) =>
                `\t- ${processor_1.default
                  .stringify(block)
                  .replace(/\n.+/, "")}\n`
            )
            .join("")}`
      )
      .join("")}\n`;
  }
  const newNoteContents =
    noteContents.slice(0, insertionOffset) +
    backlinksString +
    noteContents.slice(oldEndOffset);
  return newNoteContents;
}
exports.default = updateBacklinks;
//# sourceMappingURL=updateBacklinks.js.map
