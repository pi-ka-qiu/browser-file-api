import { FileSystem } from "../index.js";
const assert = chai.assert;
const fs = new FileSystem({ treePrefix: 'trees', pathPrefix: 'path' });
describe('file', function() {
    it('mkdir，readdir 成功', async function() {
        await fs.rmdir("/test");
        await fs.mkdir("/test/dir1");
        await fs.mkdir("/test/dir2");
        await fs.mkdir("/test/dir3");
        const dirs = await fs.readdir("/test");
        const isFile = fs.statSync("/test/dir2").isFile();
        assert.equal(dirs.length, 3);
        assert.equal(isFile, false);
    });

    it('writeFile，appendFile, readFile 成功', async function() {
        let path = "/test/readme.md";
        let wContent = "你好";
        await fs.writeFile(path, wContent);
        let content = await fs.readFile(path);
        console.log(content,wContent);
        assert.equal(content, wContent);
        wContent += "世界";
        await fs.appendFile(path, "世界");
        content = await fs.readFile(path);
        const isFile = fs.statSync(path).isFile();
        assert.equal(isFile, true);
        assert.equal(content, wContent);
    });

    it('writeFile，rename, readFile 成功', async function() {
        let path = "/test/rename.md";
        let wContent = "你好rename";
        await fs.writeFile(path, wContent);
        await fs.rename(path, "/test/新的名字.md");
        let content = await fs.readFile("/test/新的名字.md");
        let oldContent = await fs.readFile(path);
        assert.equal(content, wContent);
        assert.equal(oldContent, null);
    });

    it('unlink 成功', async function() {
        let path = "/test/新的名字.md"
        await fs.unlink(path);
        let content = await fs.readFile(path);
        assert.equal(content, null);
    });



})
