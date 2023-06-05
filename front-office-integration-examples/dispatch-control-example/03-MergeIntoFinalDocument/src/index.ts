import "../../Utils/stringExtensions";
import { createCommands } from "./commandsCreator";
import { getCommandFileName } from "../../Utils/commandUtils";
import { Messages } from "../../Utils/messages";
import {
  pathCombine,
  DocumentsPath,
  DocumentsForWatermarkPath,
  DocumentsWithWatermarkPath,
} from "../../Utils/pathUtils";

export function getDescription(): ScriptDescription {
  return {
    description: "Merges documents.",
    input: [
      {
        id: "workingDirectory",
        displayName: "Working directory",
        description:
          "A working folder that stores auxiliary files generated during processing.",
        type: "Connector",
        defaultValue: "blob://ProcessingData",
        required: true,
        readonly: true,
      },
      {
        id: "outputFilePath",
        displayName: "Output file path",
        description: "A path that will contain the output file.",
        type: "OutputResource",
        required: true,
      },
    ],
    output: [
      {
        id: "bundledGenerate",
        type: "BundledGenerate",
        displayName: "Bundled Step",
        description: "Bundled pipeline step.",
      },
    ],
  };
}

export async function execute(context: Context): Promise<Output> {
  const workingDirectory = context.parameters.workingDirectory as string;
  const outputFilePath = context.parameters.outputFilePath as string;

  const documentsPath = pathCombine(workingDirectory, DocumentsPath);
  const documentsForWatermarkPath = pathCombine(
    workingDirectory,
    DocumentsForWatermarkPath
  );
  const documentsWithWatermarkPath = pathCombine(
    workingDirectory,
    DocumentsWithWatermarkPath
  );

  const documents = await getTnoFiles(context, documentsPath);
  const documentsForWatermark = await getTnoFiles(
    context,
    documentsForWatermarkPath
  );
  const documentsWithWatermark = await getTnoFiles(
    context,
    documentsWithWatermarkPath
  );
  const tnoFiles = [
    ...documents,
    ...documentsForWatermark,
    ...documentsWithWatermark,
  ];
  const tnoFilesSorted = tnoFiles.sort((a: any, b: any) =>
    a.split("/").pop() < b.split("/").pop() ? -1 : 1
  );

  const template = context.environment.impositioningTemplatePath;
  const commandFilePath = pathCombine(
    pathCombine(workingDirectory, "commands"),
    getCommandFileName()
  );
  const commands = await createCommands(context, tnoFilesSorted);
  await context.write(commandFilePath, JSON.stringify(commands));

  console.log(Messages.StepCreated);
  return {
    bundledGenerate: createBundledGenerate(
      template,
      commandFilePath,
      outputFilePath
    ),
  };
}

async function getTnoFiles(context: Context, path: string): Promise<string[]> {
  const result: string[] = [];

  for await (const file of context.getDirectory(path).list()) {
    const filename = file.getName();
    if (file.getLocationType() === "File" && filename.endsWith(".tno")) {
      const filePath = pathCombine(path, filename);
      console.debug(Messages.TnoFileFound.format(filePath));

      result.push(filePath);
    }
  }

  return result;
}

function createBundledGenerate(
  template: string,
  commandPath: string,
  outputPath: string
): BundledGenerateOutputV2 {
  return {
    channel: "Print",
    outputType: "PDF",
    outputPath: outputPath,
    template: template,
    inputPaths: [
      {
        name: "Commands",
        path: commandPath,
      },
    ],
  };
}
