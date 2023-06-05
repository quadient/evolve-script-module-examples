import { getBundledGenerateSteps as getsingleDocumentBundledGenerateSteps } from "./singleDocument";
import { getBundledGenerateSteps as getmultiDocumentBundledGenerateSteps } from "./multiDocument";
import { Messages } from "../../Utils/messages";
import {
  pathCombine,
  DocumentsPath,
  DocumentsForWatermarkPath,
} from "../../Utils/pathUtils";
import type {
  DocumentsJson,
  FrontOfficeMetadata,
} from "../node_modules/@quadient/evolve-front-office-scripting-utils/dist/index";

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

  let steps: BundledGenerateOutputV2[];
  const documentsJsonFilePath = pathCombine(source, documentsJsonFileName);
  const documentsJsonFile = context.getFile(documentsJsonFilePath);
  if (await documentsJsonFile.exists()) {
    console.log(
      Messages.format(Messages.ProcessingMultiDocument, documentsJsonFilePath)
    );

    const documentsJsonFileContent = await documentsJsonFile.read();
    const documentsJson: DocumentsJson = JSON.parse(documentsJsonFileContent);

    steps = getmultiDocumentBundledGenerateSteps(
      documentsJson,
      outputDirectory,
      outputDirectoryForWatermark
    );
  } else {
    console.log(
      Messages.format(Messages.ProcessingSingleDocument, documentsJsonFilePath)
    );
    const metadataFilePath = pathCombine(source, metadataFileName);
    const metadataFileContent = await context.read(metadataFilePath);
    const metadata: FrontOfficeMetadata = JSON.parse(metadataFileContent);

    steps = getsingleDocumentBundledGenerateSteps(
      metadata,
      source,
      outputDirectory,
      outputDirectoryForWatermark
    );
  }

  console.log(Messages.format(Messages.StepsCreated, steps.length));
  return {
    bundledGenerateSteps: steps,
  };
}
