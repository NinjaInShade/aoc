function countZeroClicks(input: string, countDuringRotation: boolean) {
    let dial = 50;
    let totalZeroCount = 0;

    for (const line of input.trim().split('\n')) {
        const [dir, ...turns] = line.split('');
        const amount = +turns.join('');
        const sign = dir === 'L' ? -1 : 1;

        for (let i = 0; i < amount; i++) {
            dial = (((dial + sign) % 100) + 100) % 100;

            if (countDuringRotation && dial == 0) {
                totalZeroCount++;
            }
        }

        if (!countDuringRotation && dial === 0) {
            totalZeroCount++;
        }
    }

    return totalZeroCount;
}

export async function part1(input: string) {
    return countZeroClicks(input, false);
}

export async function part2(input: string) {
    return countZeroClicks(input, true);
}
