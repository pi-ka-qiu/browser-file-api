import ls from "./libs/ls.js";
export class FileSystem {
    constructor({ treePrefix, pathPrefix }) {
        this.treePrefix = treePrefix || 'dirs';
        this.pathPrefix = pathPrefix || '';
    }
    writeFile(path, data, options){
        return new Promise((resolve, reject) => {
            // 如果文件不存在
            if (!this._exitsPathInTree(path)) {
                this._addPathToTree(path);
            }
            ls.set(this.pathPrefix + path, data);
            resolve();
        });
    }
    appendFile(path, data, options){
        return new Promise((resolve, reject) => {
            // 如果文件不存在
            if (!this._exitsPathInTree(path)) {
                this._addPathToTree(path);
            }
            let content = ls.get(this.pathPrefix + path);
            ls.set(this.pathPrefix + path, content + data);
            resolve();
        });
    }
    unlink(path){
        return new Promise((resolve, reject) => {
            ls.rm(this.pathPrefix + path);
            this._rmPathToTree(path);
            resolve();
        });
    }
    readFile(path, options){
        return new Promise((resolve, reject) => {
            if(!this._exitsPathInTree(path)) {
                throw {
                    errno: -4075,
                    code: 'ENOENT',
                    syscall: 'readFile',
                    path: path,
                };
            }
            resolve(ls.get(this.pathPrefix + path));
        });
    }
    rename(oldPath, newPath){
        return new Promise((resolve, reject) => {
            if(!this._exitsPathInTree(oldPath)) {
                throw {
                    errno: -4075,
                    code: 'ENOENT',
                    syscall: 'rename',
                    path: oldPath,
                };
            }
            ls.set(this.pathPrefix + newPath,ls.get(this.pathPrefix + oldPath));
            ls.rm(this.pathPrefix + oldPath);
            this._rmPathToTree(oldPath);
            this._addPathToTree(newPath);
            resolve();
        });
    }
    mkdir(path, options){
        return new Promise((resolve, reject) => {
            this._addPathToTree(path);
            resolve();
        });
    }
    rmdir(path){
        return new Promise((resolve, reject) => {
            // 获取所有文件列表
            let dirs = ls.get(this.treePrefix);
            if (!dirs) resolve();
            // 查找以path开头的目录
            let endS = path.endsWith("/");
            let endPath = endS ? path : path + "/";
            let files = dirs.filter(path => !(path === path || path.startsWith(endPath)));
            ls.set(this.treePrefix, files);
            resolve();
        });
    }
    readdir(path){
        return new Promise((resolve, reject) => {
            // 获取所有文件列表
            let dirs = ls.get(this.treePrefix);
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

    statSync(path, options) {
        if(!this._exitsPathInTree(path)) {
            throw {
                errno: -2,
                code: 'ENOENT',
                syscall: 'stat',
                path: path,
            };
        }
        return new Stats({ treePrefix: this.treePrefix, pathPrefix: this.pathPrefix, path });
    }

    _addPathToTree (path) {
        // 获取所有文件夹列表
        let dirs = ls.get(this.treePrefix);
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
        ls.set(this.treePrefix, dirs);
    }
    _rmPathToTree (path) {
        let dirs = ls.get(this.treePrefix);
        if (dirs) {
            dirs = dirs.filter(p => p === path);
            ls.set(this.treePrefix, dirs);
        }
    }

    _exitsPathInTree (path) {
        let dirs = ls.get(this.treePrefix);
        if (!dirs) dirs = [];
        return dirs.find(p => p === path);
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
        if (ls.get(this.pathPrefix + this.path)) return true;
        return false;
    }
}
