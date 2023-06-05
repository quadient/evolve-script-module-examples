import { getBundledGenerateSteps as getsingleDocumentBundledGenerateSteps } from "./singleDocument";
import { getBundledGenerateSteps as getmultiDocumentBundledGenerateSteps } from "./multiDocument";
import { Messages } from "../../Utils/messages";
import {
  pathCombine,
  DocumentsPath,
  DocumentsForWatermarkPath,
} from "../../Utils/pathUtils";

export function getDescription(): ScriptDescription {
  return {
    description: "Processes documents from front office ticket.",
    input: [
      {
        id: "source",
        displayName: "Source",
        description: "Data from front office.",
        type: "InputResource",
        defaultValue: "request://",
        required: true,
        readonly: true,
      },
      {
        id: "workingDirectory",
        displayName: "WorkingDirectory",
        description: "WorkingDirectory",
        type: "OutputResource",
        defaultValue: "blob://FoIntegration",
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
    console.log(
      Messages.format(Messages.ProcessingMultiDocument, documentsJsonFilePath)
    );
    steps = await getmultiDocumentBundledGenerateSteps(
      documentsJsonFile,
      outputDirectory,
      outputDirectoryForWatermark
    );
  } else {
    console.log(
      Messages.format(Messages.ProcessingSingleDocument, documentsJsonFilePath)
    );
    steps = await getsingleDocumentBundledGenerateSteps(
      context,
      source,
      metadataFileName,
      outputDirectory,
      outputDirectoryForWatermark
    );
  }

  console.log(Messages.format(Messages.StepsCreated, steps.length));
  return {
    bundledGenerateSteps: steps,
  };
}

async function isMultiDocument(file: IFile): Promise<boolean> {
  return await file.exists();
}
