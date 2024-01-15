    export const InputParamInputFilePath: InputResourceParameterDescription =
        {
            id: 'inputFilePath',
            displayName: 'Input file path',
            description: 'Path to TNO file containing source data.',
            type: 'InputResource',
            required: true,
        };

    export const InputParamMetadataFilePath: InputResourceParameterDescription =
        {
            id: 'metadataFilePath',
            displayName: 'Metadata file path',
            description:
                'Path to the metadata file. If left empty, the search for the file is performed in the same location as for the input file with the JSON extension, including the full name of the file (e.g. share://file.tno.json).',
            type: 'InputResource',
            required: true,
        };

    export const InputParamPrefixPagePath: InputResourceParameterDescription =
        {
            id: 'prefixPagePath',
            displayName: 'Prefix page path',
            description:
                'Path to extra page used as prefix(first page of the input).',
            type: 'InputResource',
            required: false,
        };

    export const InputParamSufixPagePath: InputResourceParameterDescription =
        {
            id: 'sufixPagePath',
            displayName: 'Sufix page path',
            description:
                'Path to extra page used as suffix(first page of the input).',
            type: 'InputResource',
            required: false,
        };

    export const InputParamOutputFilePath: OutputResourceParameterDescription =
        {
            id: 'outputFilePath',
            displayName: 'Output file path',
            description:
                'Path to the output files. It should contain the %c substitution character, which represents the file index.',
            type: 'OutputResource',
            required: true,
        };

    export const InputParamOutputType: SelectionInputParameterDescription = {
        id: 'outputType',
        displayName: 'Output type',
        description: 'Desired output type.',
        type: 'Selection',
        options: ['PDF', 'AFP', 'InspireNative', 'MTIFF'],
        required: true,
        defaultValue: 'InspireNative',
    };

    export const InputParamProductionConfiguration: InputParameterDescription =
        {
            id: 'productionConfiguration',
            displayName: 'Production configuration',
            description:
                'Path to production configuration file following the prefix (type).',
            type: 'Connector',
            required: false,
        };

    export const InputParamWorkingDirectory: ConnectorParameterDescription =
        {
            id: 'workingDirectory',
            displayName: 'workingDirectory',
            description:
                'A working directory that stores auxiliary files generated during processing..',
            type: 'Connector',
            required: true,
            readonly: true,
            defaultValue: 'job://',
        };

    export const OutputParamCoverPageGenerator: BasicOutputParameterDescription =
        {
            id: 'coverPageGenerator',
            type: 'BundledGenerateArray',
            displayName: 'Impositioning Bundle Generate Output',
            description: 'Bundles the generate steps.',
        };

