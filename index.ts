#!/usr/bin/env node

import * as fs from "fs";
import graph from "pagerank.js";
import * as path from "path";

import createLinkMap from "./lib/createLinkMap.ts";
import readAllNotes from "./lib/readAllNotes.ts";
import updateBacklinks from "./lib/updateBacklinks.ts";
import type { NoteMap, LinkMap, LinkContextMap } from "./lib/types.ts";

class NoteClass {
    baseNotePath: string
    notes: NoteMap
    linkMap: LinkMap
    noteRankings: {
        [key: string]: number;
    }

    constructor(baseNotePath: string) {
        this.baseNotePath = baseNotePath
    }

    async writeContent(notePath: string, noteContents: string) {
        if (!notePath) {
            console.log('no notepath')
            return
        }

        await fs.promises.writeFile(
            path.join(baseNotePath, path.basename(notePath)),
            noteContents,
            { encoding: "utf-8" }
        );
    }

    getBacklinkEntry(backlinks: LinkContextMap) {
        if (!backlinks) return []

        return [...backlinks.keys()]
            .map(sourceTitle => ({
                sourceTitle,
                context: backlinks.get(sourceTitle)!
            }))
            .sort(
                (
                    { sourceTitle: sourceTitleA },
                    { sourceTitle: sourceTitleB }
                ) =>
                    (this.noteRankings[sourceTitleB] || 0) -
                    (this.noteRankings[sourceTitleA] || 0)
            )

    }

    async makeBacklinks() {
        await Promise.all(
            Object.keys(this.notes).map(async notePath => {
                const backlinks = this.linkMap.get(this.notes[notePath].title);
                const backlinkEntry = this.getBacklinkEntry(backlinks)

                const newContents = updateBacklinks(
                    this.notes[notePath].parseTree,
                    this.notes[notePath].noteContents,
                    backlinkEntry
                );

                if (newContents !== this.notes[notePath].noteContents) {
                    await this.writeContent(notePath, newContents)
                }
            })
        )
    }

    sortNotesByRank() {
        for (const note of this.linkMap.keys()) {
            const entry = this.linkMap.get(note)!;
            for (const linkingNote of entry.keys()) {
                graph.link(linkingNote, note, 1.0);
            }
        }
        const noteRankings = {}
        graph.rank(0.85, 0.000001, function (node, rank) {
            noteRankings[node] = rank;
        });
        this.noteRankings = noteRankings
    }

    async mainFunc() {

        if (!this.baseNotePath || this.baseNotePath === "--help") {
            console.log("Usage: note-link-janitor [NOTE_DIRECTORY]");
            return;
        }

        console.log("Reading notes...")
        this.notes = await readAllNotes(baseNotePath);
        this.linkMap = createLinkMap(Object.values(this.notes));

        // Sort by PageRank
        this.sortNotesByRank()

        // Make or update backlinks
        console.log("Making backlinks...")
        await this.makeBacklinks()
    }
}

const baseNotePath = process.argv[2];
const newNotes = new NoteClass(baseNotePath)
newNotes.mainFunc()
