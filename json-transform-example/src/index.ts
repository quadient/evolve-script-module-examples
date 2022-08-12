import {
    StringToJsonTransformStream,
    JsonToStringTransformStream,
    JsonMaterializingTransformStream,
    JsonEvent,
    JsonEventType,
} from "@quadient/evolve-data-transformations";
import {normalizeIBAN, isValidIBAN} from "./iban";

export function getDescription(): ScriptDescription {
    return {
        displayName: "Custom JSON Transformation",
        description: "Reads JSON data and modifies its content",
        category: "Examples",
        input: [
            {
                id: "source",
                displayName: "Source JSON file",
                description: "Source JSON resource that will be processed. Must be encoded in UTF-8.",
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
        .pipeThrough(new StringToJsonTransformStream())
        .pipeThrough(new JsonMaterializingTransformStream({ materializedPaths: [".customers[*]"] }))
        .pipeThrough(new JsonCustomTransformStream())
        .pipeThrough(new JsonToStringTransformStream())
        .pipeTo(output);
}

class JsonCustomTransformStream extends TransformStream<JsonEvent, JsonEvent> {
    constructor() {
        super({
            transform: async (event, controller) => {
                
                // Process the event, modify and enrich some parts of the parsed json object.
                switch (event.type) {
                    case JsonEventType.ANY_VALUE:
                        const o = event.data;

                        // Regexp replacement
                        o.first_name = o.first_name.replace(/^[mM][rR][sS]?\./, '');

                        // Join two strings
                        o.full_name = o.first_name + " " + o.last_name;

                        // Array creation
                        if (o.address.postal_code) {
                            o.address_lines = [];

                            // Concatenate and trim strings
                            o.address_lines.push((o.address.street_name + " " + o.address.street_number).trim());
                            if (o.address.city) {
                                o.address_lines.push(o.address.city);
                            }
                            o.address_lines.push(o.address.postal_code);
                            o.address_lines.push(o.address.country.toUpperCase());
                        }

                        if (o.registration_date) {
                            // Parsing a date
                            const regDateMillis = Date.parse(o.registration_date);
                            const nowMillis = new Date().getTime();

                            // Math.floor
                            o.registration_duration_days = Math.floor((nowMillis - regDateMillis) / 1000 / 60 / 60 / 24);
                        }
                        
                        // check and normalize IBAN
                        if(o.bank_account_iban) {
                            const ibanNormalized = normalizeIBAN(o.bank_account_iban);
                            if(isValidIBAN(ibanNormalized)) {
                                o.bank_account_iban = ibanNormalized;
                            } else {
                                console.warn("Invalid iban format: " + o.bank_account_iban);
                                delete o.bank_account_iban;
                            }
                        }

                        break;
                }
                
                // Pass the event to the output
                controller.enqueue(event);
            },
        });
    }
}
