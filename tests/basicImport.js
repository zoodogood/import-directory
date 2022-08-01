import { ImportDirectory } from '../index.js';

const options = {
  sync: true,

  subfolders: false,

  regex: /^[^.].+?\.js$/i,

  callback: null,

  skipValidation: false
}


const path = "./tests/folder";



const importModules = async () => {
  const importDirectory = new ImportDirectory(options);
  const modules = await importDirectory.import(path);
}
it("Basic Import", importModules);
