"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const visitParents = require("unist-util-visit-parents");
const getBacklinksBlock_1 = require("./getBacklinksBlock");
const find = require("unist-util-find");
const processor_1 = require("./processor");
const blockTypes = [
  "paragraph",
  "heading",
  "thematicBreak",
  "blockquote",
  "list",
  "table",
  "html",
  "code",
];
function isBlockContent(node) {
  return blockTypes.includes(node.type);
}
function getNoteLinks(tree) {
  // Strip out the backlinks section
  const backlinksInfo = getBacklinksBlock_1.default(tree);
  let searchedChildren;
  if (backlinksInfo.isPresent) {
    searchedChildren = tree.children
      .slice(
        0,
        tree.children.findIndex((n) => n === backlinksInfo.start)
      )
      .concat(
        tree.children.slice(
          backlinksInfo.until
            ? tree.children.findIndex((n) => n === backlinksInfo.until)
            : tree.children.length
        )
      );
  } else {
    searchedChildren = tree.children;
  }
  const links = [];
  // finds nodes based on conditions

  const existingFrontmatter = find(tree, function (node) {
    return node.type === "yaml";
  });

  let noteDate = existingFrontmatter.value;
  noteDate = noteDate.replace("- date:", "");

  visitParents(
    { ...tree, children: searchedChildren },
    "wikiLink",
    (node, ancestors) => {
      // console.log(ancestors);
      const closestBlockLevelAncestor = ancestors.reduceRight(
        (result, needle) => result || (isBlockContent(needle) ? needle : null),
        null
      );
      links.push({
        targetTitle: node.data.alias,
        date: noteDate,
        context: closestBlockLevelAncestor,
      });
      return true;
    }
  );
  // console.log(links);
  return links;
}
exports.default = getNoteLinks;
//# sourceMappingURL=getNoteLinks.js.map
