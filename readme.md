[NPM](https://www.npmjs.com/package/@zoodogood/import-directory), [GITHUB](https://github.com/zoodogood/import-directory)  
## Dynamically imports all files from a directory.
> **Warning:**  
> Supports only ES6 import*!
#### Basic usage
```js
import { ImportDirectory } from '@zoodogood/import-directory';

const path = "./folder";

const modules = await new ImportDirectory()
  .import(path);

modules.forEach(moduleExport => /*...*/)
```

#### With details
```js
import { ImportDirectory } from '@zoodogood/import-directory';

// the example shows the default values
const options = {
  // Import one by one
  sync: true,

  // Import files from subfolders
  subfolders: false,

  // Ignore files not matching regular expression. Default all files that do not start with a dot and ending with `.js` or `ts`
  regex: /^[^.].*?\.(?:js|ts)$/i,

  // Call a function on every import
  callback: null,

  // Check if files are folders
  skipValidation: false,

  // Required for relative paths to work properly
  rootDirectory: process.cwd()
}

// Relative path from project root folder or absolute path.
const path = "./folder";


const importDirectory = new ImportDirectory(options);
const modules = await importDirectory.import(path);

for (const module of modules){
  // You will see the data exported from the file, equal to what you get with a normal import
  console.info(module);
}
```
