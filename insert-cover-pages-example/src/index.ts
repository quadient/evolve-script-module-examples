import { Parameters } from './parameters';
import * as parametersDescriptions from './parametersDescriptions';
import { Validator } from './validator';
import { MetaContext, createMetaContext } from './Utils/metaContextUtils';
import { pathCombine } from './Utils/pathUtils';
import {
    Command,
    Commands,
    createCopyInputPageCommand,
    createGroupBeginCommmand,
    createPageSizeCommmand,
    getCommandFileName,
} from './Utils/commandUtils';

export function getDescription(): ScriptDescription {
    return {
        displayName: 'Insert Cover Pages',
        description:
            'Takes a fixed document and adds it to the beginning or end of each document in a record',
        category: 'Impositioning',
        input: [
            parametersDescriptions.InputParamInputFilePath,
            parametersDescriptions.InputParamMetadataFilePath,
            parametersDescriptions.InputParamPrefixPagePath,
            parametersDescriptions.InputParamSufixPagePath,
            parametersDescriptions.InputParamOutputFilePath,
            parametersDescriptions.InputParamOutputType,
            parametersDescriptions.InputParamProductionConfiguration,
            parametersDescriptions.InputParamWorkingDirectory,
        ],
        output: [parametersDescriptions.OutputParamInsertCoverPages],
    } as const satisfies ScriptDescription;  
}

export async function execute(context: Context): Promise<Output> {
    var parameters = context.parameters as unknown as Parameters;
    Validator.validateParameters(parameters);

    const metadataFile = context.getFile(parameters.metadataFilePath);
    await Validator.validateMetadataFileExists(metadataFile);
    const metadataJson = JSON.parse(await metadataFile.read());

    const metaContext = createMetaContext(metadataJson);

    const commandJson = createCommands(
        metaContext,
        parameters.inputFilePath,
        parameters.prefixPagePath,
        parameters.sufixPagePath
    );
    const commandPath = pathCombine(
        parameters.workingDirectory,
        getCommandFileName()
    );
    await context.write(commandPath, JSON.stringify(commandJson));

    const bundledGenerateStep = await createBundledGenerateOutput(
        context.environment.impositioningTemplatePath,
        commandPath,
        parameters
    );

    return {
        insertCoverPages: bundledGenerateStep,
    };
}

function createCommands(
    metaContext: MetaContext,
    inputFileName: string,
    inputPrefixPage: string,
    inputSufixPage: string
): Commands {
    const commandJson = {} as Commands;
    commandJson.pages = [];
    metaContext.groups.forEach((group) => {
        if (inputPrefixPage != undefined) {
            let prefixPage: Command[] = [];
            prefixPage.push(createGroupBeginCommmand());
            prefixPage.push(createCopyInputPageCommand(inputPrefixPage, 1));
            prefixPage.push(createPageSizeCommmand(group.pageSizes[0]));
            commandJson.pages.push(prefixPage);
        }
        for (let i = 0; i < group.pageSizes.length; i++) {
            let newPage: Command[] = [];

            if (i === 0 && inputPrefixPage == undefined) {
                newPage.push(createGroupBeginCommmand());
            }
            newPage.push(
                createCopyInputPageCommand(inputFileName, group.pageNumbers[i])
            );
            newPage.push(createPageSizeCommmand(group.pageSizes[i]));
            commandJson.pages.push(newPage);
        }
        if (inputSufixPage != undefined) {
            let sufixPage: Command[] = [];
            sufixPage.push(createCopyInputPageCommand(inputSufixPage, 1));
            sufixPage.push(createPageSizeCommmand(group.pageSizes[0]));
            commandJson.pages.push(sufixPage);
        }
    });
    return commandJson;
}

async function createBundledGenerateOutput(
    template: string,
    commandPath: string,
    parameters: Parameters
): Promise<BundledGenerateOutputV2> {
    const isInspireNativeOutput = parameters.outputType === 'InspireNative';
    const bundledGenerate: BundledGenerateOutputV2 = {
        channel: 'Print',
        template: template,
        outputType: parameters.outputType,
        outputPath: parameters.outputFilePath,
        inputPaths: [
            {
                name: 'Commands',
                path: commandPath,
            },
        ],
        productionConfiguration: parameters.productionConfiguration,
    };

    if (isInspireNativeOutput) {
        bundledGenerate.metadataPath = parameters.outputFilePath + '.json';
    }

    return bundledGenerate;
}
