const enableToggle = document.getElementById("enableToggle");

// Load the saved setting.
chrome.storage.local.get("enabled", (result) => {
  // Enabled by default if no setting has been saved.
  enableToggle.checked = result.enabled !== false;
});

// Save the setting whenever the toggle changes.
enableToggle.addEventListener("change", () => {
  chrome.storage.local.set({
    enabled: enableToggle.checked
  });
});
