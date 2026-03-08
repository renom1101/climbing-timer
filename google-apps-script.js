/**
 * Google Apps Script to update events.json from Google Sheets
 *
 * Instructions:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Replace the default code with this script
 * 4. Save and run the updateEvents function
 */

function updateEvents() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const events = [];

  // Start from row 2 (skip headers)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[0]) {
      // Check if title exists
      const event = {
        title: row[0],
        subtitle: row[1] || "",
        date: row[2] || "",
        location: row[3] || "",
        image: row[4] || "",
        buttons: [],
        expirationDate: row[11] || "",
      };

      // Add buttons if they exist
      if (row[5] && row[6]) {
        event.buttons.push({
          text: row[5],
          link: row[6],
        });
      }
      if (row[7] && row[8]) {
        event.buttons.push({
          text: row[7],
          link: row[8],
        });
      }
      if (row[9] && row[10]) {
        event.buttons.push({
          text: row[9],
          link: row[10],
        });
      }

      events.push(event);
    }
  }

  const jsonData = {
    events: events,
  };

  // Upload to Firebase Function
  uploadToFirebase(jsonData);
}

function uploadToFirebase(jsonData) {
  // Replace with your actual Firebase Function URL
  const firebaseFunctionUrl =
    "https://us-central1-climbing-timer-3f18c.cloudfunctions.net/updateEvents";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    payload: JSON.stringify(jsonData),
  };

  try {
    const response = UrlFetchApp.fetch(firebaseFunctionUrl, options);
    const responseData = JSON.parse(response.getContentText());

    if (responseData.success) {
      console.log("✅ Events updated successfully!");
      console.log(`📊 Total events: ${responseData.eventsCount}`);

      // Show success message
      SpreadsheetApp.getUi().alert(
        "Success!",
        `Events updated successfully!\n\nTotal events: ${responseData.eventsCount}`,
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    } else {
      throw new Error(responseData.error || "Unknown error");
    }
  } catch (error) {
    console.error("❌ Upload failed:", error);

    // Show error message
    SpreadsheetApp.getUi().alert(
      "Error",
      `Failed to update events: ${error.toString()}`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

/**
 * Create a menu item to easily run the update
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("Events").addItem("Update Events", "updateEvents").addToUi();
}

/**
 * Test function to validate the data structure
 */
function testDataStructure() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();

  console.log("Headers:", data[0]);
  console.log("Total rows:", data.length);

  // Show sample of first few rows
  for (let i = 1; i < Math.min(4, data.length); i++) {
    console.log(`Row ${i}:`, data[i]);
  }
}
