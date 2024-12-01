function parse(input: string) {
    const arr1: number[] = [];
    const arr2: number[] = [];

    const lines = input.split('\n');
    for (const line of lines) {
        if (!line) {
            // End of input
            break;
        }
        const [id1, id2] = line.split(' '.repeat(3));
        if (!id1 || !id2) {
            throw new Error('Parse error');
        }
        arr1.push(+id1);
        arr2.push(+id2);
    }

    return { arr1, arr2 };
}

export async function part1(input: string) {
    const { arr1, arr2 } = parse(input);

    let total = 0;

    while (arr1.length) {
        const min1 = Math.min(...arr1);
        const min2 = Math.min(...arr2);

        const min1Index = arr1.indexOf(min1);
        const min2Index = arr2.indexOf(min2);

        total += Math.abs(min1 - min2);

        arr1.splice(min1Index, 1);
        arr2.splice(min2Index, 1);
    }

    return total;
}

export async function part2(input: string) {
    const { arr1, arr2 } = parse(input);

    // Build a map of occurrences first to avoid O(n^2)
    // This instead makes the algorithm O(2n)
    const occurrences = new Map<number, number>();

    for (const id of arr2) {
        const existing = occurrences.get(id);
        if (!existing) {
            occurrences.set(id, 1);
        } else {
            occurrences.set(id, existing + 1);
        }
    }

    return arr1.reduce((total, id) => {
        return total + id * (occurrences.get(id) ?? 0);
    }, 0);
}
