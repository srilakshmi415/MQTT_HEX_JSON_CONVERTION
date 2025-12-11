//------------------------------------------------------------
// IMPORTS
//------------------------------------------------------------
const protobuf = require("protobufjs");

//------------------------------------------------------------
// DECODE FUNCTION (for <Buffer ...> string)
//------------------------------------------------------------
function decodeBufferString(bufferString, CommandMessage) {
  // Remove <Buffer ... >
  let hex = bufferString
    .replace("<Buffer", "")
    .replace(">", "")
    .trim()
    .replace(/\s+/g, ""); // remove all spaces

  // Convert hex → Buffer
  const buf = Buffer.from(hex, "hex");

  // Decode using protobuf
  const decoded = CommandMessage.decode(buf);

  // Convert to readable object
  const obj = CommandMessage.toObject(decoded, {
    longs: String,
    enums: String,
    bytes: String
  });

  return obj;
}

//------------------------------------------------------------
// MAIN CODE
//------------------------------------------------------------
async function main() {
  try {
    console.log(" Loading Protobuf...");

    // Load your proto files
    const root = await protobuf.load([
      "proto/jeep_command_message.proto",
       "proto/jeep_commandresponse_message.proto",
      "proto/jeep_common.proto",
      "proto/timestamp.proto",
      "proto/jeep_ota_command.proto"
    ]);

    // Lookup CommandMessage structure
    const CommandResponseMessage = root.lookupType(
      "stla.cvip.jeep.CommandResponseMessage"
    );

    console.log(" Protobuf Loaded");

    //--------------------------------------------------------
    // Example buffer string you want to decode
    //--------------------------------------------------------
    const bufferStr =
      "<Buffer 0a24 6464 3532 6261 6231 2d63 3634 612d 3433 3162 2d61 3934 352d 3136 3032 6632 3665 3966 3465 1224 3435 6565 3331 3334 2d38 6332 382d 3437 3335 2d62 3230 382d 6331 6738 6261 6535 3235 3334 1803 2001 2801 3001 3a05 312e 302e 3042 0c08 d4e0 9b8b 0610 e8d0 d59b 0252 061a 0408 0110 01>";

    // Decode it
    const decodedObj = decodeBufferString(bufferStr, CommandResponseMessage);

    console.log("\n---------------------------");
    console.log(" Decoded Protobuf Object:");
    console.log("---------------------------");
    console.log(decodedObj);
    console.log("---------------------------\n");
  } catch (err) {
    console.error(" ERROR:", err);
  }
}

main();
