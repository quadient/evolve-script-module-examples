import { Metadata, createMetaContext } from "../../Utils/metaContextUtils";
import {
  Command,
  Commands,
  createGroupBeginCommmand,
  createPageSizeCommmand,
  createCopyInputPageCommand,
} from "../../Utils/commandUtils";

export async function createCommands(
  context: Context,
  inputFileNames: string[]
): Promise<Commands> {
  const commands: Commands = { pages: [] };

  for (let i = 0; i < inputFileNames.length; i++) {
    const inputFileName = inputFileNames[i];

    const metadataFileName = inputFileName + ".json";
    const metadataFileContent = await context.read(metadataFileName);
    const metadata: Metadata = JSON.parse(metadataFileContent);
    const metaContext = createMetaContext(metadata);

    metaContext.groups.forEach((group) => {
      for (let pageIndex = 0; pageIndex < group.pageSizes.length; pageIndex++) {
        const newPage: Command[] = [];
        if (pageIndex === 0) {
          newPage.push(createGroupBeginCommmand());
        }
        newPage.push(
          createCopyInputPageCommand(
            inputFileName,
            group.pageNumbers[pageIndex]
          )
        );
        newPage.push(createPageSizeCommmand(group.pageSizes[pageIndex]));
        commands.pages.push(newPage);
      }
    });
  }

  return commands;
}
