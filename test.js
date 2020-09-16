const fs = require("fs");

noteFolderPath = process.argv[2];

async function test() {
  const noteDirectoryEntries = await fs.promises.readdir(noteFolderPath, {
    withFileTypes: false,
  });
  console.log(noteDirectoryEntries);
}

test();
