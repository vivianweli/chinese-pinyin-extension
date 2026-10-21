# Chrome Web Store Listing — Chinese Pinyin Helper

> Last Updated: 2026-10-21

## Store Listing

**Extension Name** [REQUIRED]
Chinese Pinyin Helper

**Short Description** [REQUIRED] (≤132 chars; matches manifest)
Select Chinese text on any web page to see its pinyin, then click to copy. Works offline with a built-in dictionary.

**Detailed Description** [REQUIRED]
```
Select Chinese text on any web page and instantly see its pinyin, then click to copy it.

FEATURES
Select a Chinese word or phrase and its pinyin appears right above your selection, with tone marks.
If the selection is a recognized vocabulary word, the pinyin is shown together for the whole word.
Select a single character to see its pronunciation. Characters with more than one reading show each reading in its own box.
Click any pinyin box to copy it to your clipboard.
Turn the extension on or off at any time from the toolbar popup.
Works offline: the dictionary is built in, so nothing is looked up online.

HOW TO USE
1. Open any web page with Chinese text.
2. Select a word, phrase, or single character with your mouse.
3. Read the pinyin that appears above your selection.
4. Click a pinyin box to copy it.

If you select a phrase that is not in the dictionary, no pinyin is shown for it. Select a single character or a shorter word instead.

PRIVACY
Chinese Pinyin Helper does not collect, store, or send any data. Text you select never leaves your browser. The only thing saved is your on/off setting. It runs on all websites so the pinyin box can appear wherever you select Chinese text.

DICTIONARY
Pinyin data comes from CC-CEDICT (cc-cedict.org), licensed under Creative Commons Attribution-ShareAlike.

SUPPORT
Questions or bugs: https://github.com/vivianweli/chinese-pinyin-extension/issues
```

**Category** [REQUIRED]
Productivity (alternative: Accessibility). Pick whichever fits the dashboard's current list.

**Single Purpose** [REQUIRED]
Shows the pinyin pronunciation of Chinese text the user selects on a web page and lets them copy it.

**Primary Language** [REQUIRED]
English

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | `icons/icon-128.png` |
| Screenshot 1 [REQUIRED] | 1280×800 or 640×400 | ⬜ Not created | |
| Screenshot 2 [RECOMMENDED] | 1280×800 or 640×400 | ⬜ Not created | |
| Screenshot 3 [RECOMMENDED] | 1280×800 or 640×400 | ⬜ Not created | |
| Small Promo Tile [RECOMMENDED] | 440×280 | ⬜ Not created | |

The screenshots in README.md are small crops and do not meet the size requirement. Capture new ones at 1280×800 (save them in `store-assets/`, which is excluded from the package).

### Screenshot Notes
1. A Chinese web page with a recognized word selected and its pinyin box showing above it.
2. A single character with multiple readings, showing several boxes.
3. The toolbar popup with the Enable toggle, or the "Copied!" confirmation after clicking a box.

## Permissions Justification

| Permission | Type | Justification |
|------------|------|---------------|
| `storage` | permissions | Saves a single on/off setting (whether pinyin display is enabled) so the choice persists between browser sessions. Nothing else is stored. |
| `<all_urls>` (content script match) | host_permissions | The pinyin box must appear wherever the user selects Chinese text, on any website. The content script only reacts to the user's own text selection, looks it up in a dictionary bundled with the extension, and shows a small box. It does not read other page content and sends nothing off the device. A narrower match list would make the extension fail on most sites. |

Note: the extension declares no `host_permissions` key; the `<all_urls>` pattern is in `content_scripts.matches`, which the store still treats as broad host access. Enter this justification in the "host permission" field if the dashboard asks.

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

| Data Type | Collected? | Transmitted Off-Device? | Purpose | Shared with Third Parties? |
|-----------|-----------|------------------------|---------|---------------------------|
| Personally identifiable info | No | No | | No |
| Health info | No | No | | No |
| Financial info | No | No | | No |
| Authentication info | No | No | | No |
| Personal communications | No | No | | No |
| Location | No | No | | No |
| Web history | No | No | | No |
| User activity | No | No | | No |
| Website content | No | No | The selected text is looked up locally and is not stored or sent | No |

Reasoning for "Website content: No": the dashboard counts data that is collected and kept or transmitted. Selected text is processed in memory on the device only. If you prefer to be conservative, you may answer Yes for "Website content", stating it is processed locally and never transmitted.

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

## Privacy Policy

**Privacy Policy URL** [REQUIRED]
Source: `docs/privacy.md`. It must be live at a public URL before submission. Easiest option: in the GitHub repo go to Settings → Pages, deploy from the default branch `/docs` folder, then use
`https://vivianweli.github.io/chinese-pinyin-extension/privacy` (verify it loads).

## Distribution

**Visibility**: Public
**Regions**: All regions

## Developer Info

**Publisher Name** [REQUIRED]
TODO: your name / publisher name

**Contact Email** [REQUIRED]
TODO: a monitored email (shown publicly; must be verified in the dashboard)

**Support URL** [RECOMMENDED]
https://github.com/vivianweli/chinese-pinyin-extension/issues

**Homepage URL** [RECOMMENDED]
https://github.com/vivianweli/chinese-pinyin-extension

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.0.0 | 2026-10-21 | Initial release: pinyin on selection, multi-reading boxes, click to copy, on/off toggle | Draft |

## Review Notes

### Known Issues / Limitations
- Runs on all websites (`<all_urls>`); expect reviewers to ask about it. Justification above.
- The ~5.5 MB dictionary is loaded only by the background service worker, when the user first selects Chinese text, and is not injected into web pages. Content scripts message the worker to look words up (internal messaging only, no network). The worker may be stopped by Chrome after a period of inactivity and will reload the dictionary on the next lookup.
- Dictionary license is CC BY-SA 3.0 everywhere (NOTICE, dictionary.js header, README, popup).
- No remote code, no obfuscation, no network requests.

### Rejection History
None yet.

## Submission Steps
1. Run `bash scripts/package.sh`, which creates `dist/chinese-pinyin-helper-v1.0.0.zip`.
2. Register at https://chrome.google.com/webstore/devconsole (one-time $5 developer fee).
3. Upload the ZIP, then fill in the listing, privacy tab and permission justifications from this file.
4. Test by loading unpacked once more, then submit for review.
