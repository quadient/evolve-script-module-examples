import {
    JsonToStringTransformStream,
    JsonEvent,
    JsonEventType,
    StringToCsvTransformStream,
    CsvEvent,
    E_START_OBJECT,
    E_START_ARRAY,
    E_END_ARRAY,
    E_END_OBJECT
} from "@quadient/evolve-data-transformations";

export function getDescription(): ScriptDescription {
    return {
        displayName: "Custom CSV to JSON Transformation",
        description: "Reads CSV data and converts them to JSON format.",
        category: "Examples",
        input: [
            {
                id: "source",
                displayName: "Source CSV file",
                description: "Source CSV resource that will be processed. Must be encoded in UTF-8.",
                type: "InputResource",
                required: true,
            },
            {
                id: "target",
                displayName: "Target JSON file",
                description: "File the JSON file will be written to.",
                type: "OutputResource",
                required: true,
            },
        ],
        output: [],
    };
}

export async function execute(context: Context) {
    // Open Input
    console.log("Reading from " + (context.parameters.source as string));
    const input = await context.openReadText(context.parameters.source as string);

    // Delete output file if it exists
    try {
        const outputFile = context.getFile(context.parameters.target as string);
        await outputFile.delete();
    } catch (e) {
        // no problem, output is probably not a file or does not exist
    }

    // Open output
    console.log("Writing to " + (context.parameters.target as string));
    const output = await context.openWriteText(context.parameters.target as string);

    // Run the stream transformation
    try {
        await transform(input, output);
    } catch (e) {
        // In case of error in transformation delete the output file, so that
        // no partial result remains.
        try {
            const outputFile = context.getFile(context.parameters.target as string);
            await outputFile.delete();
        } catch (e) {
            // no problem, output is probably not a file or does not exist
        }
        throw e;
    }
}

export async function transform(input: ReadableStream<string>, output: WritableStream<string>) {
    await input
        .pipeThrough(new StringToCsvTransformStream())
        .pipeThrough(new CsvCustomTransformStream())
        .pipeThrough(new JsonToStringTransformStream())
        .pipeTo(output);
}

class CsvCustomTransformStream extends TransformStream<CsvEvent, JsonEvent> {
    constructor() {
        super({
            start: async(controller) => {
                controller.enqueue(E_START_OBJECT);
                controller.enqueue({type: JsonEventType.PROPERTY_NAME, data: "customers"});
                controller.enqueue(E_START_ARRAY);
            },
            
            transform: async (event, controller) => {
                switch (event.type) {
                    case "values":
                        const obj = {
                            id: event.data[0],
                            full_name: event.data[1] + " " + event.data[2],
                            email: event.data[3],
                            address: [
                                event.data[5] + " " + event.data[6],
                                event.data[9] + " " + event.data[7],
                                event.data[8],
                            ]
                        }
                        controller.enqueue({type: JsonEventType.ANY_VALUE, data: obj});
                }
            },
            
            flush: async(controller) => {
                controller.enqueue(E_END_ARRAY);
                controller.enqueue(E_END_OBJECT);
            }
        });
    }
}
