# Cover Page Generator

## Overview

This script takes a specified document and adds it to the beginning or end of each document in a record.

## Prerequisites

The following tools must be installed in order to be able to build the example modules:

- NodeJS
- Yarn

## Building the Script

First, clone this git repository. Open the command line and type:

git clone https://github.com/your-repository.git


Next, you need to build the cover page generator script. In the command line, switch to the folder called cover-page-generator and run the following commands:

cd cover-page-generator yarn install


## Usage

The script has the following input parameters:

- `inputFilePath`: Path to the TNO file containing source data.
- `metadataFilePath`: Path to the metadata file. If left empty, the search for the file is performed in the same location as for the input file with the JSON extension, including the full name of the file (e.g. share://file.tno.json).
- `prefixPagePath`: Path to the page that will be used as a prefix.
- `sufixPagePath`: Path to the page that will be used as a suffix.
- `outputFilePaths`: Path to the output files. It should contain the %c substitution character, which represents the file index.
- `outputType`: Desired output type.
- `productionConfigurationType`: Prefix (type) used to locate the production configuration file.
- `productionConfiguration`: Path to the production configuration file following the prefix (type).

## Conversion Script Description

The script has two exported methods:

### `getDescription`

The `getDescription` method provides general information about the script itself – its name, description, description of the parameters. It returns an object containing the following properties:

- `displayName`: Display name of the script.
- `description`: Description of the script.
- `category`: Category of the script.
- `input`: Array containing the input parameters: id, displayName, description, type, and required properties.
- `output`: Array containing the output parameters: id, type, displayName, and description properties.

### `execute`

The `execute` method contains the main body of the script. It takes a Context object as a parameter and returns a promise containing the output of the script.

The script uses the Impositioning module to create a MetaContext object from the metadata file, then it creates a command JSON object using the `createCommandJson` method.

The command JSON object is then written to a command file, and a BundledGenerateOutput object is created using the `createBundledGenerateOutput` method.

The `execute` method returns an object containing the BundledGenerateOutput object.

### `createCommandJson`

The `createCommandJson` method takes a MetaContext object, an input file name, input prefix and suffix pages, and a Context object as parameters.

The method loops through each group in the MetaContext, and for each page size in the group, it creates a new page. If the current page is the first page and a prefix page is provided, it creates a new page with the prefix page. It then adds the current input page to the new page and sets the page size. If the current page is the last page and a suffix page is provided, it creates a new page with the suffix page.

Finally, the method returns the command JSON object.