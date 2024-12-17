const user_id = inputData.user_id;
const api_token = inputData.api_token;

const apiUrl = `https://api.zoom.us/v2/users/${user_id}/recordings`;

async function fetchZoomRecordings() {
  try {
    // Make a GET request to the Zoom API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: api_token, 
      },
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Error fetching Zoom data: ' + response.statusText);
    }

    // Parse the response as JSON
    const data = await response.json();

    // Log the response (this is the zoomApiResponse you want)
    console.log('Zoom API Response:', data);

    return data;  // This is the zoomApiResponse value
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function to fetch Zoom recordings
fetchZoomRecordings().then((zoomApiResponse) => {
  output = {
    getCompletedVideoDownloadUrls: getCompletedVideoDownloadUrls(zoomApiResponse),
  };
}).catch((error) => {
  console.error('Error:', error);
  output = { error: error.message };
});


function getCompletedVideoDownloadUrls(zoomApiResponse) {
  const downloadUrls = []; // Initialize an array to store URLs

  // Loop through meetings in the response
  zoomApiResponse.meetings.forEach((meeting) => {
    // Loop through the recording files for each meeting
    meeting.recording_files.forEach((file) => {
      // Check for completed MP4 files
      if (file.file_type === "MP4" && file.status === "completed") {
        downloadUrls.push(file.download_url);
      }
    });
  });

  return downloadUrls; // Return the array of download URLs
}
