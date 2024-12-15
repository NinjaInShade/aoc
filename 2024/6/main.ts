// [ROW, COL]
const DIRECTIONS = {
    left: [0, -1],
    top: [-1, 0],
    right: [0, 1],
    bottom: [1, 0],
} as const;

type Direction = keyof typeof DIRECTIONS;
type OnMoveCb = (pos: [number, number], dir: Direction) => void;

function parse(input: string) {
    return input
        .trim()
        .split('\n')
        .map((c) => c.split(''));
}

function findGuard(world: string[][]): [number, number] {
    for (let i = 0; i < world.length; i++) {
        const row = world[i] as string[];
        for (let j = 0; j < row.length; j++) {
            const col = row[j] as string;
            if (col === '^') {
                return [i, j];
            }
        }
    }
    throw new Error('Could not find guard?');
}

function runSim(world: string[][], onMove: OnMoveCb = () => {}, obstacleOverrides: Record<string, true> = {}) {
    const visited = new Set<string>();
    const hitObstructions = new Set<string>();

    let [row, col] = findGuard(world);
    let dir: Direction = 'top';

    function getNextPos(): [number, number] {
        const [rowDiff, colDiff] = DIRECTIONS[dir];
        return [row + rowDiff, col + colDiff];
    }

    function getNextItem() {
        const [nextRow, nextCol] = getNextPos();
        return world[nextRow]?.[nextCol];
    }

    while (true) {
        if (onMove) {
            onMove([row, col], dir);
        }

        visited.add(`${row}:${col}`);

        const nextPos = getNextPos();
        const nextItem = getNextItem() as string;
        if (!nextItem) {
            break;
        }

        if (nextItem === '#' || obstacleOverrides[`${nextPos[0]}:${nextPos[1]}`]) {
            const hitKey = `${row}:${col}:${dir}`;
            if (hitObstructions.has(hitKey)) {
                return { visited: visited.size, foundParadox: true };
            } else {
                hitObstructions.add(`${row}:${col}:${dir}`);
            }

            // Obstruction
            if (dir === 'top') {
                dir = 'right';
            } else if (dir === 'right') {
                dir = 'bottom';
            } else if (dir === 'bottom') {
                dir = 'left';
            } else if (dir === 'left') {
                dir = 'top';
            }
        } else {
            row = nextPos[0];
            col = nextPos[1];
        }
    }

    return { visited: visited.size, foundParadox: false };
}

export function part1(input: string) {
    const world = parse(input);
    return runSim(world).visited;
}

export function part2(input: string) {
    const world = parse(input);
    const paradoxes = new Set<string>();

    const [guardRow, guardCol] = findGuard(world);
    const guardKey = `${guardRow}:${guardCol}`;

    runSim(world, (pos, dir) => {
        function getObstructionKey() {
            const [row, col] = pos;
            const [rowDiff, colDiff] = DIRECTIONS[dir];
            return `${row + rowDiff}:${col + colDiff}`;
        }

        // To find out how many time paradoxes we can cause with one new obstruction,
        // re-run the sim as we move but with an obstruction in front of us.
        // I'm sure there's a smarter way of doing this!
        const obstructionKey = getObstructionKey();
        if (obstructionKey && obstructionKey !== guardKey) {
            if (runSim(world, undefined, { [obstructionKey]: true }).foundParadox) {
                paradoxes.add(obstructionKey);
            }
        }
    });

    return paradoxes.size;
}
