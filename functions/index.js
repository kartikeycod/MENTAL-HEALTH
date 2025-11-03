// functions/index.js

const functions = require("firebase-functions");

const HUME_WEBSOCKET_BASE_URL = "wss://api.hume.ai/v0/stream/models";

exports.getHumeWebSocketUrl = functions.https.onCall(async (data, context) =>{
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "Authentication is required to start the mood detection session.",
    );
  }
  const HUME_API_KEY = functions.config().hume.api_key;
  if (!HUME_API_KEY) {
    throw new functions.https.HttpsError(
        "internal",
        "Hume API key not configured. Contact site administrator.",
    );
  }
  const fullWebSocketUrl = `${HUME_WEBSOCKET_BASE_URL}?apikey=${HUME_API_KEY}`;

  return {
    url: fullWebSocketUrl,
    message: "Hume AI WebSocket URL successfully generated.",
  };
});
