import { reverse, findWords } from './strings';

export interface SingleLineVimBindings {
    Escape: VimKeyFunction

    a: VimKeyFunction // (insert) append after this cursor
    i: VimKeyFunction // (insert) at the current position
    A: VimKeyFunction // (insert) append to the end of the textbox
    I: VimKeyFunction // (insert) at the beginning of the line
    C: VimKeyFunction // (insert) change from here to the end of the line
    S: VimKeyFunction // (insert) substitute the whole line

    h: VimKeyFunction // (move) left 
    l: VimKeyFunction // (move) right
    b: VimKeyFunction // (move) back a word
    e: VimKeyFunction // (move) to the end of the word
    w: VimKeyFunction // (move) to the next character
    "0": VimKeyFunction // move to the beginning of the line
    "_": VimKeyFunction // move to the beginning of the line's text
    "$": VimKeyFunction // move to the end of the line

/*
    f: VimKeyFunction // (move) to the next character
    F: VimKeyFunction // (move) to backwards to the next character
    t: VimKeyFunction // (move) the start of the next character
    T: VimKeyFunction // (move) forwards to the next character
    ";": VimKeyFunction // redo the last f/t search
    ":": VimKeyFunction // reverse search the last f/t

    d: VimKeyFunction // (movement sequence) delete the next 
    c: VimKeyFunction // (insert) (movement sequence) change the next 

    D: VimKeyFunction // delete from here to the end of the line
    x: VimKeyFunction // delete the character under the cursor
    */
    Backspace: VimKeyFunction
    /*

    "1": VimKeyFunction // (repeat-count) execute the command this count times
    "2": VimKeyFunction // (repeat-count) 
    "3": VimKeyFunction // (repeat-count) 
    "4": VimKeyFunction // (repeat-count) 
    "5": VimKeyFunction // (repeat-count) 
    "6": VimKeyFunction // (repeat-count) 
    "7": VimKeyFunction // (repeat-count) 
    "8": VimKeyFunction // (repeat-count) 
    "9": VimKeyFunction // (repeat-count) 


    R: VimKeyFunction // replace mode
    r: VimKeyFunction // (insert?) replace the next character
    "~": VimKeyFunction // flip the case of the character under the cursor

    p: VimKeyFunction // paste the last deleted text
    u: VimKeyFunction // undo the last change
    */
}

type SingleLineVimCallback = (text: string, position: number, isNormal: boolean) => any
type VimKeyFunction = () => void;


export class SingleLineVimBuffer implements SingleLineVimBindings {

    [k: string]: any;
    
    private buffer: string;
    private index: number = 0;
    private normalMode: boolean = true;
    private callback: SingleLineVimCallback;

    constructor(buffer: string, callback: SingleLineVimCallback) {
        this.buffer = buffer;
        this.callback = callback;
    }

    toString = () => {
        return this.buffer;
    }

    isNormal = () => {
        return this.normalMode;
    }

    insert = (key: string) => {
        this.buffer = this.buffer.substr(0, this.index) + key + this.buffer.substr(this.index);
        this.index++;
        this.dispatch();
    }

    private dispatchStack: number = 0;
    private preventDispatch = (count: number) => {
        this.dispatchStack += count;
    }
    private dispatch = () => {
        if (this.dispatchStack > 0) {
            this.dispatchStack--;
            return;
        }
        this.callback(this.buffer, this.index, this.normalMode);
    }
    
    // reverse is useful for commands that share functionality
    private reverse = () => {
        this.buffer = reverse(this.buffer);
        this.index = this.buffer.length - this.index - 1;
    }

    Escape = () => {
        this.normalMode = true;
        this.dispatch();
    }

    a = () => {
        this.index++;
        this.normalMode = false;
        this.dispatch();
    }

    i = () => {
        this.normalMode = false;
        this.dispatch();
    }

    A = () => {
        this.normalMode = false
        this.index = this.buffer.length;
        this.dispatch();
    }

    I = () => {
        this.index = 0;
        this.normalMode = false;
        this.dispatch();
    }

    C = () => {
        this.buffer = this.buffer.substr(0, this.index);
        this.normalMode = false;
        this.dispatch();
    }

    S = () => {
        this.buffer = "";
        this.index = 0;
        this.normalMode = false;
        this.dispatch();
    }

    h = () => {
        this.index = Math.max(0, this.index - 1);
        this.dispatch();
    }

    l = () => {
        this.index = Math.min(this.index + 1, this.buffer.length - 1);
        this.dispatch();
    }

    b = () => {
        this.reverse();
        this.preventDispatch(1)
        this.e()
        this.reverse()
        this.dispatch();
    }

    e = () => {
        let words = findWords(this.buffer.substr(this.index + 1))
        if (words.length == 0) {
            this.index = this.buffer.length - 1;
            this.dispatch();
            return;
        }
        let { length, offset } = words[0];
        this.index += offset + length;
        this.dispatch();
    }

    w = () => {
        let words = findWords(this.buffer.substr(this.index));
        if (words.length < 2) {
            this.index = this.buffer.length - 1;
            this.dispatch();
            return
        }
        let { offset } = words[1];
        this.index += offset;
        this.dispatch();
    }

    "0" = () => {
        this.index = 0;
        this.dispatch();
    }

    "_" = () => {
        this["0"]();
    }

    "$" = () => {
        this.index = this.buffer.length - 1
        this.dispatch();
    }

    Backspace = () => {
        this.buffer = this.buffer.substr(0, this.index - 1) + this.buffer.substr(this.index)
        this.index--;
        this.dispatch();
    }

}