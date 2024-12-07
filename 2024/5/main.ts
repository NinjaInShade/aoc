function parse(input: string) {
    const [orders, updates] = input.split('\n\n') as [string, string];
    return {
        orders: orders
            .trim()
            .split('\n')
            .map((order) => order.split('|').map((n) => +n)),
        updates: updates
            .trim()
            .split('\n')
            .map((update) => update.split(',').map((page) => +page)),
    };
}

let orders: number[][];
let updates: number[][];

const orderMap = new Map<number, number[]>();

// Maps each update to whether it was correct or not
// Set in part 1, used by part 2 to not re-compute
const correctMap = new Map<number[], boolean>();

function getCorrectOrder(update: number[]) {
    const correct: number[] = [...update];

    function correctPage(page: number) {
        const beforeReq = orderMap.get(page);

        // Nothing needs to go before this
        if (!beforeReq) return;

        for (const before of beforeReq) {
            const pageIdx = correct.indexOf(page);
            const beforeIdx = correct.indexOf(before);

            // Not part of this update
            if (beforeIdx === -1) continue;

            if (beforeIdx > pageIdx) {
                // Before isn't in right order, move it
                correct.splice(beforeIdx, 1);
                correct.splice(pageIdx - 1, 0, before);
            }

            // Ensure order corrected for every order rule in the chain
            correctPage(before);
        }
    }

    for (let i = 0; i < update.length; i++) {
        const page = update[i] as number;
        correctPage(page);
    }

    return correct;
}

export function part1(input: string) {
    const parsed = parse(input);
    orders = parsed.orders;
    updates = parsed.updates;

    for (const order of orders) {
        const [before, after] = order as [number, number];
        const existing = orderMap.get(after);
        if (!existing) {
            orderMap.set(after, [before]);
        } else {
            existing.push(before);
        }
    }

    return updates.reduce((total, update) => {
        const correctOrder = getCorrectOrder(update);
        const updateIsCorrect = correctOrder.every((v, i) => update[i] === v);
        correctMap.set(correctOrder, updateIsCorrect);
        if (updateIsCorrect) {
            const middleIdx = (update.length - 1) / 2;
            const middlePage = update[middleIdx] as number;
            total += middlePage;
        }
        return total;
    }, 0);
}

export function part2() {
    return Array.from(correctMap.entries()).reduce((total, [update, isCorrect]) => {
        if (!isCorrect) {
            const middleIdx = (update.length - 1) / 2;
            const middlePage = update[middleIdx] as number;
            total += middlePage;
        }
        return total;
    }, 0);
}
