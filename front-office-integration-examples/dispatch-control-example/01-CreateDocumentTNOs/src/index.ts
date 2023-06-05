import "../../Utils/stringExtensions";
import { SingleDocument } from "./singleDocument";
import { MultiDocument } from "./multiDocument";
import { Messages } from "../../Utils/messages";
import {
  pathCombine,
  DocumentsPath,
  DocumentsForWatermarkPath,
} from "../../Utils/pathUtils";

export function getDescription(): ScriptDescription {
  return {
    description: "Processes documents from Front Office tickets.",
    input: [
      {
        id: "source",
        displayName: "Source",
        description: "Data from Front Office.",
        type: "InputResource",
        defaultValue: "request://",
        required: true,
        readonly: true,
      },
      {
        id: "workingDirectory",
        displayName: "Working directory",
        description:
          "A working folder that stores auxiliary files generated during processing.",
        type: "OutputResource",
        defaultValue: "blob://ProcessingData",
        required: true,
        readonly: true,
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
  const documentsJsonFileName = "documents.json";
  const metadataFileName = "ticket.metadata";

  const source = context.parameters.source as string;
  const workingDirectory = context.parameters.workingDirectory as string;

  const outputDirectory = pathCombine(workingDirectory, DocumentsPath);
  const outputDirectoryForWatermark = pathCombine(
    workingDirectory,
    DocumentsForWatermarkPath
  );

  const documentsJsonFilePath = pathCombine(source, documentsJsonFileName);
  const documentsJsonFile = context.getFile(documentsJsonFilePath);
  let steps: BundledGenerateOutputV2[];
  if (await isMultiDocument(documentsJsonFile)) {
    console.log(Messages.ProcessingMultiDocument.format(documentsJsonFilePath));
    steps = await new MultiDocument().getBundledGenerateSteps(
      documentsJsonFile,
      outputDirectory,
      outputDirectoryForWatermark
    );
  } else {
    console.log(
      Messages.ProcessingSingleDocument.format(documentsJsonFilePath)
    );
    steps = await new SingleDocument().getBundledGenerateSteps(
      context,
      source,
      metadataFileName,
      outputDirectory,
      outputDirectoryForWatermark
    );
  }

  console.log(Messages.StepsCreated.format(steps.length));
  return {
    bundledGenerateSteps: steps,
  };
}

async function isMultiDocument(file: IFile): Promise<boolean> {
  return await file.exists();
}
