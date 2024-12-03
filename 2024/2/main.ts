function parse(input: string) {
    return input.trim().split('\n');
}

function isReportSafe(levels: number[]) {
    const firstLevel = levels[0] as number;
    const secondLevel = levels[1] as number;
    const direction = Math.sign(secondLevel - firstLevel);
    for (let i = 1; i < levels.length; i++) {
        const level = levels[i] as number;
        const prevLevel = levels[i - 1] as number;
        const delta = level - prevLevel;
        if (Math.abs(delta) < 1 || Math.abs(delta) > 3) {
            return false;
        }
        if (direction * delta <= 0) {
            return false;
        }
    }
    return true;
}

function countSafeReports(reports: string, allowUnsafe: boolean) {
    return parse(reports).reduce((safeCount, report) => {
        const levels = report.split(' ').map((level) => +level);
        if (isReportSafe(levels)) {
            safeCount++;
        } else if (allowUnsafe) {
            for (let i = 0; i < levels.length; i++) {
                if (isReportSafe(levels.toSpliced(i, 1))) {
                    safeCount++;
                    break;
                }
            }
        }
        return safeCount;
    }, 0);
}

export function part1(input: string) {
    return countSafeReports(input, false);
}

export function part2(input: string) {
    return countSafeReports(input, true);
}
