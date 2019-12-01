

export interface SingleLineVimBindings {

    position(): number // the index of the cursor

    a(): void // (insert) append after this cursor
    i(): void // (insert) at the current position
    A(): void // (insert) append to the end of the textbox
    I(): void // (insert) at the beginning of the line
    C(): void // (insert) change from here to the end of the line
    S(): void // (insert) substitute the whole line

    /*
    h(): void // (move) left 
    l(): void // (move) right
    b(): void // (move) back a word
    e(): void // (move) to the end of the word
    w(): void // (move) to the next character
    zero(): void // move to the beginning of the line
    underscore(): void // move to the beginning of the line's text
    dollar(): void // move to the end of the line

    f(): void // (move) to the next character
    F(): void // (move) to backwards to the next character
    t(): void // (move) the start of the next character
    T(): void // (move) forwards to the next character
    semicolon(): void // redo the last f/t search
    colon(): void // reverse search the last f/t

    d(): void // (movement sequence) delete the next 
    c(): void // (insert) (movement sequence) change the next 

    D(): void // delete from here to the end of the line
    x(): void // delete the character under the cursor

    R(): void // replace mode
    r(): void // (insert?) replace the next character
    tilde(): void // flip the case of the character under the cursor

    p(): void // paste the last deleted text
    u(): void // undo the last change
    */
}

export type SingleLineVimCallback = (isNormal: boolean, position: number, text: string) => any

export class SingleLineVimBuffer implements SingleLineVimBindings {
    
    private buffer: string;
    private index: number;
    private callback: SingleLineVimCallback;

    constructor(buffer: string, index: number, callback: SingleLineVimCallback) {
        this.buffer = buffer;
        this.index = index;
        this.callback = callback;
    }

    position = () => {
        return this.index;
    }

    a = () => {
        this.callback(false, this.index + 1, this.buffer);
    }

    i = () => {
        this.callback(false, this.index, this.buffer);
    }

    A = () => {
        this.callback(false, this.buffer.length, this.buffer);
    }

    I = () => {
        this.callback(false, 0, this.buffer);
    }

    C = () => {
        this.callback(false, this.index, this.buffer.substr(this.index));
    }

    S = () => {
        this.callback(false, 0, "");
    }

}