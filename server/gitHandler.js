import simpleGit from 'simple-git';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const git = simpleGit(ROOT_DIR);

export const gitHandler = {
    async status() {
        return await git.status();
    },

    async branches() {
        return await git.branch();
    },

    async checkout(branchName) {
        return await git.checkout(branchName);
    }
};
