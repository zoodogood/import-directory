import { ImportDirectory } from '../index.js';

let counter = 0;
const callback = () => counter++;

const options = {
  callback
}
const path = "./tests/folder";

const importModules = async () => {
  const importDirectory = new ImportDirectory(options);
  const modules = await importDirectory.import(path);
  it("Counter up of callback", () => counter > 0)
}
importModules();
