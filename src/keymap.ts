import { Sidebar } from "./sidebar";
import { Cursor } from "./cursor";
import { SingleLineVimBuffer } from "./vim";

/** 
 * This is the main controller that routes keystrokes between the vim buffer and the searchbox
 * 
 * document.onkeydown (and document.addEventListener for that matter) has a particularly 
 * perverse concept of "this", which is most naturally dealt with using an explicit closure 
 * instead of other kinds of encapsulation. I believe this comes from the callback being
 * bound to the GlobalEventHanlders class, preventing it from being bound to other classes.
 * 
 */
export function vimSearchController(searchbox: HTMLInputElement, results: HTMLElement[]) {

    const cursor = new Cursor(searchbox);
    const sidebar = new Sidebar(results);
    const buffer = new SingleLineVimBuffer(searchbox.value, cursor.set);

    let disabled = false;
    cursor.canvas.onclick = () => {
        disabled = true;
        cursor.canvas.style.display = "none";
    }

    document.onkeydown = function(this: GlobalEventHandlers, event: KeyboardEvent) {
        if (disabled) {
            return;
        }

        switch (event.key) {
        case "ArrowLeft":
            buffer.h();
            event.preventDefault();
            return;
        case "ArrowRight":
            buffer.l();
            event.preventDefault();
            return
        case "Escape":
            buffer.Escape();
            event.preventDefault();
            return;
        case "Enter":
            if (!sidebar.select()) {
                searchbox.value = buffer.toString();
                searchbox.focus();
                searchbox.dispatchEvent(new KeyboardEvent("keypress", { ...event }))
            }
            return;
        }

        if (buffer.isNormal()) {
            // map all the vim shortcuts to the vim buffer
            let func = buffer[event.key];
            if (typeof func === "function") {
                func();
                event.preventDefault();
                return;
            }
            switch (event.key) {
            case "j":
                sidebar.down();
                event.preventDefault();
                return;
            case "k":
                sidebar.up();
                event.preventDefault();
                return;
            }
            return
        }

        // mapping for all keys that can be inserted in the buffer.
        if (event.location != 0) {
            // modifier keys are caught by this
            return;
        }

        if (event.getModifierState("Alt") || event.getModifierState("Control") || event.getModifierState("Meta")) {
            // skip ctl, alt, and mod key combinations
            return;
        }

        event.preventDefault();
        if (event.key.length > 1) {
            // some non-character keys are still sent here. we handle them "better"
            switch (event.key) {
            case "Backspace":
                buffer.Backspace();
                return;
            }
            return
        } 

        buffer.insert(event.key)
    };
}
