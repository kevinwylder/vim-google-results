import { Sidebar } from "./sidebar";
import { Cursor } from "./cursor";
import { SingleLineVimBuffer, SingleLineVimBindings, SingleLineVimCallback } from "./vim";

/** 
 * This is the main controller that routes keystrokes between the vim buffer and the searchbox
 * 
 * document.onkeydown (and document.addEventListener for that matter) has a particularly 
 * perverse concept of "this", which is most naturally dealt with using an explicit closure 
 * instead of any other kind of encapsulation.
 * The callback will be bound to the GlobalEventHanlders class instead of any custom controller 
 * 
 */
export function vimSearchController(searchbox: HTMLInputElement, results: HTMLElement[]) {

    // buffer exists if the editor is in normal mode.
    // otherwise, we pass key events through to the input box naturally 
    let buffer: SingleLineVimBindings | undefined;

    const cursor = new Cursor(searchbox);
    const sidebar = new Sidebar(results);

    const bufferCallback: SingleLineVimCallback = (isNormal: boolean, pos: number, text: string) => {
        console.log("vim callback", isNormal, pos, text);
        searchbox.value = text;
        if (!isNormal) {
            searchbox.setSelectionRange(pos, pos);
            searchbox.focus();
            cursor.insert();
            buffer = undefined;
            return;
        }
        cursor.at(pos);
    }

    const enterNormalMode = () => {
        let pos: number;
        if (buffer) {
            // recreate the buffer with initial state, but keep the position
            pos = buffer.position();
        } else {
            // use the "native insert mode" position to create the buffer
            if (!searchbox.selectionStart) {
                pos = 0;
            } else {
                pos = searchbox.selectionStart;
            }
        }
        console.log("enter normal mode at", pos);
        window.scrollTo({ top: 0, behavior: "smooth" });
        cursor.normal();
        cursor.at(pos);
        buffer = new SingleLineVimBuffer(searchbox.value, pos, bufferCallback);
    }
    enterNormalMode();

    searchbox.onkeypress = function (this: GlobalEventHandlers, event: KeyboardEvent) {
        console.log(event.key);
        if (event.key === "Escape") {
            enterNormalMode();
            event.preventDefault();
            return;
        } 
    }

    searchbox.onclick = () => {
        buffer = undefined;
    }

    document.onkeydown = function(this: GlobalEventHandlers, event: KeyboardEvent) {
        if (!buffer) {
            // !buffer implies insert mode. in this case, we allow text to go to the textbox
            return
        }

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
            break;

        case "A":
            buffer.A();
            event.preventDefault();
            break;
        case "C": 
            buffer.C();
            event.preventDefault();
            break;
        case "I":
            buffer.I();
            event.preventDefault();
            break;
        case "S":
            buffer.S();
            event.preventDefault();
            break;
        case "a":
            buffer.a();
            event.preventDefault();
            break;
        case "i":
            buffer.i();
            event.preventDefault();
            break;
        }
    };
}
