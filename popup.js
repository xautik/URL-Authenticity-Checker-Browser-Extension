document.getElementById('checkUrl').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: checkURL
    }, (results) => {
      if (results && results[0] && results[0].result) {
        const resultText = results[0].result.valid ? 'genuine' : `not genuine: ${results[0].result.reason}`;
        document.getElementById('result').innerText = `URL is ${resultText}.`;
      } else {
        document.getElementById('result').innerText = 'Error checking URL.';
      }
    });
  });
});

function checkURL() {
  const url = window.location.href;
  function isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }

  function hasFakeUnicodeCharacters(hostname) {
    const unicodeRegex = /[\u{0080}-\u{FFFF}]/u;
    return unicodeRegex.test(hostname);
  }

  function isGenuineURL(url) {
    if (!isValidURL(url)) {
      return { valid: false, reason: 'Invalid URL format.' };
    }

    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    if (hasFakeUnicodeCharacters(hostname)) {
      return { valid: false, reason: 'Hostname contains fake Unicode characters.' };
    }

    // Example TLD validation
    const tld = hostname.split('.').pop();
    const knownTlds = ['com', 'net', 'org', 'edu', 'gov', 'co', 'io']; // Add more valid TLDs as needed
    if (!knownTlds.includes(tld)) {
      return { valid: false, reason: 'Unrecognized or suspicious TLD.' };
    }

    return { valid: true, reason: '' };
  }

  return isGenuineURL(url);
}
