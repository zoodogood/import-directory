import FileSystem from 'fs/promises';
import Path from 'path';

const DEFAULT_REGEX = /^[^.].*?\.(?:js|ts)$/i;

class ImportDirectory {
  constructor({sync = true, subfolders = false, regex = DEFAULT_REGEX, callback, skipValidation = false, rootDirectory} = {}){
    this.sync       = sync;
    this.subfolders = subfolders;
    this.regex      = regex;
    this.callback   = callback;

    this.skipValidation = skipValidation;

    this.rootDirectory = rootDirectory ?? process.cwd();
  }

  async import(directoryPath){

    const filesPath = (await this.takeFilesPath({path: directoryPath, subfolders: this.subfolders}))
      .filter((path) => this.regex.test(Path.basename( path )));

    const list = [];
    const promises = [];


    for (const path of filesPath){

      const promise = this.importFile(path)
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


  async takeFilesPath({ path, subfolders, skipValidation }){
    path = this.#toAbsolutePath(path);

    const filesPath = (await FileSystem.readdir( path ))
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
      for (const path of folders){
        const filesNames = await this.takeFilesPath({ path, subfolders });
        files.push(...filesNames);
      }
    }

    return files;
  }

  async importFile(path){
    path = this.#normalizePath(
      this.#toAbsolutePath(path)
    );

    return await import(path);
  }




  async fileIsFolder(filePath){
    return (await FileSystem.lstat(filePath)).isDirectory();
  }


  #normalizePath(path){
    const isAbsolute = Path.isAbsolute(path);
    if (!isAbsolute)
      return path;

    return `file:${ path }`;
  }

  #toAbsolutePath(path){
    const isAbsolute = Path.isAbsolute(path);
    if (isAbsolute){
      return path;
    }

    path = `${ this.rootDirectory }/${ path }`;
    return path;
  }

}

export {ImportDirectory};
