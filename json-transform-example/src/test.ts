import { transform } from "./index";
import { StringReadableStream, ConsoleLogWritableStream } from "@quadient/evolve-data-transformations";
import * as fs from "node:fs";

(async function () {
    const json = fs.readFileSync('example-input.json', 'utf-8');
    const input = new StringReadableStream(json);
    const output = new ConsoleLogWritableStream();
    await transform(input, output);
})();
