import { promises as fs } from 'fs';
import * as C from '../constants';

export const create = async () => {
    try {
        await fs.writeFile(C.FRESH_TXT, C.CREATE_TEXT, { flag: 'wx' });
    } catch (err) {
        const { code } = err as NodeJS.ErrnoException;
        if (code === 'EEXIST') {
            throw new Error(C.ERROR_MESSAGE_FS);
        } else {
            throw err;
        }
    }
};
