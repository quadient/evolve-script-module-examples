import { Messages } from "../../Utils/messages";
import { pathCombine } from "../../Utils/pathUtils";
import type {
  DocumentJson,
  DocumentsJson,
} from "../node_modules/@quadient/evolve-front-office-scripting-utils/dist/index";

export function getBundledGenerateSteps(
  documentsJson: DocumentsJson,
  outputDirectory: string,
  outputDirectoryForWatermark: string
): BundledGenerateOutputV2[] {
  return documentsJson.documents.reduce<BundledGenerateOutputV2[]>(
    (acc, document, index) => {
      const outputDirectoryPath = documentJsonIsCopy(document)
        ? outputDirectoryForWatermark
        : outputDirectory;
      const outputPath = pathCombine(
        outputDirectoryPath,
        `document_${index + 1}.tno`
      );
      console.debug(
        Messages.format(Messages.CreatingBundledGenerateSteps, outputPath)
      );

      acc.push(createPrintBundleFromDocument(document, outputPath));
      return acc;
    },
    []
  );
}

function documentJsonIsCopy(documentJson: DocumentJson): boolean {
  if (!documentJson.dispatchControl) {
    return false;
  }

  const isCopy = (
    documentJson.dispatchControl as Record<string, Record<string, string>>
  )?.Clients?.IsCopy;
  return isCopy?.toLowerCase() === "true";
}

function createPrintBundleFromDocument(
  document: DocumentJson,
  outputPath: string
): BundledGenerateOutputV2 {
  return {
    channel: "Print",
    outputType: "InspireNative",
    outputPath: outputPath,
    template: document.template,
    inputPaths: document.data.map(({ name, value }) => ({
      name,
      path: value,
    })),
    metadataPath: outputPath + ".json",
    documentLayoutPath: document.jsonimportfileDocumentLayout,
    documentLayoutConfig: document.configDocumentLayout,
    correlationId: "${system.jobId}${system.correlationId}",
  };
}
