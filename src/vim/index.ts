import { reverse, findWords, swapCase } from './strings';
import { FindContext } from './find';

type VimKey = () => void;

type SingleLineVimBindings = {
    [key: string]: VimKey

    Escape: VimKey

    a: VimKey // (insert) append after this cursor
    i: VimKey // (insert) at the current position
    A: VimKey // (insert) append to the end of the textbox
    I: VimKey // (insert) at the beginning of the line
    C: VimKey // (insert) change from here to the end of the line
    S: VimKey // (insert) substitute the whole line

    h: VimKey // (move) left 
    l: VimKey // (move) right
    b: VimKey // (move) back a word
    B: VimKey // (move) back a word
    e: VimKey // (move) to the end of the word
    w: VimKey // (move) to the next character
    "0": VimKey // move to the beginning of the line
    "_": VimKey // move to the beginning of the line's text
    "$": VimKey // move to the end of the line
    "%": VimKey // move to the matching {}, [], or ()

    f: VimKey // (move) to the next character
    F: VimKey // (move) to backwards to the next character
    t: VimKey // (move) the start of the next character
    T: VimKey // (move) forwards to the next character
    ";": VimKey // redo the last f/t search
    ",": VimKey // reverse the search direction

    d: VimKey // (movement sequence) delete the next 
    c: VimKey // (insert) (movement sequence) change the next 
    y: VimKey // copy the next sequence into the register

    D: VimKey // delete from here to the end of the line
    x: VimKey // delete the character under the cursor
    Backspace: VimKey

    "1": VimKey // (repeat-count) execute the command this count times
    "2": VimKey // (repeat-count) 
    "3": VimKey // (repeat-count) 
    "4": VimKey // (repeat-count) 
    "5": VimKey // (repeat-count) 
    "6": VimKey // (repeat-count) 
    "7": VimKey // (repeat-count) 
    "8": VimKey // (repeat-count) 
    "9": VimKey // (repeat-count) 

    R: VimKey // replace mode
    r: VimKey // (insert?) replace the next character
    "~": VimKey // flip the case of the character under the cursor

    p: VimKey // paste the last deleted text or register
    u: VimKey // undo the last change
    ".": VimKey // redo the last search
}

type SingleLineVimCursorCallback = (text: string, position: number, isCursorFat: boolean) => any

enum Mode {
    Normal,
    Insert,
    Replace,
    FindNextChar,
    ReplaceNextChar,
}

export class SingleLineVimBuffer {

    private mode: Mode = Mode.Normal;
    private findContext = new FindContext();

    constructor(
        public buffer: string, 
        public callback: SingleLineVimCursorCallback = () => {}, 
        public index: number = 0) {
    }

    toString = () => {
        return this.buffer;
    }

    nextCharacterIsLiteral = () => {
        return  this.mode == Mode.Insert || 
                this.mode == Mode.FindNextChar || 
                this.mode == Mode.ReplaceNextChar;
    }

    literal = (key: string) => {
        switch(this.mode) {
        case Mode.FindNextChar:
            this.findContext.searchTerm = key;
            this.mode = Mode.Normal;
            this.key[";"]();
            break;
        
        case Mode.ReplaceNextChar:
            this.buffer = this.buffer.substr(0, this.index) + key + this.buffer.substr(this.index + key.length);
            this.mode = Mode.Normal
            break;

        case Mode.Replace:
            this.buffer = this.buffer.substr(0, this.index) + key + this.buffer.substr(this.index + key.length);
            this.index += key.length;
            break;

        default:
            this.buffer = this.buffer.substr(0, this.index) + key + this.buffer.substr(this.index);
            this.index += key.length;
            break;
        }
        this.dispatch();
}

/**
 * Dispatch is an indication that the UI should update the cursor via the callback.
 * If a command has a planned number of keystrokes, then they should call preventDispatch
 * beforehand so that the ui doesn't re-update for each command
 */
private dispatchStack: number = 0;
private preventDispatch = (count: number) => {
    this.dispatchStack += count;
}
private dispatch = () => {
    if (this.index < 0) {
        this.index = 0;
    } else if (this.index > this.buffer.length) {
        this.index = this.buffer.length;
    }
    if (this.dispatchStack > 0) {
        this.dispatchStack--;
        return;
    }
    this.callback(this.buffer, this.index, this.mode != Mode.Insert);
    }
    
    // reverse is useful for commands that share functionality in opposite directions
    private reverse = () => {
        this.buffer = reverse(this.buffer);
        this.index = this.buffer.length - this.index - 1;
    }

    // below are keymappings that share context via closure
    public key: SingleLineVimBindings = {

        Escape: () => {
            this.mode = Mode.Normal;
            this.dispatch();
        },

        a: () => {
            this.index++;
            this.mode = Mode.Insert;
            this.dispatch();
        },

        i: () => {
            this.mode = Mode.Insert;
            this.dispatch();
        },

        A: () => {
            this.mode = Mode.Insert
            this.index = this.buffer.length;
            this.dispatch();
        },

        I: () => {
            this.index = 0;
            this.mode = Mode.Insert;
            this.dispatch();
        },

        C: () => {
            this.buffer = this.buffer.substr(0, this.index);
            this.mode = Mode.Insert;
            this.dispatch();
        },

        S: () => {
            this.buffer = "";
            this.index = 0;
            this.mode = Mode.Insert;
            this.dispatch();
        },

        h: () => {
            this.index--;
            this.dispatch();
        },

        l: () => {
            this.index++;
            this.dispatch();
        },

        B: () => { this.key.b(); },
        b: () => {
            this.reverse();
            this.preventDispatch(1)
            this.key.e()
            this.reverse()
            this.dispatch();
        },

        e: () => {
            let words = findWords(this.buffer.substr(this.index + 1))
            if (words.length == 0) {
                this.index = this.buffer.length - 1;
                this.dispatch();
                return;
            }
            let { length, offset } = words[0];
            this.index += offset + length;
            this.dispatch();
        },

        w: () => {
            let words = findWords(this.buffer.substr(this.index));
            if (words.length < 2) {
                this.index = this.buffer.length - 1;
                this.dispatch();
                return
            }
            let { offset } = words[1];
            this.index += offset;
            this.dispatch();
        },

        "0": () => {
            this.index = 0;
            this.dispatch();
        },

        "_": () => {
            this.key["0"]();
        },

        "$": () => {
            this.index = this.buffer.length - 1
            this.dispatch();
        },
        
        "%": () => { },

        f: () => {
            this.mode = Mode.FindNextChar;
            this.findContext.includeInSearch = true;
            this.findContext.isForwardSearch = true;
        },

        F: () => {
            this.mode = Mode.FindNextChar;
            this.findContext.includeInSearch = true;
            this.findContext.isForwardSearch = false;
        },

        t: () => {
            this.mode = Mode.FindNextChar;
            this.findContext.includeInSearch = false;
            this.findContext.isForwardSearch = true;
        },

        T: () => {
            this.mode = Mode.FindNextChar;
            this.findContext.includeInSearch = false;
            this.findContext.isForwardSearch = false;
        },

        ";": () => {
            this.index += this.findContext.go(this.buffer, this.index);
            this.dispatch();
        },

        ",": () => {
            this.findContext.isForwardSearch = !this.findContext.isForwardSearch
            this.key[";"]();
        },

        d: () => {},
        c: () => {},
        y: () => {},

        D: () => {
            this.buffer = this.buffer.substr(0, this.index);
            this.index--;
            this.dispatch();
        },
        x: () => {
            this.buffer = this.buffer.substr(0, this.index) + this.buffer.substr(this.index + 1);
            this.dispatch();
        },
        Backspace: () => {
            this.buffer = this.buffer.substr(0, this.index - 1) + this.buffer.substr(this.index);
            this.index--;
            this.dispatch();
        },

        "1": () => {},
        "2": () => {},
        "3": () => {},
        "4": () => {},
        "5": () => {},
        "6": () => {},
        "7": () => {},
        "8": () => {},
        "9": () => {},


        R: () => {
            this.mode = Mode.Replace;
        },

        r: () => {
            this.mode = Mode.ReplaceNextChar;
        },

        "~": () => {
            this.buffer = this.buffer.substr(0, this.index) + swapCase(this.buffer[this.index]) + this.buffer.substr(this.index + 1);
            this.index++;
            this.dispatch();
        },

        p: () => {},
        u: () => {},
        ".": () => {},

    }

}