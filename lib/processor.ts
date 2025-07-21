import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkWikiLink from "remark-wiki-link";
import { unified } from "unified";
import type { Link } from 'mdast';
import { visit } from "unist-util-visit";


function allLinksHaveTitles() {
    return (tree) => {
        visit(tree, "link", (node: Link) => {
            if (!node.title) {
                node.title = "";
            }
        });
    };
};


const processor = unified()
    .use(remarkParse)
    .use(remarkStringify, {
        bullet: "-",
        emphasis: "*",
        listItemIndent: "1",
        rule: "-",
        ruleSpaces: false,
    })
    .use(allLinksHaveTitles)
    .use(remarkWikiLink);

export default processor;
