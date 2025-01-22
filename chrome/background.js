chrome.runtime.onInstalled.addListener(() => {
  const topMenu = chrome.contextMenus.create({
    contexts: ["all"],
    title: "&Hammertools Menu",
    "id": "topMenu",
  });

  const menuItems = [
    { id: "expose", title: "Expose completely inaccessible elements" },
    { id: "killariaLabel", title: "Kill all aria-la&bel" },
    { id: "killariaRole", title: "Kill all ARIA &roles" },
    { id: "killariahidden", title: "Kill all aria-&hidden" },
    { id: "killlive", title: "Kill all ARIA &live regions" },
    { id: "fixapplication", title: "Kill all ARIA &applications" },
    { id: "runall", title: "No idea, do all the things" }
  ];

  for (const item of menuItems) {
    chrome.contextMenus.create({
      parentId: topMenu,
      contexts: ["all"],
      "id": item.id,
      "title": item.title,
    });
  }
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log(info,tab)
  const actionMap = {
    "expose": exposeCompletelyInaccessibleElements,
    "killariahidden": killAllAriaHidden,
    "killlive": killAllAriaLive,
    "fixapplication": killAllAriaApplication,
    "killariaLabel": killAllAriaLabel,
    "killariaRole": killAllAriaRole,
    "runall": runAll
  };

  const action = actionMap[info.menuItemId];
  if (action && tab.id !== undefined) {
    action(tab.id);
  }
});

function executeScriptOnPage(tabId, code) {
  chrome.scripting.executeScript({
    target: { tabId: tabId, allFrames: true },
    func: code
  });
}

function exposeCompletelyInaccessibleElements(tabId) {
  executeScriptOnPage(tabId, () => {
    for (let el of document.body.querySelectorAll(":empty:not(input):not(textarea):not([aria-label])")) {
      el.setAttribute("role", "button");
      let label = typeof el.className === "string" ? el.className : null;
      if (label) {
        label = label.replace(/\bfa-|\bfa[rs]?\b/g, "");
      }
      if (label) {
        el.setAttribute("aria-label", label);
      }
      el.setAttribute("data-axSHammer-exposedCompletelyInaccessibleElement", "true");
    }
  });
}

function killAllAriaHidden(tabId) {
  executeScriptOnPage(tabId, () => {
    for (let el of document.querySelectorAll("[aria-hidden]")) {
      el.removeAttribute("aria-hidden");
    }
  });
}

function killAllAriaLabel(tabId) {
  executeScriptOnPage(tabId, () => {
    for (let el of document.querySelectorAll("[aria-label]")) {
      el.removeAttribute("aria-label");
    }
  });
}

function killAllAriaRole(tabId) {
  executeScriptOnPage(tabId, () => {
    for (let el of document.querySelectorAll("[role]")) {
      el.removeAttribute("role");
    }
  });
}

function killAllAriaLive(tabId) {
  executeScriptOnPage(tabId, () => {
    for (let el of document.querySelectorAll("[aria-live]")) {
      el.removeAttribute("aria-live");
    }
  });
}

function killAllAriaApplication(tabId) {
  executeScriptOnPage(tabId, () => {
    for (let el of document.querySelectorAll("[role=application]")) {
      el.removeAttribute("role");
    }
  });
}

function runAll(tabId) {
  exposeCompletelyInaccessibleElements(tabId);
  killAllAriaHidden(tabId);
  killAllAriaLive(tabId);
  killAllAriaApplication(tabId);
  killAllAriaLabel(tabId);
  killAllAriaRole(tabId);
}