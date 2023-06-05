import { createCommands } from "./commandsCreator";
import { getCommandFileName } from "../../Utils/commandUtils";
import { Messages } from "../../Utils/messages";
import {
  pathCombine,
  DocumentsForWatermarkPath,
  DocumentsWithWatermarkPath,
} from "../../Utils/pathUtils";

export function getDescription(): ScriptDescription {
  return {
    description: "Add watermark to documents.",
    input: [
      {
        id: "workingDirectory",
        displayName: "WorkingDirectory",
        description: "WorkingDirectory",
        type: "Connector",
        defaultValue: "blob://FoIntegration",
        required: true,
        readonly: true,
      },
      {
        id: "watermarkPath",
        displayName: "watermarkPath",
        description: "Path to file with content to add (Blob storage).",
        type: "Connector",
        required: true,
      },
    ],
    output: [
      {
        id: "bundledGenerateSteps",
        type: "BundledGenerateArray",
        displayName: "Bundled Steps",
        description: "Bundled pipeline steps.",
      },
    ],
  };
}

export async function execute(context: Context): Promise<Output> {
  const workingDirectory = context.parameters.workingDirectory as string;
  const watermarkPath = context.parameters.watermarkPath as string;

  const inputDirectory = pathCombine(
    workingDirectory,
    DocumentsForWatermarkPath
  );
  const outputDirectory = pathCombine(
    workingDirectory,
    DocumentsWithWatermarkPath
  );
  const impositioningTemplatePath =
    context.environment.impositioningTemplatePath;

  const steps: BundledGenerateOutputV2[] = [];
  for await (const file of context.getDirectory(inputDirectory).list()) {
    const filename = file.getName();
    if (file.getLocationType() === "Directory" || !filename.endsWith(".tno")) {
      continue;
    }

    const sourceFile = pathCombine(inputDirectory, filename);
    const targetFile = pathCombine(outputDirectory, filename);

    const commandFilePath = pathCombine(
      pathCombine(workingDirectory, "commands"),
      getCommandFileName()
    );
    const commands = await createCommands(context, sourceFile, watermarkPath);
    await context.write(commandFilePath, JSON.stringify(commands));
    steps.push(
      await createBundledGenerateOutput(
        impositioningTemplatePath,
        commandFilePath,
        targetFile
      )
    );
  }

  console.log(Messages.format(Messages.StepsCreated, steps.length));
  return {
    bundledGenerateSteps: steps,
  };
}

function createBundledGenerateOutput(
  template: string,
  commandPath: string,
  outputPath: string
): BundledGenerateOutputV2 {
  return {
    channel: "Print",
    outputType: "InspireNative",
    outputPath: outputPath,
    template: template,
    inputPaths: [
      {
        name: "Commands",
        path: commandPath,
      },
    ],
    metadataPath: outputPath + ".json",
  };
}
