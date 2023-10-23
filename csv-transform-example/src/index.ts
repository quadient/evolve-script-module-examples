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
        description: "Reads CSV data and converts them to JSON format.",
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
                // Begin the JSON with '{ "Clients": [' sequence.
                controller.enqueue(E_START_OBJECT);
                controller.enqueue({type: JsonEventType.PROPERTY_NAME, data: "Clients"});
                controller.enqueue(E_START_ARRAY);
            },
            
            transform: async (event, controller) => {
                switch (event.type) {
                    case "values":
                        const d = event.data;
                        // construct the javascript object from the CSV values array
                        const obj = {
                            "CustID": d[0],
                            "CustName": d[1],
                            "CustMid": d[2],
                            "CustSur": d[3],
                            "CustMail":d[4],
                            "FromMail": d[5],
                            "CustPhone": d[6],
                            "FromPhone": d[7],
                            "Subject": d[8],
                            "CustGen": d[9],
                            "CustCompany": d[10],
                            "CustStreet": d[11],
                            "CustCity": d[12],
                            "CustZIP": d[13],
                            "CustCountry": d[14],
                            "CustState": d[15],
                            "CountryLong": d[16],
                            "Manager": d[17],
                            "Internet": d[18],
                            "Phone": d[19],
                            "Consultant": d[20],
                            "CustOption": d[21],
                            "Date": d[22],
                            "Open": d[23],
                            "High": d[24],
                            "Low": d[25],
                            "Close": d[26],
                            "Change": d[27],
                            "LastDate": d[28],
                            "LastOpen": d[29],
                            "LastHigh": d[30],
                            "LastLow": d[31],
                            "LastClose": d[32],
                            "LastChange": d[33],
                            "Initial_Amount": d[34],
                            "Jan": d[35],
                            "Feb": d[36],
                            "Mar": d[37],
                            "Apr": d[38],
                            "May": d[39],
                            "Jun": d[40],
                            "Jul": d[41],
                            "Aug": d[42],
                            "Sep": d[43],
                            "Oct": d[44],
                            "Nov": d[45],
                            "Dec": d[46],
                        }
                        // output the JSON event with the constructed object 
                        controller.enqueue({type: JsonEventType.ANY_VALUE, data: obj});
                }
            },
            
            flush: async(controller) => {
                // End the JSON with ']}' sequence.
                controller.enqueue(E_END_ARRAY);
                controller.enqueue(E_END_OBJECT);
            }
        });
    }
}
