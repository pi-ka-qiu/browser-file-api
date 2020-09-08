import { mkdir, readdir, rmdir } from "../index.js";
const assert = chai.assert;

describe('file', function() {
    it('mkdir，readdir 成功', async function() {
        await rmdir("/test");
        await mkdir("/test/dir1");
        await mkdir("/test/dir2");
        await mkdir("/test/dir2");
        const dirs = await readdir("/test");
        assert.equal(dirs.length, 3)
    });
})
