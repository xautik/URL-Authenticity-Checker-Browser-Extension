function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

function hasFakeUnicodeCharacters(hostname) {
  // Regular expression to detect non-ASCII characters (potentially fake)
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

  // Example TLD validation: Ensure TLD is valid and not suspicious
  const tld = hostname.split('.').pop();
  const knownTlds = ['com', 'net', 'org', 'edu', 'gov', 'co', 'io']; // Add more valid TLDs as needed
  if (!knownTlds.includes(tld)) {
    return { valid: false, reason: 'Unrecognized or suspicious TLD.' };
  }

  return { valid: true, reason: '' };
}

function checkURL() {
  const url = window.location.href;
  const result = isGenuineURL(url);
  if (result.valid) {
    alert(`URL ${url} is genuine.`);
  } else {
    alert(`URL ${url} is not genuine: ${result.reason}`);
  }
}

checkURL();
