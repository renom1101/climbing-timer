/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({maxInstances: 5}, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({maxInstances: 10}) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Types for events data
interface EventButton {
  text: string;
  link: string;
}

interface Event {
  title: string;
  subtitle: string;
  date: string;
  location: string;
  image: string;
  buttons: EventButton[];
  expirationDate: string;
}

interface EventsData {
  events: Event[];
}

// Function to update events.json file
export const updateEvents = onRequest(async (request, response) => {
  // Enable CORS
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  // Only allow POST requests
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  try {
    const { events } = request.body as EventsData;

    // Validate the data
    if (!Array.isArray(events)) {
      response.status(400).json({
        error: "Invalid data format. Expected events and pastEvents arrays.",
      });
      return;
    }

    // Create the JSON data structure
    const jsonData: EventsData = {
      events: events || [],
    };

    // Convert to JSON string with proper formatting
    const jsonString = JSON.stringify(jsonData, null, 2);

    // Get Firebase Storage bucket
    const bucket = admin.storage().bucket();
    const file = bucket.file("events.json");

    // Upload the JSON file to Firebase Storage
    await file.save(jsonString, {
      metadata: {
        contentType: "application/json",
        cacheControl: "no-cache, no-store, must-revalidate",
      },
    });

    // Make the file publicly accessible
    await file.makePublic();

    logger.info("Events updated successfully", {
      eventsCount: events.length,
      storagePath: file.name,
    });

    response.status(200).json({
      success: true,
      message: "Events updated successfully",
      eventsCount: events.length,
    });
  } catch (error) {
    logger.error("Error updating events:", error);
    response.status(500).json({
      error: "Failed to update events",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
