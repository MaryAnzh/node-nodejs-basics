import path from "path";

export const filterWithFormat = (files: string[], formats: string[]) =>
    files
        .filter(fileName => {
            const p = path.extname(fileName).replace('.', '');
            return formats.includes(p);
        });
