let extensionEnabled = true;

chrome.storage.local.get(["enabled"], (result) => {
  extensionEnabled = result.enabled !== false;
});

let pinyinBox = null;
let currentPinyin = null;
let isCopying = false;

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
  setTimeout(() => {
    if (isCopying) return;

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

    const pinyin = getPinyin(text);

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

function getPinyin(text) {
  const result = PINYIN_DICTIONARY[text];

  if (!result) {
    return null;
  }

  // Multiple pronunciations
  if (Array.isArray(result)) {
    return result.join(" / ");
  }

  return result;
}



function showPinyin(pinyin, selection) {
  removePinyinBox();

  currentPinyin = pinyin;

  const box = document.createElement("div");
  pinyinBox = box;

  box.textContent = pinyin;

  Object.assign(box.style, {
    position: "fixed",
    zIndex: "2147483647",
    background: "#ffffff",
    color: "#111111",
    padding: "8px 12px",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    fontSize: "18px",
    fontFamily: "Arial, sans-serif",
    border: "1px solid #dddddd",
    cursor: "pointer",
    userSelect: "none"
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

  document.body.appendChild(box);

  positionPinyinBox(selection);
}

async function copyPinyin(pinyin, box) {
  isCopying = true;

  const success = await copyToClipboard(pinyin);

  // Make sure the popup still exists.
  if (pinyinBox !== box) {
    isCopying = false;
    return;
  }

  if (success) {
    box.textContent = "Copied!";
    box.style.color = "#16a34a";

    setTimeout(() => {
      if (pinyinBox === box) {
        box.textContent = pinyin;
        box.style.color = "#111111";
      }

      isCopying = false;
    }, 1200);
  } else {
    box.textContent = "Copy failed";
    box.style.color = "#dc2626";

    setTimeout(() => {
      if (pinyinBox === box) {
        box.textContent = pinyin;
        box.style.color = "#111111";
      }

      isCopying = false;
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
  if (pinyinBox && !isCopying) {
    pinyinBox.remove();
    pinyinBox = null;
    currentPinyin = null;
  }
}
