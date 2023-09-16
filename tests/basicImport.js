import { ImportDirectory } from '../lib/index.js';

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
  if (modules.length < 1){
    throw new Error("Modules not found");
  }
}
it("Basic Import", importModules);
