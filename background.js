browser.runtime.onInstalled.addListener(function () {
  const topMenu = browser.contextMenus.create({
    contexts: ["all"],
    title: "&Hammertools Menu",
    "id": "topMenu",
  });
  browser.contextMenus.create({
    parentId: topMenu,
    title: "Expose completely inaccessible elements",
    "id": "expose",
    contexts: ["all"],
    //onclick: exposeCompletelyInaccessibleElements,
  });
  browser.contextMenus.create({
    parentId: topMenu,
    title: "Kill all aria-&hidden",
    "id": "killariahidden",
    contexts: ["all"],
    //onclick: killAllAriaHidden,
  });
  browser.contextMenus.create({
    parentId: topMenu,
    title: "Kill all ARIA &live regions",
    "id": "killlive",
    contexts: ["all"],
    //onclick: killAllAriaLive,
  });
  browser.contextMenus.create({
    parentId: topMenu,
    title: "Kill all ARIA &applications",
    "id": "fixapplication",
    contexts: ["all"],
    //onclick: killAllAriaApplication,
  });
  browser.contextMenus.create({
    parentId: topMenu,
    title: "No idea, do all the things",
    "id": "runall",
    contexts: ["all"],
    //onclick: runAll,
  });
});
browser.contextMenus.onClicked.addListener(function (info, tab) {
  let id = info.menuItemId
  if (id == "expose") exposeCompletelyInaccessibleElements(info, tab)
  if (id == "killariahidden") killAllAriaHidden(info, tab)
  if (id == "killlive") killAllAriaLive(info, tab)
  if (id == "fixapplication") killAllAriaApplication(info, tab)
  if (id == "runall") runAll(info, tab)
});

//code
function exposeCompletelyInaccessibleElements(info, tab) {
  browser.tabs.executeScript(tab.id, {
    allFrames: true,
    code: `
      for (let el of document.body.querySelectorAll(":empty:not(input):not(textarea):not([aria-label])")) {
        el.setAttribute("role", "button");
        let label = typeof el.className == "string" ? el.className : null;
        if (label) {
          // Strip out useless Font Awesome stuff:
          // fa- prefixes, but keep the rest (fa-foo becomes just foo); and
          // far and fas classes.
          label = label.replace(/\\bfa-|\\bfa[rs]?\\b/g, "");
        }
        if (label) {
          el.setAttribute("aria-label", label);
        }
        el.setAttribute("data-axSHammer-exposedCompletelyInaccessibleElement",
          "true");
      }
    `,
  });
}

function killAllAriaHidden(info, tab) {
  browser.tabs.executeScript(tab.id, {
    allFrames: true,
    code: `
      for (let el of document.querySelectorAll("[aria-hidden]")) {
        el.removeAttribute("aria-hidden");
      }
    `,
  });
}

function killAllAriaLive(info, tab) {
  browser.tabs.executeScript(tab.id, {
    allFrames: true,
    code: `
      for (let el of document.querySelectorAll("[aria-live]")) {
        el.removeAttribute("aria-live");
      }
    `,
  });
}

function killAllAriaApplication(info, tab) {
  browser.tabs.executeScript(tab.id, {
    allFrames: true,
    code: `
      for (let el of document.querySelectorAll("[role=application]")) {
        el.removeAttribute("role");
      }
    `,
  });
}

function runAll(info, tab) {
  exposeCompletelyInaccessibleElements(info, tab);
  killAllAriaHidden(info, tab);
  killAllAriaLive(info, tab);
  killAllAriaApplication(info, tab);
}
