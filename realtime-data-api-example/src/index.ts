import { RealtimeDataApiClient } from "@quadient/evolve-realtime-data-api-client";

export function getDescription(): ScriptDescription {
  return {
    description:
      "Parses details about archived emails from Digital Delivery Realtime Data API and prints them to the console.",
    input: [
      {
        id: "dataApi",
        displayName: "Realtime Data API connector",
        description: "Specify the Realtime Data API connector.",
        type: "Connector",
        required: true,
      },
      {
        id: "table",
        displayName: "Table connector",
        description:
          "Specify a database connector which includes a table name. This is where the cursor will be stored.",
        type: "Connector",
        required: true,
      },
    ],
  };
}

export async function execute(context: Context) {
  const dataApiConnector = context.parameters.dataApi as string;
  const tableConnector = context.parameters.table as string;

  const table = context.getTable(tableConnector);
  const cursor = await getCursor(table);

  console.log("Querying from cursor: " + cursor);

  const dataApiClient = new RealtimeDataApiClient(dataApiConnector);
  const deltaData = await dataApiClient.getDelta(cursor);

  for (const item of deltaData.deltaItems) {
    if (
      item.deltaType === "EmailArchive" &&
      item.customField.startsWith("myJobs")
    ) {
      console.log(item);
    }
  }

  console.log("Updating new cursor: " + deltaData.cursor);
  await table.upsert("cursor", deltaData.cursor);
}

async function getCursor(table: ITable): Promise<string | Date> {
  const dbValue = await table.get("cursor");

  if (dbValue) {
    return dbValue as string;
  }

  const date = new Date();
  date.setHours(date.getHours() - 24);

  return date;
}
