[NPM](https://www.npmjs.com/package/@zoodogood/import-directory) [GITHUB](https://github.com/zoodogood/import-directory)
Dynamically imports all files from a directory.
> **Warning**
> Supports only ES6 import*!
```js
import { ImportDirectory } from '@zoodogood/import-directory';

const options = {
  sync = true,
  subfolders = false,
  regex,
  callback: null,
  skipValidation = false
}

const result = await new ImportDirectory(options)
  .import(path);
```
