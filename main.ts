import fsp from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

const now = new Date();

const year = process.argv[2] ?? now.getFullYear();
const day = process.argv[3] ?? 1;

const submissionDir = path.join(process.cwd(), `${year}/${day}`);
const submissionFile = path.join(submissionDir, 'main.ts');
const inputFile = path.join(submissionDir, 'input');

const { part1, part2 } = await import(submissionFile);
const input = await fsp.readFile(inputFile, 'utf8');

if (process.env.DEBUG) {
    console.log(`Input: ${input}`);
}

{
    const t0 = performance.now();
    const result = await part1(input);
    const t1 = performance.now();
    console.log(`Part 1: ${result} (${t1 - t0}ms)`);
}

{
    const t0 = performance.now();
    const result = await part2(input);
    const t1 = performance.now();
    console.log(`Part 2: ${result} (${t1 - t0}ms)`);
}
