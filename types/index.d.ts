export type ImportDirectoryOptions = {
    sync?: boolean;
    subfolders?: boolean;
    regex?: RegExp;
    callback?: Function;
    skipValidation?: boolean;
    rootDirectory?: string;
};
export type takeFilePathOptions = {
    path: string;
    skipValidation?: boolean;
    subfolders?: boolean;
};
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
export class ImportDirectory {
    /**
     * @param {ImportDirectoryOptions} param0
     */
    constructor({ sync, subfolders, regex, callback, skipValidation, rootDirectory }?: ImportDirectoryOptions);
    sync: boolean;
    subfolders: boolean;
    regex: RegExp;
    callback: Function;
    skipValidation: boolean;
    rootDirectory: any;
    /**
     * @param {string} directoryPath
     * @returns {Promise<module[]>}
     */
    import(directoryPath: string): Promise<module[]>;
    /**
     *
     * @param {takeFilePathOptions} param0
     * @returns {Promise<string[]>}
    */
    takeFilesPath({ path, subfolders, skipValidation }: takeFilePathOptions): Promise<string[]>;
    /**
     *
     * @param {string} path
     * @returns {Promise<module>}
     */
    importFile(path: string): Promise<module>;
    /**
     *
     * @param {string} filePath
     * @returns {Promise<boolean>}
     */
    fileIsFolder(filePath: string): Promise<boolean>;
    #private;
}
