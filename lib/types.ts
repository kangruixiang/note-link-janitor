import type { BlockContent, Root } from "mdast";
import type { Node } from "unist";

export interface NoteLinkEntry {
    targetTitle: string;
    context: BlockContent | null;
}

export interface Note {
    title: string;
    links: NoteLinkEntry[];
    noteContents: string;
    parseTree: Root;
}

export type NoteMap = {
    [key: string]: Note
}

export interface BacklinkEntry {
    sourceTitle: string;
    context: BlockContent[];
}

export interface WikiLinkNode extends Node {
    value: string;
    data: {
        alias: string;
        permalink: string;
    };
}


export type LinkContextMap = Map<string, BlockContent[]>
export type LinkMap = Map<string, LinkContextMap>