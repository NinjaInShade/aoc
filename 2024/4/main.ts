function parse(input: string) {
    return input
        .trim()
        .split('\n')
        .map((row) => row.trim().split(''));
}

const DIRECTIONS = ['left', 'top', 'right', 'bottom', 'top-left', 'top-right', 'bottom-right', 'bottom-left'] as const;
type Dir = (typeof DIRECTIONS)[number];

export function part1(input: string) {
    const wSearch = parse(input);
    const foundXmas = new Map<string, true>();

    function search(rowIdx: number, colIdx: number, dir: Dir) {
        // Key is a unique ID of the indexes that find one "XMAS"
        let key = '';
        const find = ['X', 'M', 'A', 'S'];
        for (let i = 0; i < find.length; i++) {
            if (wSearch[rowIdx]?.[colIdx] !== find[i]) {
                return;
            }
            key += `${rowIdx}${colIdx}`;
            if (dir === 'left') {
                colIdx--;
            } else if (dir === 'top-left') {
                rowIdx--;
                colIdx--;
            } else if (dir === 'top') {
                rowIdx--;
            } else if (dir === 'top-right') {
                rowIdx--;
                colIdx++;
            } else if (dir === 'right') {
                colIdx++;
            } else if (dir === 'bottom-right') {
                rowIdx++;
                colIdx++;
            } else if (dir === 'bottom') {
                rowIdx++;
            } else if (dir === 'bottom-left') {
                rowIdx++;
                colIdx--;
            } else {
                throw new Error(`Invalid dir "${dir}"`);
            }
        }
        foundXmas.set(key, true);
    }

    for (let i = 0; i < wSearch.length; i++) {
        const row = wSearch[i] as string[];
        for (let j = 0; j < row.length; j++) {
            for (const dir of DIRECTIONS) {
                search(i, j, dir);
            }
        }
    }

    return foundXmas.size;
}

export function part2(input: string) {
    const wSearch = parse(input);
    let foundCount = 0;

    const X_MAS = [
        ['M', '-', 'M'],
        ['-', 'A', '-'],
        ['S', '-', 'S'],
    ];

    // [1, 2, 3], -> [7, 4, 1],
    // [4, 5, 6], -> [8, 5, 2],
    // [7, 8, 9], -> [9, 6, 3]
    function rotateMatrix90(matrix: string[][]) {
        const newMatrix = new Array(matrix.length).fill([]);
        return newMatrix.map((x, idx) => matrix.map((x) => x[idx] as string).reverse());
    }

    function search(rowIdx: number, colIdx: number, searchMatrix: string[][]) {
        for (let i = 0; i < searchMatrix.length; i++) {
            const row = searchMatrix[i] as string[];
            for (let j = 0; j < row.length; j++) {
                const col = row[j] as string;
                if (col === '-') {
                    // "-" is a placeholder for any char
                    continue;
                }
                const inputCol = wSearch[rowIdx + i]?.[colIdx + j];
                if (!inputCol || inputCol !== col) {
                    return false;
                }
            }
        }
        return true;
    }

    const base = X_MAS;
    const base90 = rotateMatrix90(base);
    const base180 = rotateMatrix90(base90);
    const base270 = rotateMatrix90(base180);

    for (let i = 0; i < wSearch.length; i++) {
        const row = wSearch[i] as string[];
        for (let j = 0; j < row.length; j++) {
            if (search(i, j, base) || search(i, j, base90) || search(i, j, base180) || search(i, j, base270)) {
                foundCount++;
            }
        }
    }

    return foundCount;
}
