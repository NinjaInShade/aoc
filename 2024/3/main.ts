const NUMBER_REGEX = /\d/;

let idx = 0;
let input = '';
let mulEnabled = true;

function hasNext(str: string) {
    return input.startsWith(str, idx);
}

function consume(str: string) {
    idx += str.length;
}

function expect(str: string) {
    if (!hasNext(str)) {
        throw new Error(`Expected "${str}"`);
    }
    consume(str);
}

function scanNumber() {
    let fullNum = '';
    while (idx < input.length) {
        const match = input[idx]?.match(NUMBER_REGEX);
        if (match) {
            idx++;
            fullNum += match[0];
        } else if (fullNum) {
            return +fullNum;
        } else {
            return null;
        }
    }
    return null;
}

function getTotal(inputStr: string, enableConditionals: boolean) {
    // Reset global state
    idx = 0;
    input = inputStr;
    mulEnabled = true;

    let total = 0;

    while (idx < input.length) {
        const allowMul = !enableConditionals || mulEnabled;

        if (hasNext('do()')) {
            expect('do()');
            mulEnabled = true;
        } else if (hasNext("don't()")) {
            expect("don't()");
            mulEnabled = false;
        } else if (hasNext('mul(') && allowMul) {
            expect('mul(');

            const num1 = scanNumber();
            if (num1 === null) continue;

            if (!hasNext(',')) continue;
            consume(',');

            const num2 = scanNumber();
            if (num2 === null) continue;

            if (!hasNext(')')) continue;
            consume(')');

            total += num1 * num2;
        } else {
            idx++;
        }
    }

    return total;
}

export function part1(input: string) {
    return getTotal(input, false);
}

export function part2(input: string) {
    return getTotal(input, true);
}
