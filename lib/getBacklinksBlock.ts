import type { Html, Root, Heading } from "mdast";
import type { Node } from 'unist'
import { is } from 'unist-util-is'

type BackLinksBlock = {
    isPresent: true;
    start: Node;
    until: Node | null;
} | {
    isPresent: false;
    insertionPoint: Node | null;
}


export default function getBacklinksBlock(tree: Root): BackLinksBlock {
    const existingBacklinksNodeIndex = tree.children.findIndex(
        (node: Node): node is Heading =>
            is(node, {
                type: "heading",
                depth: 2
            }) && is((node as Heading).children[0], { value: "Links to this note" })
    );
    if (existingBacklinksNodeIndex === -1) {
        const insertionPoint = null;
        return {
            isPresent: false,
            insertionPoint
        };
    } else {
        const followingNode = null;
        return {
            isPresent: true,
            start: tree.children[existingBacklinksNodeIndex],
            until: followingNode
        };
    }
}


// // Hacky type predicate here.
// function isClosingMatterNode(node: Node): node is Node {
//     return "value" in node && (node as Html).value.startsWith("<!--");
// }
