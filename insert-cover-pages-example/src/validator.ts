import { Parameters } from './parameters';

export class Validator {
    static validateParameters(parameters: Parameters) {
        if (
            parameters.prefixPagePath &&
            !parameters.prefixPagePath.endsWith('.pdf') &&
            !parameters.prefixPagePath.endsWith('.tno')
        ) {
            throw new Error(
                'Prefix input path must be a valid PDF or TNO file'
            );
        }

        if (
            parameters.sufixPagePath &&
            !parameters.sufixPagePath.endsWith('.pdf') &&
            !parameters.sufixPagePath.endsWith('.tno')
        ) {
            throw new Error('Sufix path must be a valid PDF or TNO file');
        }
    }

    static async validateMetadataFileExists(metadataFile: IFile) {
        if (!(await metadataFile.exists())) {
            throw new Error(
                "The metadata file was not found. Make sure that the file exists. If you did not specify the metadata file's path via input parameters, make sure that the JSON file is placed in the same directory as the corresponding TNO file."
            );
        }
    }
}
