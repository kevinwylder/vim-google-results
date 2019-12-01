import { vimSearchController } from './controller';

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

function findSearchBox() : HTMLInputElement {
    let elem = document.querySelector('input[type="text"]');
    if (!elem) {
        throw new Error("Could not find the search box");
    }
    return elem as HTMLInputElement;
}

let results = findSearchResults();
let searchBox = findSearchBox();
vimSearchController(searchBox, results);