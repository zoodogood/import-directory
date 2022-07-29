import {ImportDirectory} from '../index.js';

const callbackLogger = [];

const callback = ((module) => {
  callbackLogger.push(module);
})



const result = await new ImportDirectory({ callback, subfolders: true })
  .import("./tests/folder");


it("result value", () => {
  const resultToString = (result) => result.map((module) => module.default).join(", ");
  const compareString  = "Random Value, Random value in subfolder";

  if (resultToString(result) !== compareString)
    throw new Error();
})

it("callback working", () => {
  const isModule = (data) => data.module.default;
  const every = callbackLogger.every(isModule);

  if (!every)
    throw new Error();
})
