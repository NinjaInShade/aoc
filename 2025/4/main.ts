function findRemovableRolls(grid: string[][]) {
    const removableIdxs: [number, number][] = [];

    for (const [i, row] of grid.entries()) {
        for (const [j, val] of row.entries()) {
            if (val !== '@') {
                // Not a roll, continue
                continue;
            }

            // Starts from top left and continues goes clockwise.
            const positions = [
                grid[i - 1]?.[j - 1], // TL
                grid[i - 1]?.[j], // T
                grid[i - 1]?.[j + 1], // TR
                grid[i]?.[j + 1], // R
                grid[i + 1]?.[j + 1], // BR
                grid[i + 1]?.[j], // B
                grid[i + 1]?.[j - 1], // BL
                grid[i]?.[j - 1], // L
            ];

            const occupiedAmount = positions.reduce((sum, pos) => {
                if (pos === '@') {
                    return sum + 1;
                }
                return sum;
            }, 0);

            if (occupiedAmount < 4) {
                removableIdxs.push([i, j]);
            }
        }
    }

    return removableIdxs;
}

function countAccessibleRolls(grid: string[][], removeRolls: boolean) {
    let accessibleRolls = 0;

    let removed: number | undefined;
    while (removed === undefined || removed > 0) {
        removed ??= 0;

        const removable = findRemovableRolls(grid);
        if (removeRolls) {
            for (const [rowIdx, colIdx] of removable) {
                grid[rowIdx]![colIdx] = '.';
            }
            removed = removable.length;
        }
        accessibleRolls += removable.length;
    }

    return accessibleRolls;
}

export async function part1(input: string) {
    const grid = input
        .trim()
        .split('\n')
        .map((row) => row.split(''));

    return countAccessibleRolls(grid, false);
}

export async function part2(input: string) {
    const grid = input
        .trim()
        .split('\n')
        .map((row) => row.split(''));

    return countAccessibleRolls(grid, true);
}
