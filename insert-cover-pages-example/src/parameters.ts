export class Parameters {
    constructor(
        readonly inputFilePath: string,
        readonly metadataFilePath: string,
        readonly prefixPagePath: string,
        readonly sufixPagePath: string,
        readonly outputFilePath: string,
        readonly outputType: BundledGenerateOutputType,
        readonly productionConfiguration: string,
        readonly workingDirectory: string
    ) {}

    static load(context: Context): Parameters {
        return new Parameters(
            context.parameters.inputFilePath as string,
            context.parameters.metadataFilePath as string,
            context.parameters.prefixPagePath as string,
            context.parameters.sufixPagePath as string,
            context.parameters.outputFilePath as string,
            context.parameters.outputType as BundledGenerateOutputType,
            context.parameters.productionConfiguration as string,
            context.parameters.workingDirectory as string
        );
    }
}
