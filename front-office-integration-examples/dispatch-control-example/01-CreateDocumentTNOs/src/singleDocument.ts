import "../../Utils/stringExtensions";
import { Messages } from "../../Utils/messages";
import { pathCombine } from "../../Utils/pathUtils";
import type { FrontOfficeMetadata } from "../node_modules/@quadient/evolve-front-office-scripting-utils/dist/index";
import { FrontOfficeDocument } from "./frontOfficeDocument";

export class SingleDocument extends FrontOfficeDocument {
  public async getBundledGenerateSteps(
    context: Context,
    inputPath: string,
    metadataFileName: string,
    outputDirectory: string,
    outputDirectoryForWatermark: string
  ): Promise<BundledGenerateOutputV2[]> {
    const metadataFilePath = pathCombine(inputPath, metadataFileName);
    const metadataFileContent = await context.read(metadataFilePath);
    const metadata: FrontOfficeMetadata = JSON.parse(metadataFileContent);

    const outputDirectoryPath = this.metadataIsCopy(metadata)
      ? outputDirectoryForWatermark
      : outputDirectory;
    const outputPath = pathCombine(outputDirectoryPath, "document.tno");
    console.debug(Messages.CreatingBundledGenerateSteps.format(outputPath));

    return [
      {
        channel: "Print",
        outputType: "InspireNative",
        outputPath: outputPath,
        template: "${system.templatePath}",
        inputPaths: [
          {
            name: "${system.defaultDataInputName}",
            path: inputPath,
          },
        ],
        metadataPath: outputPath + ".json",
        correlationId: "${system.jobId}${system.correlationId}",
      },
    ];
  }

  private metadataIsCopy(metadata: FrontOfficeMetadata): boolean {
    if (!metadata.dispatchControl) {
      return false;
    }

    return this.containsIsCopy(metadata.dispatchControl);
  }
}
