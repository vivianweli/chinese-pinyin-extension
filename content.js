let extensionEnabled = true;

chrome.storage.local.get(["enabled"], (result) => {
  extensionEnabled = result.enabled !== false;
});

let pinyinBox = null;
let copyCount = 0;

document.addEventListener("mouseup", () => {
  if (!extensionEnabled) {
    return;
  }

  handleSelection();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    extensionEnabled = changes.enabled.newValue;

    if (!extensionEnabled) {
      removePinyinBox();
    }
  }
});

  
function handleSelection() {
  // Give the browser time to finish updating the selection.
  setTimeout(async () => {
    if (copyCount > 0) return;

    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (!text) {
      removePinyinBox();
      return;
    }

    if (!containsChinese(text)) {
      removePinyinBox();
      return;
    }

    const pinyin = await getPinyin(text);

    // The selection may have changed while the dictionary lookup was running.
    if (copyCount > 0 || selection.toString().trim() !== text) return;

    if (!pinyin) {
      removePinyinBox();
      return;
    }

    showPinyin(pinyin, selection);
  }, 50);
}

function containsChinese(text) {
  return /[\u3400-\u4DBF\u4E00-\u9FFF]/.test(text);
}

const TONE_MARKS = {
  a: ["ā", "á", "ǎ", "à"],
  e: ["ē", "é", "ě", "è"],
  i: ["ī", "í", "ǐ", "ì"],
  o: ["ō", "ó", "ǒ", "ò"],
  u: ["ū", "ú", "ǔ", "ù"],
  // Combining marks keep the tone sitting on top of ü.
  ü: ["ü\u0304", "ü\u0301", "ü\u030C", "ü\u0300"]
};

function numberedToTone(syllable) {
  const match = syllable.toLowerCase().match(/^([a-züv:]+)([0-5])$/);

  if (!match) {
    return syllable;
  }

  let letters = match[1].replaceAll("u:", "ü").replaceAll("v", "ü");
  const tone = Number(match[2]);

  if (tone === 5) {
    return letters;
  }

  let vowelIndex = -1;

  for (const vowel of ["a", "e"]) {
    vowelIndex = letters.indexOf(vowel);
    if (vowelIndex !== -1) {
      break;
    }
  }

  if (vowelIndex === -1 && letters.includes("ou")) {
    vowelIndex = letters.indexOf("o");
  }

  if (vowelIndex === -1) {
    for (let i = letters.length - 1; i >= 0; i -= 1) {
      if ("aeiouü".includes(letters[i])) {
        vowelIndex = i;
        break;
      }
    }
  }

  if (vowelIndex === -1) {
    return syllable;
  }

  const vowel = letters[vowelIndex];

  if (!TONE_MARKS[vowel]) {
    return syllable;
  }

  return (
    letters.slice(0, vowelIndex) +
    TONE_MARKS[vowel][tone - 1] +
    letters.slice(vowelIndex + 1)
  );
}

function convertPinyin(pinyin) {
  return pinyin
    .split(/\s+/)
    .map(numberedToTone)
    .join(" ")
    .replaceAll("ǖ", "ü\u0304")
    .replaceAll("ǘ", "ü\u0301")
    .replaceAll("ǚ", "ü\u030C")
    .replaceAll("ǜ", "ü\u0300");
}

async function getPinyin(text) {
  let result;

  try {
    // The dictionary is loaded once in the background service worker.
    ({ pronunciations: result } = await chrome.runtime.sendMessage({
      type: "lookup",
      text
    }));
  } catch (error) {
    // E.g. the extension was reloaded while this page was open.
    return null;
  }

  if (!result) {
    return null;
  }

  const pronunciations = Array.isArray(result) ? result : [result];
  const unique = [...new Set(
    pronunciations
      .filter(Boolean)
      .map(convertPinyin)
  )];

  return unique.length ? unique : null;
}

function showPinyin(pronunciations, selection) {
  removePinyinBox();

  const container = document.createElement("div");
  pinyinBox = container;

  Object.assign(container.style, {
    position: "fixed",
    zIndex: "2147483647",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    alignItems: "center",
    maxWidth: "calc(100vw - 10px)"
  });

  pronunciations.forEach((pinyin) => {
    container.appendChild(createPinyinChip(pinyin));
  });

  document.body.appendChild(container);
  positionPinyinBox(selection);
}

function createPinyinChip(pinyin) {
  const box = document.createElement("div");

  box.textContent = pinyin;

  Object.assign(box.style, {
    background: "#ffffff",
    color: "#111111",
    padding: "8px 12px",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    fontSize: "18px",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #dddddd",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap"
  });

  box.title = "Click to copy";

  // Don't let clicking the popup destroy the selection.
  box.addEventListener("mousedown", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });

  box.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    copyPinyin(pinyin, box);
  });

  return box;
}

async function copyPinyin(pinyin, box) {
  copyCount += 1;

  const success = await copyToClipboard(pinyin);

  if (!pinyinBox || !pinyinBox.contains(box)) {
    copyCount = Math.max(0, copyCount - 1);
    return;
  }

  if (success) {
    box.textContent = "Copied!";
    box.style.color = "#16a34a";

    setTimeout(() => {
      if (pinyinBox && pinyinBox.contains(box)) {
        box.textContent = pinyin;
        box.style.color = "#111111";
      }

      copyCount = Math.max(0, copyCount - 1);
    }, 1200);
  } else {
    box.textContent = "Copy failed";
    box.style.color = "#dc2626";

    setTimeout(() => {
      if (pinyinBox && pinyinBox.contains(box)) {
        box.textContent = pinyin;
        box.style.color = "#111111";
      }

      copyCount = Math.max(0, copyCount - 1);
    }, 1500);
  }
}

async function copyToClipboard(text) {
  // Try the modern Clipboard API.
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    console.log("Clipboard API failed.");
  }

  // Fallback.
  try {
    const textarea = document.createElement("textarea");

    textarea.value = text;
    textarea.setAttribute("readonly", "");

    Object.assign(textarea.style, {
      position: "fixed",
      left: "-9999px",
      top: "0",
      opacity: "0"
    });

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    const success = document.execCommand("copy");

    textarea.remove();

    return success;
  } catch (error) {
    console.error("Copy failed:", error);
    return false;
  }
}

function positionPinyinBox(selection) {
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const boxRect = pinyinBox.getBoundingClientRect();

  let left = rect.left + rect.width / 2 - boxRect.width / 2;
  let top = rect.top - boxRect.height - 10;

  if (left < 5) {
    left = 5;
  }

  if (left + boxRect.width > window.innerWidth - 5) {
    left = window.innerWidth - boxRect.width - 5;
  }

  if (top < 5) {
    top = rect.bottom + 10;
  }

  pinyinBox.style.left = `${left}px`;
  pinyinBox.style.top = `${top}px`;
}

function removePinyinBox() {
  if (pinyinBox && copyCount === 0) {
    pinyinBox.remove();
    pinyinBox = null;
  }
}
