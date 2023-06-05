export class Messages {
  static readonly ProcessingMultiDocument = "File '{0}' exists, processing multi-document.";
  static readonly ProcessingSingleDocument = "File '{0}' does not exists, processing single-document.";
  static readonly StepsCreated = "Created '{0}' steps.";
  static readonly StepCreated = "Created one step.";

  static readonly CreatingBundledGenerateSteps = "Creating bundled generate step with outputPath '{0}'";
  static readonly FindTnoFile = "Find TNO file '{0}'";

  static format(message: string, ...args: any[]): string {
    return message.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != "undefined" ? args[number] : match;
    });
  }
}
