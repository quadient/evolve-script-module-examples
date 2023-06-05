import "../../Utils/stringExtensions";
import { Messages } from "../../Utils/messages";
import { pathCombine } from "../../Utils/pathUtils";
import type {
  DocumentJson,
  DocumentsJson,
} from "../node_modules/@quadient/evolve-front-office-scripting-utils/dist/index";
import { FrontOfficeDocument } from "./frontOfficeDocument";

export class MultiDocument extends FrontOfficeDocument {
  public async getBundledGenerateSteps(
    documentsJsonFile: IFile,
    outputDirectory: string,
    outputDirectoryForWatermark: string
  ): Promise<BundledGenerateOutputV2[]> {
    const documentsJsonFileContent = await documentsJsonFile.read();
    const documentsJson: DocumentsJson = JSON.parse(documentsJsonFileContent);

    return documentsJson.documents.reduce<BundledGenerateOutputV2[]>(
      (acc, document, index) => {
        const outputDirectoryPath = this.documentJsonIsCopy(document)
          ? outputDirectoryForWatermark
          : outputDirectory;
        const outputPath = pathCombine(
          outputDirectoryPath,
          `document_${index + 1}.tno`
        );
        console.debug(Messages.CreatingBundledGenerateSteps.format(outputPath));
        acc.push(this.createPrintBundleFromDocument(document, outputPath));
        return acc;
      },
      []
    );
  }

  private documentJsonIsCopy(documentJson: DocumentJson): boolean {
    if (!documentJson.dispatchControl) {
      return false;
    }

    return this.containsIsCopy(documentJson.dispatchControl);
  }

  private createPrintBundleFromDocument(
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
}
