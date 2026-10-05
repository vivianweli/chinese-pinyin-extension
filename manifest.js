{
  "manifest_version": 3,
  "name": "Chinese Pinyin Helper",
  "version": "1.0.0",
  "description": "Shows Pinyin when Chinese text is highlighted.",
  "permissions": [
    "storage"
  ],
  "action": {
    "default_popup": "popup.html"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ]
}
