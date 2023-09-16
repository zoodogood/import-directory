import FileSystem from 'fs/promises';
import Path from 'path';

const DEFAULT_REGEX = /^[^.].*?\.(?:js|ts)$/i;


interface IImportDirectoryOptions {
  sync?: boolean;
  subfolders?: boolean;
  regex?: RegExp;
  callback?: CallableFunction | null;
  skipValidation?: boolean;
  rootDirectory?: string;
}

interface ITakeFilePathOptions {
  path: string;
  skipValidation?: boolean;
  subfolders?: boolean;
}

class ImportDirectory<T> {
  declare regex: RegExp;
  declare sync: boolean;
  declare subfolders: boolean;
  declare callback?: IImportDirectoryOptions["callback"];
  declare skipValidation: boolean;
  declare rootDirectory: string;
  
  constructor({sync = true, subfolders = false, regex = DEFAULT_REGEX, callback, skipValidation = false, rootDirectory}: IImportDirectoryOptions = {}){
    this.sync       = sync;
    this.subfolders = subfolders;
    this.regex      = regex;
    this.callback   = callback;

    this.skipValidation = skipValidation;

    this.rootDirectory = rootDirectory ?? process.cwd();
  }

  
  async import(directoryPath: string){

    const filesPath = await this.takeFilesPath({path: directoryPath, subfolders: this.subfolders});
      

    const list: T[] = [];
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


  
  async takeFilesPath({ path, subfolders, skipValidation }: ITakeFilePathOptions){
    const filesPaths = await this.#findFilesInDirectory({ path, subfolders, skipValidation });
    const isValidPath = (path: string) => this.regex.test(Path.basename( path ));
    
    return filesPaths.filter(isValidPath);
  }

  
  async importFile(path: string): Promise<T>{
    path = this.#normalizePath(
      this.#toAbsolutePath(path)
    );

    return await import(path);
  }


  
  async fileIsFolder(filePath: string): Promise<boolean>{
    const stat = await FileSystem.lstat(filePath);
    return stat.isDirectory();
  }


  
  #normalizePath(path: string): string{
    path = path.replaceAll("\\", "/");

    const isAbsolute = Path.isAbsolute(path);
    if (!isAbsolute)
      return path;

    path = path.replace(/^.*?(?=\/)/, "");

    return `${ path }`;
  }

  
  #toAbsolutePath(path: string): string{
    const isAbsolute = Path.isAbsolute(path);
    if (isAbsolute){
      return path;
    }

    path = `${ this.rootDirectory }/${ path }`;
    return path;
  }
  
  async #findFilesInDirectory({ path, subfolders, skipValidation }: ITakeFilePathOptions): Promise<string[]>{
    path = this.#toAbsolutePath(path);

    const filesPath = (await FileSystem.readdir( path ))
      .map(name => `${ path }/${ name }`);


    if (skipValidation){
      return filesPath;
    }

    const folders: string[] = [];
    const files: string[]   = [];

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
