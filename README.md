# Chinese Pinyin Helper Chrome Extension

Select Chinese text on any web page and instantly see its pinyin. Click the pinyin to copy it.

## Installation

1. Download this code as a zip, then unzip it somewhere on your machine.
2. Open Chrome and go to `chrome://extensions/`.
3. Turn on **Developer mode** in the top right corner.
4. Click **Load unpacked**.
5. Select the `chinese-pinyin-extension` folder you just unzipped, and enjoy!

## Features

### 1. Enable / Disable

Turn the extension on or off from the popup.

<p align="center">
  <img width="283" height="235" alt="Enable and disable the extension" src="https://github.com/user-attachments/assets/2fca1aa4-cae7-4f6e-8d17-2a3618f2da9b" />
</p>

### 2. Select text to see pinyin

Select Chinese text and the pinyin appears. If the selection is a recognized vocabulary word, the pinyin is shown together. If it isn't a recognized word, nothing is shown for the whole selection.

<table align="center">
  <tr>
    <th align="center">Recognized word</th>
    <th align="center">Not a word</th>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <img width="108" height="101" alt="Pinyin for a recognized word" src="https://github.com/user-attachments/assets/ae1f47f2-5359-449b-ab9d-60d4ee834b74" />
    </td>
    <td align="center" valign="middle">
      <img width="89" height="90" alt="No pinyin for an unrecognized word" src="https://github.com/user-attachments/assets/45be8424-8aad-4bf4-a13b-0ebbb1b343f7" />
    </td>
  </tr>
</table>

### 3. Individual characters

You can still view the pinyin of individual characters. If a character has multiple sounds, each one is shown as a separate box you can copy.

<table align="center">
  <tr>
    <th align="center">Character with multiple sounds</th>
    <th align="center">Vocabulary with multiple sounds</th>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <img width="154" height="101" alt="Single character with one pinyin" src="https://github.com/user-attachments/assets/f2c9f164-78c9-4b62-a049-245a0b98ea7f" />
    </td>
    <td align="center" valign="middle">
      <img width="264" height="94" alt="Single character with multiple pinyin" src="https://github.com/user-attachments/assets/eb024f87-711a-41dc-8f10-5f7df7677197" />
    </td>
  </tr>
</table>

### 4. Click to copy

Click any pinyin box to copy it to your clipboard.

<table align="center">
  <tr>
    <th align="center">Select</th>
    <th align="center">Copied</th>
  </tr>
  <tr>
    <td align="center" valign="middle">
      <img width="143" height="90" alt="Click the pinyin to copy" src="https://github.com/user-attachments/assets/8492998e-a1f8-4214-ad31-2080e2f7cb92" />
    </td>
    <td align="center" valign="middle">
      <img width="114" height="102" alt="Pinyin copied confirmation" src="https://github.com/user-attachments/assets/144b093b-4830-4b4f-81db-d88ccd996362" />
    </td>
  </tr>
</table>

## Attribution

- The dictionary used is from [CC-CEDICT](https://cc-cedict.org/wiki/), licensed under a [Creative Commons Attribution-Share Alike 3.0 License](https://creativecommons.org/licenses/by-sa/3.0/).
- Built using Cursor and ChatGPT.
