export interface Command {
  command: string;
}

export interface GroupBeginCommand extends Command {}

export interface CopyInputPageCommand extends Command {
  inputFileName: string;
  inputPage: number;
  transformation?: number[];
  copySheetNames?: boolean;
  svgPath?: string;
}

export interface OverrideSheetNameCommand extends Command {
  index: number;
  value: string;
}

export interface Commands {
  pages: Command[][];
}

export function createGroupBeginCommmand(): GroupBeginCommand {
  return {
    command: "SetGroupBegin",
  };
}

export function createOverrideSheetNameCommand(
  index: number,
  value: string
): OverrideSheetNameCommand {
  return {
    command: "OverrideSheetName",
    index: index,
    value: value,
  };
}

export function createPageSizeCommmand(
  size: number[]
): OverrideSheetNameCommand {
  const formattedSize = "(" + size[0] + "m," + size[1] + "m)";
  return createOverrideSheetNameCommand(1, formattedSize);
}

export function createCopyInputPageCommand(
  inputFileName: string,
  inputPageNumber: number,
  transformation: number[] | undefined = undefined,
  copySheetNames: boolean = true,
  svgPath: string | undefined = undefined
): CopyInputPageCommand {
  return {
    command: "CopyInputPage",
    inputFileName: inputFileName,
    inputPage: inputPageNumber,
    copySheetNames: copySheetNames,
    transformation: transformation,
    svgPath: svgPath,
  };
}

export function getCommandFileName(): string {
  return `command-${createGuid()}.json`;
}
