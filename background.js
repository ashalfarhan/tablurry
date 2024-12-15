// @ts-check
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF',
  });
});

chrome.action.onClicked.addListener(async tab => {
  if (!tab.id) return;
  // Prevent triggers from the browser extensions settings (e.g. chrome:// or brave://).
  if (tab.url && !tab.url.startsWith('http')) return;
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const { blurRadius = 10 } = await chrome.storage.local.get('blurRadius');
  const css = `body { filter: blur(${blurRadius}px) !important; }`;

  const nextState = prevState === 'ON' ? 'OFF' : 'ON';
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === 'ON') {
    await chrome.scripting.insertCSS({
      css,
      target: { tabId: tab.id },
    });
  } else if (nextState === 'OFF') {
    await chrome.scripting.removeCSS({
      css,
      target: { tabId: tab.id },
    });
  }
});
