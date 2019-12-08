
export function reverse(text: string): string {
    if (text.length == 0) {
        return "";
    }
    return text[text.length - 1] + reverse(text.substr(0, text.length - 1));
}

const WORD_REGEX = /[a-zA-Z0-9]+|[`~!@#$%^&*()_\-=+\\|[\]{};:'",.<>\/?]+/;
export function findWords(text: string): {length: number, offset: number}[] {
    // as of 2019, there is no matchAll available
    let result: {length: number, offset: number}[] = [];
    let word = WORD_REGEX.exec(text);
    let offset = 0;
    while (word) {
        let { index } = word;
        let length = word[0].length;

        offset += index;
        result.push({ length, offset });
        offset += length;
        word = WORD_REGEX.exec(text.substr(offset));
    }
    return result;
}


const LOWERCASE = /[a-z]/
const UPPERCASE = /[A-Z]/
export function swapCase(input: string): string {
    if (UPPERCASE.test(input)) {
        return input.toLowerCase();
    }
    if (LOWERCASE.test(input)) {
        return input.toUpperCase();
    }
    return input;
} 