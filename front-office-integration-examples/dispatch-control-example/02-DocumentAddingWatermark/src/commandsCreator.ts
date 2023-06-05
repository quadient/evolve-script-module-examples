import { MoveX, MoveY, ScaleX, ScaleY, SvgPath } from "./constant";
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
  inputFileName: string,
  watermarkPath: string
): Promise<Commands> {
  const commands: Commands = { pages: [] };

  const metadataPath = inputFileName + ".json";
  const metadataContent = await context.read(metadataPath);
  const metadataJson: Metadata = JSON.parse(metadataContent);
  const metaContext = createMetaContext(metadataJson);

  metaContext.groups.forEach((group) => {
    for (let pageIndex = 0; pageIndex < group.pageSizes.length; pageIndex++) {
      const newPage: Command[] = [];
      if (pageIndex === 0) {
        newPage.push(createGroupBeginCommmand());
      }

      const pageNumber = group.pageNumbers[pageIndex];
      newPage.push(
        createCopyInputPageCommand(
          inputFileName,
          pageNumber,
          undefined,
          true,
          SvgPath
        )
      );
      newPage.push(
        createCopyInputPageCommand(
          watermarkPath,
          pageNumber,
          getTransformation()
        )
      );

      newPage.push(createPageSizeCommmand(group.pageSizes[pageIndex]));
      commands.pages.push(newPage);
    }
  });

  return commands;
}

function getTransformation(): number[] {
  let transformation = [1, 0, 0, 1, 0, 0];
  transformation = transformationAddMove(MoveX, MoveY, transformation);
  transformation = tranformationAddScale(ScaleX, ScaleY, transformation);
  return transformation;
}

function tranformationAddScale(
  scaleX: number,
  scaleY: number,
  transformation: number[]
): number[] {
  transformation[0] = scaleX;
  transformation[3] = scaleY;
  return transformation;
}

function transformationAddMove(
  moveX: number,
  moveY: number,
  transformation: number[]
): number[] {
  transformation[4] += moveX;
  transformation[5] += moveY;
  return transformation;
}
