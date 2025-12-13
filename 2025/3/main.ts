function findHighestJolt(batts: number[], enableBattsAmount: number) {
    const highestIdxs: number[] = [];

    for (let enableIdx = 0; enableIdx < enableBattsAmount; enableIdx++) {
        // Amount of batts left to switch on (excluding batt we're currently switching on).
        const battsLeftToSwitchOn = enableBattsAmount - enableIdx - 1;
        const lastHighIdx = highestIdxs.at(-1);

        let max = -1;
        let maxIdx = -1;
        for (const [battIdx, battPow] of batts.entries()) {
            // Need to start after where the previous max was.
            if (lastHighIdx !== undefined && battIdx <= lastHighIdx) {
                continue;
            }

            // Batts left (excluding the current batt we're on).
            // We can't qualify as the next max if there are less batteries after us than how many we have left to switch on.
            const battsLeft = batts.length - battIdx - 1;
            if (battsLeft < battsLeftToSwitchOn) {
                break;
            }

            if (battPow > max) {
                max = battPow;
                maxIdx = battIdx;
            }
        }

        highestIdxs.push(maxIdx);
    }

    return Number(highestIdxs.map((idx) => batts[idx]).join(''));
}

function calcVoltSum(input: string, enableBattsAmount: number) {
    let joltSum = 0;
    for (const bank of input.trim().split('\n')) {
        const batts = bank.split('').map((b) => +b);
        joltSum += findHighestJolt(batts, enableBattsAmount);
    }
    return joltSum;
}

export async function part1(input: string) {
    return calcVoltSum(input, 2);
}

export async function part2(input: string) {
    return calcVoltSum(input, 12);
}
