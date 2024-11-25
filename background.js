console.log("Background script loaded for link tracking."); // Debug log

const destinationDir = "EmailAttachments";
const linkFile = `${destinationDir}/email_links.txt`;

// Listen for navigation events
chrome.webNavigation.onCommitted.addListener(async (details) => {
  console.log("Navigation detected:", details); // Debug log

  // Only process outermost frames and link transitions
  if (
    details.frameType !== "outermost_frame" ||
    details.transitionType !== "link"
  ) {
    console.log("Skipping non-link or subframe navigation."); // Debug log
    return;
  }

  // Get the current tab's URL
  chrome.tabs.get(details.tabId, (tab) => {
    if (chrome.runtime.lastError || !tab || !tab.url) {
      console.error(
        "Failed to retrieve current tab URL:",
        chrome.runtime.lastError
      );
      return;
    }

    const currentTabUrl = tab.url;
    console.log("Current page URL:", currentTabUrl); // Debug log

    // Check if the current page's URL contains "mail"
    if (currentTabUrl.includes("mail")) {
      console.log("Currently on a 'mail' page. Link clicked:", details.url); // Debug log

      // Save the clicked link to the file
      const blob = new Blob([details.url + "\n"], { type: "text/plain" });
      chrome.downloads.download(
        {
          url: URL.createObjectURL(blob),
          filename: linkFile,
          saveAs: false,
        },
        (downloadId) => {
          if (chrome.runtime.lastError) {
            console.error("Failed to save link:", chrome.runtime.lastError);
          } else {
            console.log("Link saved successfully to:", linkFile);
          }
        }
      );
    } else {
      console.log(
        "Current page URL does not contain 'mail'. Skipping:",
        details.url
      ); // Debug log
    }
  });
});
