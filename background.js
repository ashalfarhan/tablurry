chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF',
  });
});

chrome.action.onClicked.addListener(async tab => {
  const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
  const { blurRadius } = await chrome.storage.local.get('blurRadius');
  const css = `body { filter: blur(${blurRadius}px); }`;
  const nextState = prevState === 'ON' ? 'OFF' : 'ON';
  console.log({ prevState, nextState });
  await chrome.action.setBadgeText({
    tabId: tab.id,
    text: nextState,
  });

  if (nextState === 'ON') {
    console.log('Start injecting CSS');
    await chrome.scripting.insertCSS({
      css,
      target: { tabId: tab.id },
    });
    console.log('Done injecting CSS');
  } else if (nextState === 'OFF') {
    console.log('Start remove CSS');
    await chrome.scripting.removeCSS({
      css,
      target: { tabId: tab.id },
    });
    console.log('Done remove CSS');
  }
});
