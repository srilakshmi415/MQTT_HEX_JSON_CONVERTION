
const protobuf = require("protobufjs");

function encodeJsonToHex(jsonObj, MessageType) {
  const errMsg = MessageType.verify(jsonObj);
  if (errMsg) throw new Error("Invalid payload: " + errMsg);

  const msg = MessageType.create(jsonObj);
  console.log("Encoded CanDataMessage (internal):");
  console.log(JSON.stringify(msg, null, 2));

  const buf = MessageType.encode(msg).finish();
  const hex = Buffer.from(buf).toString("hex");
  return "<Buffer " + hex.match(/.{1,4}/g).join(" ") + ">";
}

async function main() {
  console.log("Loading CVIP CAN Data Protobufs...");

  const root = await protobuf.load([
    "proto_new/jeep_candata_message.proto",  // CanDataMessage
    "proto_new/jeep_candata.proto",         // CanData, CanDataPacket, CData
    "proto_new/jeep_common.proto",
    "proto_new/timestamp.proto"
  ]);

  const CanDataMessage = root.lookupType("stla.cvip.jeep.CANDataMessage");
  const eTboxApplicationState = root.lookupEnum("stla.cvip.jeep.eTboxApplicationState");
  const eTboxeSimState = root.lookupEnum("stla.cvip.jeep.eTboxeSimState");

  const FULL_OBJ = {
    messageId: "dd52bab1-c64a-431b-a945-1602f26e9f4e",
    eTboxApplicationState: eTboxApplicationState.values.customer,
    tboxEsimState: eTboxeSimState.values.normal_sim,
    version: "1.0.0",
    timeStamp: { seconds: 1765974352, nanos: 268381000 },

    canDataPayload: {
      canData: {
        canDataPacket: [
          {
            identifier: 356,
            dlc: 8,
            cData: [
              {
                pdu: Buffer.from([0x53, 0x00, 0x00, 0x02, 0x02, 0x20, 0x00, 0x00]),
                timestamp: { seconds: 1765974352, nanos: 267869000 }
              },
              {
                pdu: Buffer.from([0x43, 0x00, 0x00, 0x02, 0x02, 0x20, 0x00, 0x00]),
                timestamp: { seconds: 1765974352, nanos: 267869000 }
              },
              {
                pdu: Buffer.from([0x23, 0x00, 0x00, 0x02, 0x02, 0x20, 0x00, 0x00]),
                timestamp: { seconds: 1765974352, nanos: 267869000 }
              }
            ]
          }
        ]
      }
    }
  };

  console.log("FULL_OBJ JSON:");
  console.log(JSON.stringify(FULL_OBJ, null, 2));

  const hexStr = encodeJsonToHex(FULL_OBJ, CanDataMessage);

  console.log("\n---------------------------");
  console.log("FULL CanDataMessage HEX:");
  console.log("---------------------------");
  console.log(hexStr);
  console.log("---------------------------\n");

  const rawHex = hexStr.replace(/<Buffer |>/g, "").replace(/\s+/g, "");
  console.log("RAW HEX (MQTT payload):");
  console.log(rawHex);
}

main().catch(console.error);
