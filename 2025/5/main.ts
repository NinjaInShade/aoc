class Node<T> {
    public next?: Node<T>;
    public value: T;

    constructor(value: T) {
        this.value = value;
    }
}

class LinkedList<T = unknown> {
    public head?: Node<T>;

    constructor() {}

    public get tail() {
        let currNode = this.head;
        while (currNode?.next) {
            currNode = currNode.next;
        }
        return currNode;
    }

    public insertAtStart(value: T) {
        const newHead = new Node<T>(value);
        const currHead = this.head;
        newHead.next = currHead;
        this.head = newHead;
    }

    public insertAtEnd(value: T) {
        const currTail = this.tail;
        if (!currTail) {
            this.insertAtStart(value);
        } else {
            const newTail = new Node<T>(value);
            currTail.next = newTail;
        }
    }

    public insertAtPos(value: T, pos: number) {
        if (pos === 0) {
            this.insertAtStart(value);
            return;
        }

        let nodePrev: Node<T> | undefined = this.head;
        for (let i = 0; i < pos - 1; i++) {
            nodePrev = nodePrev?.next;
        }
        if (!nodePrev) {
            throw new Error(`Position ${pos} out of bounds`);
        }

        const newNext = new Node<T>(value);
        const currNext = nodePrev.next;
        newNext.next = currNext;
        nodePrev.next = newNext;
    }

    public deleteAtPos(pos: number) {
        if (!this.head) {
            throw new Error(`Position ${pos} out of bounds`);
        }

        let nodePrev: Node<T> | undefined = this.head;
        for (let i = 0; i < pos - 1; i++) {
            nodePrev = nodePrev?.next;
        }
        if (!nodePrev) {
            throw new Error(`Position ${pos} out of bounds`);
        }

        const nodeToDelete = nodePrev.next;
        nodePrev.next = nodeToDelete?.next;
    }

    /** Debug */
    public printList() {
        let node = this.head;
        while (node) {
            console.log(structuredClone(node.value));
            node = node.next;
        }
    }
}

function createRangeLL(ranges: [number, number][]) {
    // This sorted linked list will keep track of fresh (valid) ranges, expanding existing ranges where applicable.
    // We use a linked list since we may be merging (so deleting) ranges in the middle which is expensive for normal arrays.
    // We then end up with an list of valid ranges that don't overlap, essentially de-duplicating the original list, and
    // being able to find if an ingredient is in a range more efficiently later, since there's less min/max ranges to loop over (in theory?).
    const ll = new LinkedList<[number, number]>();

    for (const [rangeMin, rangeMax] of ranges) {
        // No saved ranges yet or range is less than current head.
        if (!ll.head || rangeMax < ll.head.value[0]) {
            ll.insertAtStart([rangeMin, rangeMax]);
            continue;
        }

        let node = ll.head;
        let idx = 0;
        while (node) {
            const [min, max] = node.value;
            if (rangeMin >= min && rangeMax <= max) {
                // We have this range already.
                break;
            }
            const pushMin = rangeMin <= min && rangeMax >= min;
            const pushMax = rangeMax >= max && rangeMin <= max;
            if (pushMin || pushMax) {
                // NOTE: have to be careful mutating node.value array since we destructure it
                // before and so anything that would want to use it after would have the wrong value.
                // This doesn't apply to this code snippet, but it could if requirements changed.
                if (pushMin) {
                    // Safe to push min back.
                    node.value[0] = rangeMin;
                }
                if (pushMax) {
                    // Safe to push max forwards.
                    // Merges any unnecessary ranges that overlap after pushing.
                    node.value[1] = rangeMax;
                    let merged: boolean | undefined;
                    while ((merged === undefined || merged) && node.next) {
                        const [nextMin, nextMax] = node.next.value;
                        if (rangeMax >= nextMin) {
                            node.value[1] = nextMax;
                            ll.deleteAtPos(idx + 1);
                            merged = true;
                        } else {
                            merged = false;
                        }
                    }
                }
                break;
            }

            if (!node.next || (node.next && rangeMin > max && rangeMax < node.next.value[0])) {
                // New undiscovered range, insert.
                ll.insertAtPos([rangeMin, rangeMax], idx + 1);
                break;
            }

            node = node.next;
            idx++;
        }
    }

    return ll;
}

function parse(input: string) {
    const [_ranges, _ids] = input.trim().split('\n\n') as [string, string];
    const ranges = _ranges
        .trim()
        .split('\n')
        .map((range) => range.split('-').map((id) => +id) as [number, number]);
    const ids = _ids
        .trim()
        .split('\n')
        .map((id) => +id);
    return { ranges, ids };
}

export async function part1(input: string) {
    const { ranges, ids } = parse(input);
    const ll = createRangeLL(ranges);

    let freshIngredientIDs = 0;
    for (const id of ids) {
        let node = ll.head;
        while (node) {
            const [min, max] = node.value;
            if (id >= min && id <= max) {
                freshIngredientIDs++;
                break;
            }
            node = node.next;
        }
    }
    return freshIngredientIDs;
}

export async function part2(input: string) {
    const { ranges } = parse(input);
    const ll = createRangeLL(ranges);

    let availableFreshIngredientIDs = 0;
    let node = ll.head;
    while (node) {
        const [min, max] = node.value;
        availableFreshIngredientIDs += max - min + 1;
        node = node.next;
    }
    return availableFreshIngredientIDs;
}
