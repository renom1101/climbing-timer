# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for updating your events.json file without needing to use GitHub or Firebase directly.

## Step 1: Create the Google Sheet

1. **Create a new Google Sheet**

   - Go to [sheets.google.com](https://sheets.google.com)
   - Click "Blank" to create a new sheet

2. **Set up the headers** (copy these exactly):

   ```
   A1: title
   B1: subtitle
   C1: date
   D1: location
   E1: image
   F1: button1_text
   G1: button1_link
   H1: button2_text
   I1: button2_link
   J1: button3_text
   K1: button3_link
   L1: expirationDate
   ```

3. **Import your current data**:
   - Download the `google-sheet-template.csv` file
   - In your Google Sheet, go to File > Import
   - Upload the CSV file
   - Choose "Replace current sheet"

## Step 2: Set up Google Apps Script

1. **Open Apps Script**:

   - In your Google Sheet, go to Extensions > Apps Script

2. **Replace the default code**:

   - Delete all existing code
   - Copy and paste the contents of `google-apps-script.js`

3. **Update the Firebase Function URL**:

   - In the `uploadToFirebase` function, make sure the URL is correct:

   ```javascript
   const firebaseFunctionUrl =
     "https://us-central1-climbing-timer-3f18c.cloudfunctions.net/updateEvents";
   ```

4. **Save the script**:
   - Click the save button (💾)
   - Give it a name like "Events Updater"

## Step 3: Test the Setup

1. **Run the test function**:

   - In Apps Script, select `testDataStructure` from the function dropdown
   - Click the "Run" button
   - Check the logs to see if your data is structured correctly

2. **Update events**:

   - In Apps Script, select `updateEvents` from the function dropdown
   - Click the "Run" button
   - You should see a success message with event counts

3. **Check the results**:
   - Visit: https://storage.googleapis.com/climbing-timer-3f18c.firebasestorage.app/events.json
   - Your events should be updated

## Step 4: Make it User-Friendly

After running the script once, you'll see a new menu in your Google Sheet:

1. **Refresh the sheet** (reload the page)
2. **Look for "Events" menu** in the top menu bar
3. **Click "Events" > "Update Events"** to update your events

## How to Use (For Non-Technical Users)

### Adding a New Event:

1. Add a new row to your Google Sheet
2. Fill in the columns:

   - **title**: Event name
   - **subtitle**: Event description
   - **date**: Event date (e.g., "2025.12.15")
   - **location**: Event location
   - **image**: Image URL
   - **button1_text**: First button text (optional)
   - **button1_link**: First button link (optional)
   - **button2_text**: Second button text (optional)
   - **button2_link**: Second button link (optional)
   - **button3_text**: Third button text (optional)
   - **button3_link**: Third button link (optional)
   - **expirationDate**: Event expiration date (YYYY-MM-DD format, e.g., "2025-12-31"). Events with expiration dates in the past will automatically appear in the past events list.

3. Click "Events" > "Update Events" in the menu

### Editing an Existing Event:

1. Find the event row in your sheet
2. Make your changes
3. Click "Events" > "Update Events" in the menu

### Deleting an Event:

1. Delete the entire row from your sheet
2. Click "Events" > "Update Events" in the menu

## Troubleshooting

### If you get an error:

1. Check the Apps Script logs (View > Execution log)
2. Make sure all required columns are filled
3. Verify the Firebase Function URL is correct
4. Ensure your Firebase project is on the Blaze plan

### If the menu doesn't appear:

1. Refresh the Google Sheet page
2. Make sure you saved the Apps Script
3. Try running the `onOpen` function manually

## Data Format Examples

### Current Event (Future Expiration):

```
title: "Jaunimo rinktinės treniruočių stovykla"
subtitle: "Pasiruošimas IFSC varžybų sezonui"
date: "2025.07.19-20"
location: "Kaunas"
image: "https://assets.zyrosite.com/..."
button1_text: "Aprašas"
button1_link: "https://drive.google.com/..."
button2_text: ""
button2_link: ""
button3_text: ""
button3_link: ""
expirationDate: "2025-07-20"
```

### Past Event (Expired):

```
title: "Lietuvos boulderingo čempionatas"
subtitle: "Trasos nuo 5a iki 8b"
date: "2025.02.07-08"
location: "Vilnius, Bonobo"
image: "https://assets.zyrosite.com/..."
button1_text: "Nuostatai"
button1_link: "https://drive.google.com/..."
button2_text: "Rezultatai"
button2_link: "https://climbalong.com/..."
button3_text: "Nuotraukos"
button3_link: "https://photos.google.com/..."
expirationDate: "2025-02-08"
```

## Benefits

✅ **No technical knowledge required** - Just edit a Google Sheet  
✅ **Real-time updates** - Changes appear immediately  
✅ **User-friendly interface** - Familiar spreadsheet format  
✅ **Collaboration** - Multiple people can edit simultaneously  
✅ **Version control** - Google Sheets has built-in history  
✅ **Backup** - Automatic Google backup

## Security Notes

- The Firebase Function URL is public but requires proper data format
- Only authorized users should have access to the Google Sheet
- Consider sharing the sheet with specific people only
