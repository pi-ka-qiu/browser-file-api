import ls from "./ls.js";

export function _addPathToTree({path, treePrefix}) {
  // 获取所有文件夹列表
  let dirs = ls.get(treePrefix);
  if (!dirs) dirs = [];
  if (dirs.find(p => p === path)) {
    throw {
      errno: -4075,
      code: 'EEXIST',
      syscall: 'mkdir',
      path: path,
    };
  }
  dirs.push(path);
  ls.set(treePrefix, dirs);
}

export function _rmPathToTree({path, treePrefix}) {
  let dirs = ls.get(treePrefix);
  if (dirs) {
    dirs = dirs.filter(p => p === path);
    ls.set(treePrefix, dirs);
  }
}

export function _existPathInTree({path, treePrefix}) {
  let dirs = ls.get(treePrefix);
  if (!dirs) dirs = [];
  return dirs.find(p => p === path);
}

/*************************文件夹操作***************************/
export function mkdir({path, options, treePrefix}) {
  return new Promise((resolve, reject) => {
    _addPathToTree({path, treePrefix});
    resolve();
  });
}

export function rmdir({path, treePrefix}) {
  return new Promise((resolve, reject) => {
    // 获取所有文件列表
    let dirs = ls.get(treePrefix);
    if (!dirs) resolve();
    // 查找以path开头的目录
    let endS = path.endsWith("/");
    let endPath = endS ? path : path + "/";
    let files = dirs.filter(path => !(path === path || path.startsWith(endPath)));
    ls.set(treePrefix, files);
    resolve();
  });
}

export function readdir({path, treePrefix}) {
  return new Promise((resolve, reject) => {
    // 获取所有文件列表
    let dirs = ls.get(treePrefix);
    let endS = path.endsWith("/");
    let endPath = endS ? path : path + "/";
    // 查找以path开头的目录
    let files = dirs.filter(dPath => dPath === path || dPath.startsWith(endPath)).map(path => {
      let index = path.lastIndexOf("/");
      console.log(path, index)
      let p = path.substring(endPath.length);
      let pIndex = p.indexOf("/");
      if (pIndex > -1) {
        return p.substring(0, pIndex);
      }
      return p;
    });
    resolve(files);
  });
}

/*************************文件内容操作***************************/
export function writeFile({path, data, options, pathPrefix, treePrefix}) {
  return new Promise((resolve, reject) => {
    // 如果文件不存在
    if (!_existPathInTree({path, treePrefix})) {
      _addPathToTree({path, treePrefix});
    }
    ls.set(pathPrefix + path, data);
    resolve();
  });
}

export function appendFile({path, data, options, pathPrefix, treePrefix}) {
  return new Promise((resolve, reject) => {
    // 如果文件不存在
    if (!_existPathInTree({path, treePrefix})) {
      _addPathToTree({path, treePrefix});
    }
    let content = ls.get(pathPrefix + path);
    ls.set(pathPrefix + path, content + data);
    resolve();
  });
}

export function unlink({path, pathPrefix, treePrefix}) {
  return new Promise((resolve, reject) => {
    ls.rm(pathPrefix + path);
    _rmPathToTree({path, treePrefix});
    resolve();
  });
}

export function readFile({path, options, pathPrefix, treePrefix}) {
  return new Promise((resolve, reject) => {
    if (!_existPathInTree({path, treePrefix})) {
      throw {
        errno: -4075,
        code: 'ENOENT',
        syscall: 'readFile',
        path: path,
      };
    }
    resolve(ls.get(pathPrefix + path));
  });
}

export function rename({oldPath, newPath, pathPrefix, treePrefix}) {
  return new Promise((resolve, reject) => {
    if (!_existPathInTree({path: oldPath, treePrefix})) {
      throw {
        errno: -4075,
        code: 'ENOENT',
        syscall: 'rename',
        path: oldPath,
      };
    }
    ls.set(pathPrefix + newPath, ls.get(pathPrefix + oldPath));
    ls.rm(pathPrefix + oldPath);
    _rmPathToTree({path: oldPath, treePrefix});
    _addPathToTree({path: newPath, treePrefix});
    resolve();
  });
}





