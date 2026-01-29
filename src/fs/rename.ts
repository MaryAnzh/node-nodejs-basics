import { promises as fs } from 'fs';
import path from 'path';
import * as C from '../constants.ts';

export const rename = async (oldName: string, newName: string, folder: string) => {
    const oldPath = path.resolve(`${folder}/${oldName}`);
    const newPath = path.resolve(`${folder}/${newName}`);

    try {
        await fs.access(oldPath);
    }
    catch {
        throw new Error(`Couldn't find file: ${oldName}`);
    }

    try {
        await fs.access(newPath);
        throw new Error();
    } catch (err) {
        const { code } = err as NodeJS.ErrnoException;
        if (code !== C.ENOENT) {
            throw new Error(`The file with new name: ${newName} -- exist`);
        }
    }
    await fs.rename(oldPath, newPath);
}

// rename('wrongFilename.txt', 'fileNewName.txt');