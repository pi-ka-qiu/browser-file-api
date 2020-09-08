import ls from "./libs/ls.js";

export function writeFile(path, data, options){
    return new Promise((resolve, reject) => {
        resolve(ls.set(path, data));
    });
}
export function appendFile(path, data, options){
    return new Promise((resolve, reject) => {
        let content = ls.get(path);
        ls.set(path, content + data);
        resolve();
    });
}
export function unlink(path){
    return new Promise((resolve, reject) => {
       ls.rm(path);
       resolve();
    });
}
export function readFile(path, options){
    return new Promise((resolve, reject) => {
        resolve(ls.get(path));
    });
}
export function rename(oldPath, newPath){
    return new Promise((resolve, reject) => {
        ls.set(newPath,ls.get(oldPath));
        resolve();
    });
}
export function mkdir(path, options){
    return new Promise((resolve, reject) => {
        // 获取所有文件夹列表
        let dirs = ls.get("dirs");
        if (!dirs) dirs = [];
        dirs.push(path);
        ls.set("dirs", dirs);
        resolve();
    });
}
export function rmdir(path){
    return new Promise((resolve, reject) => {
        // 获取所有文件列表
        let dirs = ls.get("dirs");
        if (!dirs) resolve();
        // 查找以path开头的目录
        let endS = path.endsWith("/");
        let endPath = endS ? path : path + "/";
        let files = dirs.filter(path => !(path === path || path.startsWith(endPath)));
        ls.set("dirs", files);
        resolve();
    });
}
export function readdir(path){
    return new Promise((resolve, reject) => {
        // 获取所有文件列表
        let dirs = ls.get("dirs");
        let endS = path.endsWith("/");
        let endPath = endS ? path : path + "/";
        // 查找以path开头的目录
        let files = dirs.filter(path => path === path || path.startsWith(endPath)).map(path => {
            let index = path.lastIndexOf("/");
            return path.substring(index);
        });
        resolve(files);
    });
}

class Stats {
    isFile(path) {
        return true;
    }
}

export function statSync(path, options) {
    return new Stats();
}
