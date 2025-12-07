export async function part1(input: string) {
    const invalidIds: number[] = [];

    for (const range of input.trim().split(',')) {
        const [_low, _high] = range.split('-');
        const low = +_low!;
        const high = +_high!;

        for (let num = low; num < high; num++) {
            const numStr = num.toString();
            const digitsLen = numStr.length;
            const midpoint = digitsLen / 2;

            if (digitsLen % 2 !== 0) {
                // Odd digits can't have two matching (equal) sequences
                continue;
            }

            // Compare each corresponding digit to see if they match
            // e.g. for 6464, check n[0] === n[2] and then n[1] === n[3]
            let isMatchingSequence = true;
            for (let i = 0; i < midpoint; i++) {
                if (numStr[i] !== numStr[i + midpoint]) {
                    // Not matching sequence, bail
                    isMatchingSequence = false;
                    break;
                }
            }
            if (isMatchingSequence) {
                invalidIds.push(num);
            }
        }
    }

    return invalidIds.reduce((prev, curr) => (prev += curr), 0);
}

export async function part2(input: string) {
    const invalidIds: number[] = [];

    for (const range of input.trim().split(',')) {
        const [_low, _high] = range.split('-');
        const low = +_low!;
        const high = +_high!;

        for (let num = low; num <= high; num++) {
            const numStr = num.toString();

            let isMatchingSequence = true;
            for (let i = 0; i < numStr.length; i++) {
                let checkSeq = numStr.substring(0, i + 1);
                const checkSeqLen = checkSeq.length;
                const remainingLen = numStr.length - checkSeqLen;

                // If remaining len isn't a multiple of check sequence length, it can't be a valid sequence.
                if (remainingLen % checkSeqLen !== 0) {
                    continue;
                }

                // For the sequence we're checking (e.g. "123" from "123123123"), check if this
                // sequence repeats itself, jumping through by the length of the checking sequence.
                let repetitions = 1;
                for (let j = i + 1; j < numStr.length; j += checkSeqLen) {
                    const jumpIdx = Math.min(j + checkSeqLen, numStr.length);
                    const checkNextSeq = numStr.substring(j, jumpIdx);
                    if (checkSeq !== checkNextSeq) {
                        // Sequence we're checking doesn't match, bail
                        isMatchingSequence = false;
                        break;
                    } else {
                        repetitions++;
                        isMatchingSequence = true;
                    }
                }

                if (isMatchingSequence && repetitions >= 2) {
                    invalidIds.push(num);
                    break;
                }
            }
        }
    }

    return invalidIds.reduce((prev, curr) => (prev += curr), 0);
}
