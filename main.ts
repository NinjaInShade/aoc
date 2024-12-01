import fsp from 'node:fs/promises';
import path from 'node:path';

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

const part1Result = await part1(input);
console.log(`Part 1: ${part1Result}`);

const part2Result = await part2(input);
console.log(`Part 2: ${part2Result}`);
