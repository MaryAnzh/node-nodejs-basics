import { promises as fs } from 'fs';
import path from 'path';
import * as C from '../constants.ts';

export const remove = async (fileName: string, folderName: string) => {
    const filePath = path.resolve(folderName, fileName);

    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
    }
    catch {
        throw new Error(C.ERROR_MESSAGE_FS);
    }
};

// remove('fileToRemove.txt', C.FILES);