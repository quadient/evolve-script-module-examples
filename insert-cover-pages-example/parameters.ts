export interface Parameters {
    inputFilePath: string;
    metadataFilePath: string;
    prefixPagePath: string;
    sufixPagePath: string;
    outputFilePath: string;
    outputType: BundledGenerateOutputType;
    productionConfiguration: string;
    workingDirectory: string;
}
