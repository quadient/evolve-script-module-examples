export abstract class FrontOfficeDocument {
  protected containsIsCopy(dispatchControl: unknown): boolean {
    const isCopy = (dispatchControl as Record<string, Record<string, string>>)
      ?.Clients?.IsCopy;
    return isCopy?.toLowerCase() === "true";
  }
}
