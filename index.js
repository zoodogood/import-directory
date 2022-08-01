import FileSystem from 'fs';
import Path from 'path';

const DEFAULT_REGEX = /^[^.].+?\.js$/i;

class ImportDirectory {
  constructor({sync = true, subfolders = false, regex = DEFAULT_REGEX, callback, skipValidation = false}){
    this.sync       = sync;
    this.subfolders = subfolders;
    this.regex      = regex;
    this.callback   = callback;

    this.skipValidation = skipValidation;
  }


  takeFilesPath({ path, subfolders, skipValidation }){
    const filesPath = FileSystem.readdirSync( path )
      .map(name => `${ path }/${ name }`);

    if (skipValidation){
      return names;
    }

    const folders = [];
    const files   = [];

    const isFolder = this.fileIsFolder.bind(this);

    for (const path of filesPath)
      (isFolder(path) ? folders : files)
        .push(path);


    if (subfolders){
      folders.forEach(path => {
        const filesNames = this.takeFilesPath({ path, subfolders });

        files.push(...filesNames);
      });

    }

    return files;
  }


  async import(directoryPath){
    const filesPath = this.takeFilesPath({path: directoryPath, subfolders: this.subfolders})
      .filter((path) => this.regex.test(Path.basename( path )));

    const list = [];
    const promises = [];


    for (let path of filesPath){
      path = this.#normalizePath(path);

      const promise = import(path)
        .then(moduleImport => {
          list.push(moduleImport);
          this.callback?.({ path, module: moduleImport });
        });


      this.sync ?
        await promise :
        promises.push(promise);

    }

    await Promise.all(promises);
    return list;
  }


  fileIsFolder(filePath){
    return FileSystem.lstatSync(filePath).isDirectory();
  }


  #normalizePath(path){
    const isAbsolute = Path.isAbsolute(path);
    if (!isAbsolute)
      return path;

    return `file:${ path }`;
  }

}

export {ImportDirectory};
