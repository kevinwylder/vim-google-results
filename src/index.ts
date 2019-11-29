
function findSearchResults() : HTMLAnchorElement[] {
    let results: HTMLAnchorElement[] = [];
    for (let elem of document.getElementsByClassName("r")) {
        let link = elem.getElementsByTagName("a");
        if (link.length == 0) {
            continue
        }
        results.push(link[0]);
    }
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

document.addEventListener("keypress", function(this: Document, event: KeyboardEvent) {
    switch (event.key) {
        case "j":
        case "k":
            console.log("key")
            event.preventDefault();
    }
});