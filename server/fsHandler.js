import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..'); // Assuming server folder is one level deep

export const fsHandler = {
    async list(dirPath) {
        const fullPath = path.join(ROOT_DIR, dirPath || '');

        // Security check: ensure we don't go above root
        if (!fullPath.startsWith(ROOT_DIR)) {
            throw new Error("Access denied");
        }

        try {
            const stats = await fs.stat(fullPath);
            if (!stats.isDirectory()) {
                return [];
            }

            const items = await fs.readdir(fullPath, { withFileTypes: true });

            // Map to our format. 
            // Note: We are doing a shallow list here for the requested directory. 
            // The frontend might need to request deeper if it wants recursive, 
            // or we can implement recursive here.
            // For a file explorer, on-demand loading is usually better.
            // But the prompt asked for "recursive file listing" in the plan.
            // Let's stick to shallow for now as it's more standard for file explorers,
            // or we can do a full scan.
            // Actually, the current frontend `mockFileSystem` is recursive.
            // Let's implement a recursive scan to match the mock structure for now,
            // or change frontend to start with root and expand.
            // Recursive might be heavy for `node_modules`. 
            // Let's do a recursive scan but exclude node_modules and .git.

            const buildTree = async (currentDir, relativePath) => {
                const entries = await fs.readdir(currentDir, { withFileTypes: true });
                const result = [];

                for (const entry of entries) {
                    if (entry.name === 'node_modules' || entry.name === '.git') continue;

                    const entryPath = path.join(currentDir, entry.name);
                    const entryRelative = path.join(relativePath, entry.name);

                    const node = {
                        id: entryRelative, // Use path as ID
                        name: entry.name,
                        type: entry.isDirectory() ? 'folder' : 'file',
                        path: entryRelative
                    };

                    if (entry.isDirectory()) {
                        node.children = await buildTree(entryPath, entryRelative);
                    }

                    result.push(node);
                }
                return result;
            };

            return await buildTree(ROOT_DIR, '');
        } catch (error) {
            console.error("FS List Error:", error);
            throw error;
        }
    },

    async read(filePath) {
        const fullPath = path.join(ROOT_DIR, filePath);
        if (!fullPath.startsWith(ROOT_DIR)) {
            throw new Error("Access denied");
        }
        return await fs.readFile(fullPath, 'utf-8');
    },

    async write(filePath, content) {
        const fullPath = path.join(ROOT_DIR, filePath);
        if (!fullPath.startsWith(ROOT_DIR)) {
            throw new Error("Access denied");
        }
        await fs.writeFile(fullPath, content, 'utf-8');
        return { success: true };
    }
};
