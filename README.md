# note-link-janitor

This script is a fork from Andy Matuschak's [original script](https://github.com/andymatuschak/note-link-janitor).  


It reads in a folder of Markdown files, notes all the [[wiki-style links]] between them, then adds a special "Links to This Note" section which lists passages which reference a given file.

For example, this text might get added to `Sample note.md`:

```
## Links to This Note
* [[Something that links here]]
    * The block of text in the referencing note which contains the link to [[Sample note]].
    * Another block in that same note which links to [[Sample note]].
* [[A different note that links here]]
    * This is a paragraph from another note which links to [[Sample note]].
```

The script is idempotent; on subsequent runs, _it will update that backlinks section in-place_.

## Changes

- Updated most packages to latest version. Importantly, remark has been updated from 11 to 15.
- Ensures note content has new line and that there's a new line before the backlinks section
- Index.ts was refractored into different functions for readability
- removed the comments `<!--` function since it was breaking some of my notes with comments
- types are consolidated to types.ts