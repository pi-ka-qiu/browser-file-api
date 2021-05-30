import ls from "./libs/ls.js";
import {
  writeFile,
  appendFile,
  unlink,
  readFile,
  rename,
  mkdir,
  rmdir,
  readdir,
  _existPathInTree,
} from './libs/fs-util.js';

export class FileSystem {
  constructor({ treePrefix, pathPrefix }) {
    // 包含目录及文件的树结构数据,一维数组
    this.treePrefix = treePrefix || 'dirs';
    // 包含文件数据
    this.pathPrefix = pathPrefix || '';
  }

  /****文件内容操作********/
  writeFile(path, data, options) {
    return writeFile({ path, data, options, treePrefix: this.treePrefix, pathPrefix: this.pathPrefix })
  }

  appendFile(path, data, options) {
    return appendFile({ path, data, options, pathPrefix: this.pathPrefix, treePrefix: this.treePrefix });
  }

  readFile(path, options) {
    return readFile({ path, options, treePrefix: this.treePrefix, pathPrefix: this.pathPrefix })
  }

  unlink(path) {
    return unlink({ path, pathPrefix: this.pathPrefix, treePrefix: this.treePrefix });
  }

  /****文件夹操作********/
  rename(oldPath, newPath) {
    return rename({ oldPath, newPath, pathPrefix: this.pathPrefix, treePrefix: this.treePrefix })
  }

  mkdir(path, options) {
    return mkdir({ path, options, treePrefix: this.treePrefix });
  }

  rmdir(path) {
    return rmdir({ path, treePrefix: this.treePrefix });
  }

  readdir(path) {
    return readdir({ path, treePrefix: this.treePrefix })
  }

  /***文件状态***/
  statSync(path, options) {
    if (!_existPathInTree({ path, treePrefix: this.treePrefix })) {
      throw {
        errno: -2,
        code: 'ENOENT',
        syscall: 'stat',
        path: path,
      };
    }
    return new Stats({ path, options, treePrefix: this.treePrefix, pathPrefix: this.pathPrefix });
  }

}

export class Stats {
  constructor({ treePrefix, pathPrefix, path }) {
    this.treePrefix = treePrefix || 'dirs';
    this.pathPrefix = pathPrefix || '';
    this.path = path;
  }

  isFile() {
    console.log(this.pathPrefix + this.path)
    if (ls.exist(this.pathPrefix + this.path)) return true;
    return false;
  }

  isDirectory() {
    const isFile = this.isFile();
    if (isFile) return false;
    if (_existPathInTree({ path: this.path, treePrefix: this.treePrefix })) return true;
    return false;
  }
}
