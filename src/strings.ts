
export function reverse(text: string): string {
    if (text.length == 0) {
        return "";
    }
    return text[text.length - 1] + reverse(text.substr(0, text.length - 1));
}

export function findNextWord(text: string): number {
    let idx = text.search(/\s+\S/);
    if (idx == -1) {
        return text.length;
    }
    return idx + text.substr(idx).search(/\S/);
}

export function findNextSpace(text: string): number {
    let idx = text.search(/\s/);
    if (idx == -1) {
        return text.length;
    }
    return idx;
}