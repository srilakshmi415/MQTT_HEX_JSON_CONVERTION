
const protobuf = require("protobufjs");

function encodeJsonToHex(jsonObj, MessageType) {
  const errMsg = MessageType.verify(jsonObj);
  if (errMsg) throw new Error("Invalid payload: " + errMsg);

  const msg = MessageType.create(jsonObj);
  console.log(" Encoded EventMessage (internal):");
  console.log(JSON.stringify(msg, null, 2));

  const buf = MessageType.encode(msg).finish();
  const hex = Buffer.from(buf).toString("hex");
  return "<Buffer " + hex.match(/.{1,4}/g).join(" ") + ">";
}

async function main() {
  console.log(" Loading CVIP Event Protobufs...");

  const root = await protobuf.load([
    "proto/jeep_event_message.proto",   // EventMessage[file:20]
    "proto/jeep_event.proto",           // EventPayload, Events, IgnitionStatusPayload[file:21]
    "proto/jeep_common.proto",          // enums[file:22]
    "proto/timestamp.proto"
  ]);

  const EventMessage = root.lookupType("stla.cvip.jeep.EventMessage");
  console.log("FIELDS:", EventMessage.fieldsArray.map(f => f.name));

  const eTboxApplicationState = root.lookupEnum("stla.cvip.jeep.eTboxApplicationState");
  const eTboxeSimState = root.lookupEnum("stla.cvip.jeep.eTboxeSimState");
const IgnitionPropertyType = root.lookupEnum("stla.cvip.jeep.IgnitionPropertyType");
  
const FULL_OBJ = {
  messageId: "dd52bab1-c64a-431b-a945-1602f26e9f4e",
  eTboxApplicationState: eTboxApplicationState.values.customer,   // "CUSTOMER"
  tboxEsimState:        eTboxeSimState.values.normal_sim,        // "NORMAL_SIM"
  version: "1.0.0",
  timeStamp: { seconds: 1765974352, nanos: 100000000 },

  eventPayload: {
    EventsData: [
      {
        timeStamp: { seconds: 1765974352, nanos: 100000000 },

        // oneof field name from proto = IgnitionStatus
        IgnitionStatus: {
          // directly put the enum value here
          IgnitionState: IgnitionPropertyType.values.START  // “Start”
        }
      }
    ]
  }
};


  console.log("FULL_OBJ JSON:");
  console.log(JSON.stringify(FULL_OBJ, null, 2));

  const hexStr = encodeJsonToHex(FULL_OBJ, EventMessage);

  console.log("\n---------------------------");
  console.log(" FULL EventMessage HEX:");
  console.log("---------------------------");
  console.log(hexStr);
  console.log("---------------------------\n");

  const rawHex = hexStr.replace(/<Buffer |>/g, "").replace(/\s+/g, "");
  console.log(" RAW HEX (MQTT payload):");
  console.log(rawHex);
}

main().catch(console.error);

