import { Sidebar } from "./sidebar";

function findSearchResults() : HTMLAnchorElement[] {
    let rows = document.querySelectorAll(".g");
    if (!rows) {
        return [];
    }
    let results: HTMLAnchorElement[] = [];
    let blacklist: Element[] = [];
    rows.forEach((elem) => {
        let hasAccordian = elem.querySelector("g-accordion-expander");
        if (hasAccordian) {
            blacklist.push(elem);
            return;
        }
        for (let blacklisted of blacklist) {
            if (blacklisted.contains(elem)) {
                return;
            };
        }
        let link = elem.querySelector("a")
        if (!link) {
            return;
        }
        results.push(link);
    });
    return results;
}

function findSearchBox() : HTMLElement {
    for (let elem of document.getElementsByTagName("input")) {
        if (elem.getAttribute("type") === "text") {
            return elem;
        }
    }
    throw new Error("Could not find the search box");
}

let results = findSearchResults();
let searchBox = findSearchBox();
let sidebar = new Sidebar(results);

document.addEventListener("keypress", function(this: Document, event: KeyboardEvent) {
    switch (event.key) {
        case "j":
            sidebar.down();
            event.preventDefault();
            break;
        case "k":
            sidebar.up();
            event.preventDefault();
            break;
        case "Enter":
            sidebar.select()
            event.preventDefault();
            break;
    }
});