"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const read = require("fs-readdir-recursive");
const path = require("path");
const remark = require("remark");
const glob = require("glob");
const find = require("unist-util-find");
const getNoteLinks_1 = require("./getNoteLinks");
const processor_1 = require("./processor");
const missingTitleSentinel = { type: "missingTitle" };
const missingFrontmatter = { type: "missingFrontmatter" };
const headingFinder = processor_1
  .default()
  .use(() => (tree) =>
    find(tree, { type: "heading", depth: 1 }) || missingTitleSentinel
  );
const fmFinder = processor_1
  .default()
  .use(() => (tree) => find(tree, { type: "yaml" }) || missingFrontmatter);
async function readNote(notePath) {
  const noteContents = await fs.promises.readFile(notePath, {
    encoding: "utf-8",
  });
  const parseTree = processor_1.default.parse(noteContents);
  const headingNode = await headingFinder.run(parseTree);
  const existingFrontmatter = await fmFinder.run(parseTree);
  let noteDate = existingFrontmatter.value;
  noteDate = new Date(noteDate.replace("- date:", ""));
  // console.log(noteDate);
  // if (headingNode.type === "missingTitle") {
  //   throw new Error(`${notePath} has no title`);
  // }
  // const title = remark()
  //   .stringify({
  //     type: "root",
  //     children: headingNode.children,
  //   })
  //   .trimEnd();
  const title = path.basename(notePath, ".md");
  return {
    title,
    links: getNoteLinks_1.default(parseTree),
    date: noteDate,
    parseTree,
    noteContents,
  };
}
async function readAllNotes(noteFolderPath) {
  // const noteDirectoryEntries = await fs.promises.readdir(noteFolderPath, {
  //   withFileTypes: true,
  // });

  const noteDirectoryEntries = glob.sync(path.join(noteFolderPath, "**/*.md"));
  console.log(noteDirectoryEntries);
  const notePaths = noteDirectoryEntries;
  // .filter(
  //   (entry) =>
  //     entry.isFile() &&
  //     !entry.name.startsWith(".") &&
  //     entry.name.endsWith(".md")
  // )
  // .map((entry) => path.join(noteFolderPath, entry.name));
  // console.log(notePaths);
  const noteEntries = await Promise.all(
    notePaths.map(async (notePath) => [notePath, await readNote(notePath)])
  );
  // console.log(noteEntries);
  return Object.fromEntries(noteEntries);
}
exports.default = readAllNotes;
//# sourceMappingURL=readAllNotes.js.map
