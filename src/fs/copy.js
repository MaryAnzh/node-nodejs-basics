import { promises as fs } from 'fs';
import path from 'path';

import { ERROR_MESSAGE_FS, SUCCESS } from '../constants.js';

export const copy = async (srcPath, destPath) => {
    try {
        // check is src folder exist
        await fs.access(srcPath);
        // check is dest folder exist
        try {
            await fs.access(destPath);
            throw new Error(ERROR_MESSAGE_FS);
        } catch ({ code }) {
            if (code === 'ENOENT') {
                await fs.mkdir(destPath);
            } else {
                throw new Error(ERROR_MESSAGE_FS);
            }
        }


        const copyRecursive = async (src, dest) => {
            const entries = await fs.readdir(src, { withFileTypes: true });

            for (const entry of entries) {
                const srcP = path.join(src, entry.name);
                const destP = path.join(dest, entry.name);

                if (entry.isDirectory()) {
                    await copyRecursive(srcP, destP);
                } else {
                    await fs.copyFile(srcP, destP);
                }
            }
        };

        await copyRecursive(srcPath, destPath);

    } catch (err) {
        throw err;
    }
};

// test work only without this call
//copy('files', 'files_copy');