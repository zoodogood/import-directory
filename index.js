import FileSystem from 'fs/promises';
import Path from 'path';

const DEFAULT_REGEX = /^[^.].*?\.(?:js|ts)$/i;


/**
 * @typedef ImportDirectoryOptions
 * @property {boolean} [sync=true]
 * @property {boolean} [subfolders=false]
 * @property {RegExp} [regex = DEFAULT_REGEX]
 * @property {Function} [callback]
 * @property {boolean} [skipValidation=false]
 * @property {string} [rootDirectory]
 */

/**
 * @typedef takeFilePathOptions
 * @property {string} path
 * @property {boolean} [skipValidation]
 * @property {boolean} [subfolders]
*/

class ImportDirectory {
  /**
   * @param {ImportDirectoryOptions} param0 
   */
  constructor({sync = true, subfolders = false, regex = DEFAULT_REGEX, callback, skipValidation = false, rootDirectory} = {}){
    this.sync       = sync;
    this.subfolders = subfolders;
    this.regex      = regex;
    this.callback   = callback;

    this.skipValidation = skipValidation;

    this.rootDirectory = rootDirectory ?? process.cwd();
  }

  /**
   * @param {string} directoryPath 
   * @returns {Promise<module[]>}
   */
  async import(directoryPath){

    const filesPath = await this.takeFilesPath({path: directoryPath, subfolders: this.subfolders});
      

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


  /**
   * 
   * @param {takeFilePathOptions} param0 
   * @returns {Promise<string[]>}
  */
  async takeFilesPath({ path, subfolders, skipValidation }){
    const filesPaths = await this.#findFilesInDirectory({ path, subfolders, skipValidation });
    const isValidPath = (path) => this.regex.test(Path.basename( path ));
    
    return filesPaths.filter(isValidPath);
  }

  /**
   * 
   * @param {string} path 
   * @returns {Promise<module>}
   */
  async importFile(path){
    path = this.#normalizePath(
      this.#toAbsolutePath(path)
    );

    return await import(path);
  }



  /**
   * 
   * @param {string} filePath 
   * @returns {Promise<boolean>}
   */
  async fileIsFolder(filePath){
    const stat = await FileSystem.lstat(filePath);
    return stat.isDirectory();
  }


  /**
   * @param {string} path 
   * @returns {string}
   */
  #normalizePath(path){
    const isAbsolute = Path.isAbsolute(path);
    if (!isAbsolute)
      return path;

    return `file:${ path }`;
  }

  /**
   * @param {string} path 
   * @returns {string}
  */
  #toAbsolutePath(path){
    const isAbsolute = Path.isAbsolute(path);
    if (isAbsolute){
      return path;
    }

    path = `${ this.rootDirectory }/${ path }`;
    return path;
  }

  /**
   * 
   * @param {takeFilePathOptions} param0 
   * @returns {Promise<string[]>}
  */
  async #findFilesInDirectory({ path, subfolders, skipValidation }){
    path = this.#toAbsolutePath(path);

    const filesPath = (await FileSystem.readdir( path ))
      .map(name => `${ path }/${ name }`);


    if (skipValidation){
      return filesPath;
    }

    const folders = [];
    const files   = [];

    const isFolder = this.fileIsFolder.bind(this);

    for (const path of filesPath)
      (await isFolder(path) ? folders : files)
        .push(path);

    if (subfolders){
      for (const path of folders){
        const filesNames = await this.#findFilesInDirectory({ path, subfolders });
        files.push(...filesNames);
      }
    }
    return files;
  }

}

export {ImportDirectory};
